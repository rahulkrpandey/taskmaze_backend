"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const project_1 = __importDefault(require("./routes/project"));
const task_1 = __importDefault(require("./routes/task"));
const cors_1 = __importDefault(require("cors"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const sockets_1 = require("./middlewares/sockets");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN_URL,
        methods: ["GET", "POST"],
    },
});
app.use((0, cors_1.default)());
app.use("/api/auth", auth_1.default);
app.use("/api/projects", project_1.default);
app.use("/api/tasks", task_1.default);
app.use((err, req, res, next) => {
    console.log(err);
    res.send(err.message);
});
io.use(sockets_1.verifyToken);
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
    socket.on("create_project", (args) => {
        socket.to(room).emit("create_project", args);
    });
    socket.on("update_project", (arg) => {
        socket.to(room).emit("update_project", arg);
    });
    socket.on("delete_project", (projectId) => {
        console.log(projectId);
        socket.to(room).emit("delete_project", projectId);
    });
    socket.on("update_kanban", (arg) => {
        socket.to(room).emit("update_kanban", arg);
    });
});
server.listen(process.env.PORT, () => {
    console.log("Listening on port", process.env.PORT);
});
//# sourceMappingURL=index.js.map