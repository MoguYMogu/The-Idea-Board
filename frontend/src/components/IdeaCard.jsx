import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ThumbUp, Schedule, Lightbulb } from "@mui/icons-material";

const IdeaCard = ({ idea, onUpvote, loading }) => {
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleUpvote = async () => {
    if (isUpvoting) return;

    try {
      setIsUpvoting(true);
      await onUpvote(idea.id);
    } catch (error) {
      console.error("Error upvoting idea:", error);
    } finally {
      setIsUpvoting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) => theme.shadows[8],
        },
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Idea indicator */}
      <Box
        sx={{
          position: "absolute",
          top: -8,
          left: 16,
          backgroundColor: (theme) => theme.palette.primary.main,
          borderRadius: "50%",
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <Lightbulb sx={{ color: "white", fontSize: 18 }} />
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 3 }}>
        {/* Content */}
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            lineHeight: 1.6,
            fontSize: "1.1rem",
            color: (theme) => theme.palette.text.primary,
          }}
        >
          {idea.content}
        </Typography>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "auto",
          }}
        >
          {/* Timestamp */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
            }}
          >
            <Schedule sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption">
              {formatDate(idea.createdAt)}
            </Typography>
          </Box>

          {/* Upvote section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={idea.upvotes}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />

            <Tooltip title="Upvote this idea">
              <IconButton
                onClick={handleUpvote}
                disabled={isUpvoting || loading}
                size="small"
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.main,
                  color: "white",
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.primary.dark,
                    transform: "scale(1.1)",
                  },
                  "&:disabled": {
                    backgroundColor: (theme) => theme.palette.action.disabled,
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <ThumbUp sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default IdeaCard;
