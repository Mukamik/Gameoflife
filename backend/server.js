import express from "express";
import http from "http";
import cors from "cors";
import multer from "multer";
import { Server } from "socket.io";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 4000;

// Session/state storage (in-memory for demo)
const sessions = {};

// Simple upload storage (in-memory, can use disk if needed)
const upload = multer({ dest: 'uploads/' });

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// Upload endpoint
app.post("/api/upload", upload.single("isozip"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  // Generate a session ID
  const sessionId = randomUUID();
  // Store session with file info
  sessions[sessionId] = {
    players: [],
    state: {},
    filename: req.file.filename,
    originalname: req.file.originalname,
    created: Date.now()
  };
  res.json({ sessionId });
});

// List sessions
app.get("/api/sessions", (req, res) => {
  // Return sessions with minimal info
  res.json(Object.entries(sessions).map(([id, info]) => ({
    sessionId: id,
    players: info.players.length,
    originalname: info.originalname
  })));
});

// Join session
app.post("/api/join", (req, res) => {
  const { sessionId } = req.body;
  if (!sessions[sessionId]) return res.status(404).json({ error: "Session not found" });
  res.json({ ok: true });
});

// Serve uploaded file (to emulator)
app.get("/api/session/:sessionId/iso", (req, res) => {
  const { sessionId } = req.params;
  const session = sessions[sessionId];
  if (!session) return res.status(404).send("Session not found");
  const filePath = path.join("uploads", session.filename);
  res.download(filePath, session.originalname);
});

// WebSocket for multiplayer
io.on("connection", (socket) => {
  socket.on("join-session", ({ sessionId }) => {
    socket.join(sessionId);
    // Track player in session
    if (sessions[sessionId] && !sessions[sessionId].players.includes(socket.id)) {
      sessions[sessionId].players.push(socket.id);
    }
    io.to(sessionId).emit("player-count", sessions[sessionId]?.players.length || 0);
  });

  socket.on("player-action", ({ sessionId, action }) => {
    // Broadcast action to all in session
    socket.to(sessionId).emit("player-action", { playerId: socket.id, action });
    // (Optional: update session state here)
  });

  socket.on("disconnect", () => {
    // Remove player from sessions
    for (const [sid, sess] of Object.entries(sessions)) {
      sess.players = sess.players.filter(id => id !== socket.id);
    }
  });
});

server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));