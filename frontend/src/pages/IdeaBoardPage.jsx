import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const IdeaBoardPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Navigation */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Button
            startIcon={<ArrowBack />}
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ mr: 2 }}
          >
            Back to Home
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            💡 IdeaBoard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center">
          <Typography variant="h3" component="h1" gutterBottom>
            The Idea Board
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Coming soon! This is where the magic happens - share ideas, vote,
            and innovate together.
          </Typography>

          <Box sx={{ fontSize: 120, mb: 4 }}>🚧</Box>

          <Typography variant="body1" color="text.secondary">
            We're building something amazing. Check back soon!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default IdeaBoardPage;
