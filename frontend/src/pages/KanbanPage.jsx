import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
} from '@mui/material';
import { ArrowBack, Dashboard } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import KanbanBoard from '../components/KanbanBoard';

const KanbanPage = () => {
  const navigate = useNavigate();

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
            <Dashboard sx={{ mr: 1, verticalAlign: 'middle' }} />
            Project Management - Kanban Board
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 0 }}>
        <KanbanBoard />
      </Container>
    </Box>
  );
};

export default KanbanPage;