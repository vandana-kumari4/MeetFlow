import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";
import dotenv from "dotenv";
import dns from "dns";
dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);

app.use(cors({
  origin: "https://meetflow-eight.vercel.app",
  credentials: true
}));
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

app.get("/api/v1/turn-credentials", async (req, res) => {
  try {
    const response = await fetch(
      `https://${process.env.METERED_DOMAIN}/api/v1/turn/credentials?apiKey=${process.env.METERED_SECRET_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("TURN credentials error:", err);
    res.status(500).json({ error: "Failed to fetch TURN credentials" });
  }
});

app.get("/", (req, res) => {
  res.send("MeetFlow Backend is running 🚀");
});

const start = async () => {
  try {
    const connectionDb = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${connectionDb.connection.host}`);
    server.listen(app.get("port"), () => {
      console.log(`🚀 MeetFlow server running on port ${app.get("port")}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

start();