import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import ideasRouter from "./routes/ideas.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Make io available to routes
app.set("io", io);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "IdeaBoard API is running",
    timestamp: new Date().toISOString(),
  });
});

// Database connectivity check endpoint
app.get("/health/database", async (req, res) => {
  try {
    // Test database connection
    await prisma.$connect();
    const result = await prisma.$executeRaw`SELECT 1 as test`;
    
    res.status(200).json({
      status: "OK",
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        url: process.env.DATABASE_URL?.replace(/:[^:]*@/, ':***@') || "Not configured"
      }
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Database connection failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// API Routes
app.use("/api/ideas", ideasRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// 404 handler - must be last
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });

  socket.on("join-ideas-room", () => {
    socket.join("ideas");
    console.log(`📡 Client ${socket.id} joined ideas room`);
  });
});

// Start server
server.listen(port, () => {
  console.log(`🚀 IdeaBoard API Server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🔌 WebSocket server ready for real-time updates`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});

export { prisma };
