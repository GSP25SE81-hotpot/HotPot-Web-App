// server.js
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

// Create Express app
const app = express();
app.use(cors());

// Create HTTP server
const server = createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Basic route for health check
app.get("/", (req, res) => {
  res.send("Socket.IO server is running");
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Authentication
  socket.on("authenticate", (data) => {
    console.log("Authentication request:", data);
    socket.userId = data.userId;
    socket.userRole = data.role;
    console.log(`User ${data.userId} authenticated as ${data.role}`);
  });

  // New chat request
  socket.on("newChatRequest", (data) => {
    console.log("New chat request:", data);
    socket.broadcast.emit("newChatRequest", data);
  });

  // Accept chat
  socket.on("acceptChat", (data) => {
    console.log("Chat accepted:", data);
    io.emit("chatAccepted", data);
  });

  // Send message
  socket.on("sendMessage", (data) => {
    console.log("Message sent:", data);
    io.emit("receiveMessage", data);
  });

  // Mark message as read
  socket.on("markMessageRead", (data) => {
    console.log("Message marked as read:", data);
    io.emit("messageRead", data.messageId);
  });

  // End chat
  socket.on("endChat", (data) => {
    console.log("Chat ended:", data);
    io.emit("chatEnded", data.sessionId);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });

  // Log all events for debugging
  socket.onAny((event, ...args) => {
    console.log(`[EVENT] ${event}:`, args);
  });
});

// Start server
// Replace this with actual server URL in production and port in development
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running at http://localhost:${PORT}/`);
});
