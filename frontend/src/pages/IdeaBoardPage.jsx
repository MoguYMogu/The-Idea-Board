import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Grid,
  Paper,
  TextField,
  Card,
  CardContent,
  IconButton,
  Chip,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Divider,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  Add,
  ThumbUp,
  Search,
  FilterList,
  Lightbulb,
  TrendingUp,
  Schedule,
  Delete,
  Refresh,
  SortByAlpha,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const IdeaBoardPage = () => {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [upvoteLoading, setUpvoteLoading] = useState({});
  const [searchText, setSearchText] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newIdea, setNewIdea] = useState({ content: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'oldest', 'popular', 'unpopular'
  const [apiError, setApiError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Mock API endpoints (replace with actual API calls)
  const API_BASE = "http://localhost:5000/api";

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Fetch ideas from API with retry logic
  const fetchIdeas = async (retries = 3) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/ideas`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.success) {
        setIdeas(data.data);
        setFilteredIdeas(data.data);
        setApiError(false);
        setRetryCount(0);
        if (retryCount > 0) {
          showSnackbar("Connection restored! ✅", "success");
        }
      } else {
        throw new Error(data.error || "Failed to fetch ideas");
      }
    } catch (error) {
      console.error("Error fetching ideas:", error);
      setApiError(true);
      
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        setRetryCount(3 - retries + 1);
        setTimeout(() => fetchIdeas(retries - 1), 2000);
        return;
      }
      
      // Use mock data if all retries fail
      const mockIdeas = [
        {
          id: "1",
          content: "Build a mobile app for plant care reminders",
          upvotes: 15,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          content: "Create a virtual reality meditation experience",
          upvotes: 23,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          content:
            "Develop an AI-powered recipe suggestion app based on available ingredients",
          upvotes: 8,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "4",
          content: "Design a collaborative coding platform for students",
          upvotes: 32,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "5",
          content: "Build a smart home energy management system",
          upvotes: 19,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
      ];
      setIdeas(mockIdeas);
      setFilteredIdeas(mockIdeas);
      showSnackbar(
        "⚠️ Using offline mode. Check your connection and try refreshing.", 
        "warning"
      );
    } finally {
      setLoading(false);
    }
  };

  // Add new idea with improved error handling
  const handleAddIdea = async () => {
    if (!newIdea.content.trim()) {
      showSnackbar("Please enter an idea", "error");
      return;
    }

    if (newIdea.content.length > 280) {
      showSnackbar("Ideas must be 280 characters or less", "error");
      return;
    }

    setSubmitLoading(true);
    try {
      const response = await fetch(`${API_BASE}/ideas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newIdea.content.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const updatedIdeas = [data.data, ...ideas];
        setIdeas(updatedIdeas);
        applyFiltersAndSort(updatedIdeas, searchText, sortBy);
        setNewIdea({ content: "" });
        setOpenAddDialog(false);
        showSnackbar("Idea added successfully! 🎉");
        setApiError(false);
      } else {
        throw new Error(data.error || "Failed to add idea");
      }
    } catch (error) {
      console.error("Error adding idea:", error);
      setApiError(true);
      
      // Fallback to local state if API fails
      const newIdeaObj = {
        id: Date.now().toString(),
        content: newIdea.content.trim(),
        upvotes: 0,
        createdAt: new Date().toISOString(),
      };
      const updatedIdeas = [newIdeaObj, ...ideas];
      setIdeas(updatedIdeas);
      applyFiltersAndSort(updatedIdeas, searchText, sortBy);
      setNewIdea({ content: "" });
      setOpenAddDialog(false);
      showSnackbar("Idea saved locally! Will sync when connection is restored. 💡", "warning");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Upvote idea with loading state
  const handleUpvote = async (ideaId) => {
    setUpvoteLoading(prev => ({ ...prev, [ideaId]: true }));
    
    try {
      const response = await fetch(`${API_BASE}/ideas/${ideaId}/upvote`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const updatedIdeas = ideas.map((idea) =>
          idea.id === ideaId ? { ...idea, upvotes: data.data.upvotes } : idea
        );
        setIdeas(updatedIdeas);
        applyFiltersAndSort(updatedIdeas, searchText, sortBy);
        showSnackbar("Thanks for your upvote! 👍");
        setApiError(false);
      } else {
        throw new Error(data.error || "Failed to upvote");
      }
    } catch (error) {
      console.error("Error upvoting idea:", error);
      setApiError(true);
      
      // Fallback to local state
      const updatedIdeas = ideas.map((idea) =>
        idea.id === ideaId ? { ...idea, upvotes: idea.upvotes + 1 } : idea
      );
      setIdeas(updatedIdeas);
      applyFiltersAndSort(updatedIdeas, searchText, sortBy);
      showSnackbar("Upvote saved locally! Will sync when connection is restored. 👍", "warning");
    } finally {
      setUpvoteLoading(prev => ({ ...prev, [ideaId]: false }));
    }
  };

  // Refresh data manually
  const handleRefresh = () => {
    setRetryCount(0);
    fetchIdeas();
  };

  // Delete idea (local only for demo)
  const handleDeleteIdea = (ideaId) => {
    const updatedIdeas = ideas.filter((idea) => idea.id !== ideaId);
    setIdeas(updatedIdeas);
    applyFiltersAndSort(updatedIdeas, searchText, sortBy);
    showSnackbar("Idea deleted");
  };

  // Apply filters and sorting
  const applyFiltersAndSort = (ideasList, search, sort) => {
    let filtered = ideasList;

    // Apply search filter
    if (search.trim()) {
      filtered = filtered.filter((idea) =>
        idea.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply sorting
    switch (sort) {
      case "popular":
        filtered.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case "unpopular":
        filtered.sort((a, b) => a.upvotes - b.upvotes);
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredIdeas(filtered);
  };

  // Handle search
  const handleSearch = (searchValue) => {
    setSearchText(searchValue);
    applyFiltersAndSort(ideas, searchValue, sortBy);
  };

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    applyFiltersAndSort(ideas, searchText, newSort);
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Navigation */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Button
            startIcon={<ArrowBack />}
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ mr: 2 }}
          >
            Back to Home
          </Button>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 600 }}
          >
            💡 IdeaBoard - Community Innovation Hub
          </Typography>
          <IconButton color="inherit" onClick={handleRefresh} disabled={loading}>
            <Refresh />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Connection Status */}
        {apiError && (
          <Paper 
            sx={{ 
              p: 2, 
              mb: 3, 
              backgroundColor: '#fff3cd',
              borderLeft: '4px solid #ffc107',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Typography variant="body2" sx={{ color: '#856404', flex: 1 }}>
              ⚠️ Working in offline mode. Your changes will be saved locally.
              {retryCount > 0 && ` (Retry attempt ${retryCount}/3)`}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={handleRefresh}
              disabled={loading}
              sx={{ 
                borderColor: '#ffc107',
                color: '#856404',
                '&:hover': { borderColor: '#e0a800', backgroundColor: '#fff3cd' }
              }}
            >
              Retry Connection
            </Button>
          </Paper>
        )}

        {/* Header Stats */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <Box sx={{ textAlign: "center", color: "white" }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Community Idea Board
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              Share your innovative ideas and help others grow theirs!
            </Typography>

            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {ideas.length}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Lightbulb sx={{ mr: 0.5, fontSize: 18 }} />
                    <Typography variant="body2">Total Ideas</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {ideas.reduce((sum, idea) => sum + idea.upvotes, 0)}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TrendingUp sx={{ mr: 0.5, fontSize: 18 }} />
                    <Typography variant="body2">Total Upvotes</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Controls */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              Ideas Dashboard
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAddDialog(true)}
              sx={{ bgcolor: "#6E39CB" }}
            >
              Share New Idea
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              placeholder="Search ideas..."
              size="small"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />

            <Button
              variant={sortBy === "newest" ? "contained" : "outlined"}
              size="small"
              onClick={() => handleSortChange("newest")}
            >
              Newest
            </Button>
            <Button
              variant={sortBy === "popular" ? "contained" : "outlined"}
              size="small"
              onClick={() => handleSortChange("popular")}
            >
              Most Popular
            </Button>
            <Button
              variant={sortBy === "oldest" ? "contained" : "outlined"}
              size="small"
              onClick={() => handleSortChange("oldest")}
            >
              Oldest
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Showing {filteredIdeas.length} of {ideas.length} ideas
          </Typography>
        </Paper>

        {/* Ideas Grid */}
        {loading && ideas.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : filteredIdeas.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center" }}>
            <Lightbulb sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              {searchText ? "No ideas found" : "No ideas yet!"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {searchText
                ? "Try adjusting your search terms."
                : "Be the first to share an innovative idea!"}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredIdeas.map((idea) => (
              <Grid item xs={12} sm={6} lg={4} key={idea.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                    >
                      <Avatar sx={{ bgcolor: "#6E39CB", mr: 2, mt: 0.5 }}>
                        <Lightbulb />
                      </Avatar>
                      <Typography
                        variant="body1"
                        sx={{ flexGrow: 1, lineHeight: 1.6 }}
                      >
                        {idea.content}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Schedule
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatTimeAgo(idea.createdAt)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Chip
                          label={idea.upvotes}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleUpvote(idea.id)}
                          disabled={upvoteLoading[idea.id]}
                          sx={{
                            bgcolor: "primary.main",
                            color: "white",
                            "&:hover": { bgcolor: "primary.dark" },
                          }}
                        >
                          {upvoteLoading[idea.id] ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <ThumbUp fontSize="small" />
                          )}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteIdea(idea.id)}
                          sx={{ color: "error.main" }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Add Idea Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Lightbulb sx={{ mr: 1, color: "#6E39CB" }} />
            Share Your Idea
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Your Idea"
            fullWidth
            multiline
            rows={4}
            value={newIdea.content}
            onChange={(e) =>
              setNewIdea({ ...newIdea, content: e.target.value })
            }
            placeholder="What's your innovative idea? (max 280 characters)"
            helperText={`${newIdea.content.length}/280 characters`}
            error={newIdea.content.length > 280}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} disabled={submitLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleAddIdea}
            variant="contained"
            sx={{ bgcolor: "#6E39CB" }}
            disabled={!newIdea.content.trim() || newIdea.content.length > 280 || submitLoading}
            startIcon={submitLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {submitLoading ? "Sharing..." : "Share Idea"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default IdeaBoardPage;
