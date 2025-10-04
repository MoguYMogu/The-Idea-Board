import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  IconButton,
  Button,
  Paper,
  Stack,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";

import { Search as SearchIcon } from "@mui/icons-material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import GroupIcon from "@mui/icons-material/Group";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Mock avatar URLs
const avatars = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/45.jpg",
  "https://randomuser.me/api/portraits/women/46.jpg",
];

// Initial Kanban data
const initialColumns = [
  {
    id: "todo",
    title: "To Do task",
    tasks: [
      {
        id: "1",
        title: "Webdev",
        team: "Cisco Team",
        days: 12,
        attachments: 7,
        comments: 8,
        avatars: [0, 1, 2, 3],
      },
      {
        id: "2",
        title: "Create a new theme",
        team: "Gento Team",
        days: 9,
        attachments: 3,
        comments: 5,
        avatars: [1, 2, 3],
      },
      {
        id: "3",
        title: "Improve social banners",
        team: "Developing Team",
        days: 17,
        attachments: 5,
        comments: 9,
        avatars: [0, 2, 3],
      },
      {
        id: "4",
        title: "Health app",
        team: "Design Team",
        days: 21,
        attachments: 2,
        comments: 7,
        avatars: [1, 2, 3],
      },
    ],
  },
  {
    id: "progress1",
    title: "In Progress",
    tasks: [
      {
        id: "5",
        title: "Cloud computing",
        team: "Gento Team",
        days: 31,
        attachments: 2,
        comments: 0,
        avatars: [0, 1, 2, 3],
      },
      {
        id: "6",
        title: "Update subscription",
        team: "Developing Team",
        days: 15,
        attachments: 5,
        comments: 4,
        avatars: [1, 2, 3],
      },
      {
        id: "7",
        title: "Poster design",
        team: "Design Team",
        days: 5,
        attachments: 10,
        comments: 4,
        avatars: [0, 2, 3],
      },
    ],
  },
  {
    id: "progress2",
    title: "In Progress",
    tasks: [
      {
        id: "8",
        title: "Landing page",
        team: "Design Team",
        days: 11,
        attachments: 7,
        comments: 8,
        avatars: [1, 2, 3],
      },
      {
        id: "9",
        title: "Food app design",
        team: "Design Team",
        days: 21,
        attachments: 4,
        comments: 5,
        avatars: [0, 2, 3],
      },
      {
        id: "10",
        title: "Web design",
        team: "Cisco Team",
        days: 14,
        attachments: 12,
        comments: 8,
        avatars: [1, 2, 3],
      },
      {
        id: "11",
        title: "Flyer design",
        team: "Developing Team",
        days: 22,
        attachments: 5,
        comments: 13,
        avatars: [0, 2, 3],
      },
      {
        id: "12",
        title: "Cloud computing",
        team: "Gento Team",
        days: 12,
        attachments: 6,
        comments: 7,
        avatars: [1, 2, 3],
      },
    ],
  },
];

