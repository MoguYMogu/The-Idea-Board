import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Grid,
  Alert,
  CircularProgress,
  Snackbar,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  Refresh,
  TrendingUp,
  Schedule,
  Lightbulb,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useIdeas } from '../hooks/useIdeas';
import IdeaForm from '../components/IdeaForm';
import IdeaCard from '../components/IdeaCard';

const IdeaBoardPage = () => {
  const navigate = useNavigate();
  const { ideas, loading, error, createIdea, upvoteIdea, fetchIdeas } = useIdeas();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [submitting, setSubmitting] = useState(false);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCreateIdea = async (content) => {
    try {
      setSubmitting(true);
      await createIdea(content);
      showSnackbar('Idea shared successfully! 🎉');
    } catch (err) {
      showSnackbar(err.message, 'error');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (ideaId) => {
    try {
      await upvoteIdea(ideaId);
      showSnackbar('Thanks for your upvote! 👍');
    } catch (err) {
      showSnackbar(err.message, 'error');
    }
  };

  const handleRefresh = () => {
    fetchIdeas();
    showSnackbar('Ideas refreshed! 🔄');
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchIdeas();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchIdeas]);

  const totalUpvotes = ideas.reduce((sum, idea) => sum + idea.upvotes, 0);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navigation */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Button
            startIcon={<ArrowBack />}
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Back to Home
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            💡 IdeaBoard - Share & Discover
          </Typography>
          <Tooltip title="Refresh ideas">
            <IconButton color="inherit" onClick={handleRefresh} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Stats */}
        <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              The Idea Board
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              Where innovation meets inspiration - share your ideas and help others grow!
            </Typography>
            
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {ideas.length}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lightbulb sx={{ mr: 0.5, fontSize: 18 }} />
                    <Typography variant="body2">Ideas Shared</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {totalUpvotes}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp sx={{ mr: 0.5, fontSize: 18 }} />
                    <Typography variant="body2">Total Upvotes</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Idea Submission Form */}
        <IdeaForm onSubmit={handleCreateIdea} loading={submitting} />

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body2">
              {error}
            </Typography>
            <Button size="small" onClick={handleRefresh} sx={{ mt: 1 }}>
              Try Again
            </Button>
          </Alert>
        )}

        {/* Ideas Grid */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Community Ideas
            </Typography>
            {ideas.length > 0 && (
              <Chip
                icon={<Schedule />}
                label="Live Updates"
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
          </Box>

          {loading && ideas.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress size={60} />
                <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                  Loading amazing ideas...
                </Typography>
              </Box>
            </Box>
          ) : ideas.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', backgroundColor: '#fafafa' }}>
              <Lightbulb sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                No ideas yet!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Be the first to share your brilliant idea with the community.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                💡 Every great innovation started with a simple idea.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {ideas.map((idea) => (
                <Grid item xs={12} sm={6} lg={4} key={idea.id}>
                  <IdeaCard idea={idea} onUpvote={handleUpvote} loading={loading} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Live indicator */}
        {ideas.length > 0 && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#4caf50',
                  mr: 1,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 },
                  },
                }}
              />
              Live updates every 30 seconds
            </Typography>
          </Box>
        )}
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default IdeaBoardPage;
