import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Lightbulb,
  People,
  TrendingUp,
  Speed,
  Security,
  Cloud,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const features = [
    {
      icon: (
        <Lightbulb sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      ),
      title: "Instant Idea Sharing",
      description:
        "Share your brilliant ideas instantly with the community. No registration required - just pure creativity flowing freely.",
    },
    {
      icon: <People sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Community-Driven",
      description:
        "Join a vibrant community of innovators, creators, and thinkers. Discover ideas that inspire and contribute to collective wisdom.",
    },
    {
      icon: (
        <TrendingUp sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      ),
      title: "Real-Time Voting",
      description:
        "See the best ideas rise to the top with our live upvoting system. Watch popularity shift in real-time as the community decides.",
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Lightning Fast",
      description:
        "Built with modern technology for instant responses. Submit ideas and see results immediately with our optimized infrastructure.",
    },
  ];

  const additionalFeatures = [
    { icon: <Security />, text: "Anonymous & Safe" },
    { icon: <Cloud />, text: "Cloud-Powered" },
    { icon: <Speed />, text: "Real-Time Updates" },
  ];

  return (
    <Box>
      {/* Navigation */}
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: "white", borderBottom: "1px solid #e0e0e0" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              color: theme.palette.primary.main,
              fontWeight: "bold",
            }}
          >
            💡 IdeaBoard
          </Typography>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => navigate("/app")}
            sx={{ ml: 2 }}
          >
            Launch App
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant={isMobile ? "h3" : "h1"}
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700, mb: 3 }}
              >
                Where Great Ideas
                <br />
                <span style={{ color: theme.palette.secondary.light }}>
                  Come to Life
                </span>
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}
              >
                Join thousands of innovators sharing ideas, getting feedback,
                and building the future together. Your next breakthrough is just
                one idea away.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/app")}
                  sx={{
                    backgroundColor: theme.palette.secondary.main,
                    color: "white",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.dark,
                    },
                  }}
                >
                  Start Sharing Ideas
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: { xs: 200, md: 400 },
                }}
              >
                <Box
                  sx={{
                    fontSize: { xs: 120, md: 200 },
                    opacity: 0.3,
                    animation: "float 6s ease-in-out infinite",
                    "@keyframes float": {
                      "0%": { transform: "translateY(0px)" },
                      "50%": { transform: "translateY(-20px)" },
                      "100%": { transform: "translateY(0px)" },
                    },
                  }}
                >
                  💡
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            Why Choose IdeaBoard?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Built for creators, innovators, and dreamers who want to share their
            vision with the world
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  height: "100%",
                  p: 3,
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box
        sx={{ backgroundColor: theme.palette.grey[50], py: { xs: 6, md: 8 } }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} md={4}>
              <Typography
                variant="h3"
                color="primary"
                sx={{ fontWeight: 700, mb: 1 }}
              >
                1000+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Ideas Shared
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography
                variant="h3"
                color="primary"
                sx={{ fontWeight: 700, mb: 1 }}
              >
                500+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Active Users
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography
                variant="h3"
                color="primary"
                sx={{ fontWeight: 700, mb: 1 }}
              >
                24/7
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Always Online
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: { xs: 8, md: 12 }, textAlign: "center" }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            Ready to Share Your Next Big Idea?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.6 }}
          >
            Join our community of innovators and let your creativity shine.
            Every great product started with a simple idea.
          </Typography>

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}
          >
            {additionalFeatures.map((feature, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                {feature.icon}
                <Typography variant="body2" color="text.secondary">
                  {feature.text}
                </Typography>
              </Box>
            ))}
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/app")}
            sx={{
              px: 6,
              py: 2,
              fontSize: "1.2rem",
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              "&:hover": {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
              },
            }}
          >
            Launch IdeaBoard Now
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: theme.palette.grey[900],
          color: "white",
          py: 4,
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © 2025 IdeaBoard. Built with ❤️ for the creator community.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