export default function Kanban() {
  const [columns, setColumns] = useState(initialColumns);
  const [searchText, setSearchText] = useState("");
  const [date, setDate] = useState(new Date());
  const [openAdd, setOpenAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", team: "", days: 1 });

  // Handle drag end
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const srcIdx = columns.findIndex((c) => c.id === source.droppableId);
    const dstIdx = columns.findIndex((c) => c.id === destination.droppableId);
    const srcTasks = Array.from(columns[srcIdx].tasks);
    const [moved] = srcTasks.splice(source.index, 1);

    if (srcIdx === dstIdx) {
      srcTasks.splice(destination.index, 0, moved);
      const updated = [...columns];
      updated[srcIdx].tasks = srcTasks;
      setColumns(updated);
    } else {
      const dstTasks = Array.from(columns[dstIdx].tasks);
      dstTasks.splice(destination.index, 0, moved);
      const updated = [...columns];
      updated[srcIdx].tasks = srcTasks;
      updated[dstIdx].tasks = dstTasks;
      setColumns(updated);
    }
  };

  // Add task dialog submit
  const handleAddTask = () => {
    if (!newTask.title) return;
    const id = Date.now().toString();
    const updated = [...columns];
    updated[0].tasks.unshift({
      id,
      title: newTask.title,
      team: newTask.team || "New Team",
      days: newTask.days,
      attachments: 0,
      comments: 0,
      avatars: [0, 1, 2],
    });
    setColumns(updated);
    setNewTask({ title: "", team: "", days: 1 });
    setOpenAdd(false);
  };

  // Remove a task
  const handleRemoveTask = (colIdx, taskIdx) => {
    const updated = [...columns];
    updated[colIdx].tasks.splice(taskIdx, 1);
    setColumns(updated);
  };

  // Filter tasks
  const filterTasks = (tasks) =>
    tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(searchText.toLowerCase()) ||
        t.team.toLowerCase().includes(searchText.toLowerCase())
    );

  return (
    <Paper sx={{ margin: 3, height: "auto", borderRadius: "8px", p: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Edit or modify all cards as you want
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1} flexDirection="column">
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ fontWeight: 500, fontSize: "22px" }}
          >
            Teams Members:
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Stack direction="row" spacing={-1}>
              {avatars.map((src, i) => (
                <Avatar
                  key={i}
                  src={src}
                  sx={{ width: 32, height: 32, border: "2px solid #fff" }}
                />
              ))}
            </Stack>
            <IconButton sx={{ bgcolor: "background.default" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M18 16.08C17.24 16.08 16.56 16.38 16.05 16.88L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.11C16.5 7.62 17.21 7.92 18 7.92C19.66 7.92 21 6.58 21 4.96C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 4.96C15 5.2 15.04 5.43 15.09 5.66L8.04 9.85C7.5 9.34 6.79 9.04 6 9.04C4.34 9.04 3 10.38 3 12C3 13.62 4.34 14.96 6 14.96C6.79 14.96 7.5 14.66 8.04 14.15L15.14 18.34C15.09 18.56 15.05 18.79 15.05 19.04C15.05 20.66 16.39 22 18.05 22C19.71 22 21.05 20.66 21.05 19.04C21.05 17.42 19.71 16.08 18.05 16.08Z"
                  fill="#6e39cb"
                />
              </svg>
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ mb: 3 }} />
      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={{
            gap: 2,
            display: "flex",
            alignItems: { xs: "left", md: "center" },
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <TextField
            placeholder="Search projects"
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: "background.default",
              borderRadius: 2,
              minWidth: 220,
            }}
          />
          <TextField
            size="small"
            type="date"
            value={format(date, "yyyy-MM-dd")}
            onChange={(e) => setDate(new Date(e.target.value))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: "background.default",
              borderRadius: 2,
              minWidth: 180,
            }}
          />
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{
            borderRadius: 2,
            minWidth: 120,
            color: "primary.main",

            px: 2,
            py: 1,
            cursor: "pointer",
            width: "fit-content",
            userSelect: "none",
          }}
        >
          <IconButton
            sx={{
              bgcolor: "background.default",
              p: 0.5,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18 16.08C17.24 16.08 16.56 16.38 16.05 16.88L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.11C16.5 7.62 17.21 7.92 18 7.92C19.66 7.92 21 6.58 21 4.96C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 4.96C15 5.2 15.04 5.43 15.09 5.66L8.04 9.85C7.5 9.34 6.79 9.04 6 9.04C4.34 9.04 3 10.38 3 12C3 13.62 4.34 14.96 6 14.96C6.79 14.96 7.5 14.66 8.04 14.15L15.14 18.34C15.09 18.56 15.05 18.79 15.05 19.04C15.05 20.66 16.39 22 18.05 22C19.71 22 21.05 20.66 21.05 19.04C21.05 17.42 19.71 16.08 18.05 16.08Z"
                fill="#6e39cb"
              />
            </svg>
          </IconButton>

          <Box component="span" fontWeight={500}>
            Apply Filter
          </Box>
        </Box>
      </Box>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            justifyContent: "center",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
          }}
        >
          {columns.map((col, colIdx) => (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{ width: 320 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: "#fff",
                      borderRadius: 3,
                      p: 2,
                      mb: 2,
                      borderTop: colIdx === 1 ? "3px solid #6E39CB" : "none",
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {col.title}
                      </Typography>
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    {colIdx === 0 && (
                      <Paper
                        variant="outlined"
                        onClick={() => setOpenAdd(true)}
                        sx={{
                          border: "1.5px dashed #6E39CB",
                          borderRadius: 2,
                          p: 1,
                          mb: 2,
                          bgcolor: "#fafafd",
                          textAlign: "center",
                          cursor: "pointer",
                        }}
                      >
                        <AddIcon sx={{ color: "#6E39CB" }} />
                      </Paper>
                    )}
                    <Stack spacing={2}>
                      {col.tasks.map((task, tIdx) => {
                        const matches =
                          task.title
                            .toLowerCase()
                            .includes(searchText.toLowerCase()) ||
                          task.team
                            .toLowerCase()
                            .includes(searchText.toLowerCase());
                        return (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={tIdx}
                          >
                            {(provided) => (
                              <Paper
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                elevation={0}
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  boxShadow: "0 2px 8px rgba(34,37,41,0.04)",
                                  border: "1px solid #f0f0f0",
                                  position: "relative",
                                  display: matches ? undefined : "none",
                                }}
                              >
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Typography fontWeight={600}>
                                    {task.title}
                                  </Typography>
                                  <Chip
                                    label={`${task.days} Days`}
                                    size="small"
                                    sx={{
                                      bgcolor: "#fafafd",
                                      color: "#6E39CB",
                                      fontWeight: 500,
                                      fontSize: 13,
                                    }}
                                  />
                                </Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  mb={1}
                                >
                                  {task.team}
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                <Box display="flex" alignItems="center" gap={2}>
                                  <AttachFileIcon
                                    sx={{ fontSize: 18, color: "#A0A0A0" }}
                                  />
                                  <Typography variant="caption">
                                    {task.attachments}
                                  </Typography>
                                  <ChatBubbleOutlineIcon
                                    sx={{
                                      fontSize: 18,
                                      color: "#A0A0A0",
                                      ml: 1,
                                    }}
                                  />
                                  <Typography variant="caption">
                                    {task.comments}
                                  </Typography>
                                  <Box flexGrow={1} />
                                  <Stack direction="row" spacing={-1}>
                                    {task.avatars.map((aIdx) => (
                                      <Avatar
                                        key={aIdx}
                                        src={avatars[aIdx]}
                                        sx={{
                                          width: 24,
                                          height: 24,
                                          border: "2px solid #fff",
                                        }}
                                      />
                                    ))}
                                  </Stack>
                                  <IconButton
                                    size="small"
                                    sx={{ ml: 1 }}
                                    onClick={() =>
                                      handleRemoveTask(colIdx, tIdx)
                                    }
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Paper>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </Stack>
                  </Paper>
                </Box>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
      {/* Pagination Dots */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Box
          sx={{
            width: 10,
            height: 10,
            bgcolor: "#6E39CB",
            borderRadius: "50%",
            mx: 0.5,
          }}
        />
        <Box
          sx={{
            width: 10,
            height: 10,
            bgcolor: "#e0e0e0",
            borderRadius: "50%",
            mx: 0.5,
          }}
        />
        <Box
          sx={{
            width: 10,
            height: 10,
            bgcolor: "#e0e0e0",
            borderRadius: "50%",
            mx: 0.5,
          }}
        />
      </Box>
      {/* Add Task Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="dense"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <TextField
            label="Team"
            fullWidth
            margin="dense"
            value={newTask.team}
            onChange={(e) => setNewTask({ ...newTask, team: e.target.value })}
          />
          <TextField
            label="Days"
            type="number"
            fullWidth
            margin="dense"
            value={newTask.days}
            onChange={(e) =>
              setNewTask({ ...newTask, days: Number(e.target.value) })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button
            onClick={handleAddTask}
            variant="contained"
            sx={{ bgcolor: "#6E39CB" }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}