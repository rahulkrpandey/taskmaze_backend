// src/index.ts
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import AuthRoute from "./routes/auth";
import ProjectRoute from "./routes/project";
import TaskRoute from "./routes/task";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { verifyToken } from "./middlewares/sockets";
import { Socket } from "node:dgram";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./util";

dotenv.config();
const app = express();
app.use(express.json());
const server = createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: "https://taskmaze-frontend.vercel.app/",
    methods: ["GET", "POST"],
  },
});
app.use(cors());

app.use("/api/auth", AuthRoute);
app.use("/api/projects", ProjectRoute);
app.use("/api/tasks", TaskRoute);
app.use((err: Error, req: Request, res: Response, next) => {
  console.log(err);
  res.send(err.message);
});

io.use(verifyToken);

io.on("connection", (socket) => {
  console.log("user is connected", socket.id);
  console.log(socket.handshake.auth.TOKEN);
  console.log(socket.request.headers.userId);
  const room = socket.request.headers.userId;

  socket.join(room);

  socket.on("custom_event", (args) => {
    console.log(args);
    // socket.broadcast.to(room).emit(args);
    socket.to(room).emit("custom_event", args);
    // socket.emit("custom_event", args);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("create_project", (args: any) => {
    socket.to(room).emit("create_project", args);
  });

  socket.on("update_project", (arg: any) => {
    socket.to(room).emit("update_project", arg);
  });

  socket.on("delete_project", (projectId: string) => {
    console.log(projectId);
    socket.to(room).emit("delete_project", projectId);
  });

  socket.on("update_kanban", (arg: any) => {
    socket.to(room).emit("update_kanban", arg);
  });
});

server.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT);
});
