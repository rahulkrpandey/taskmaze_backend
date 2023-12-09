"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const util_1 = require("../util");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.put("/all", middlewares_1.validateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body.data;
        const tasksarr = [];
        data.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
            const job = prisma.task.update({
                where: {
                    id: item.id,
                },
                data: Object.assign({}, item),
            });
            tasksarr.push(job);
        }));
        yield prisma.$transaction(tasksarr);
        res.status(util_1.HttpStatusCode.OK).send("Updated");
    }
    catch (e) {
        next(e);
    }
}));
router.put("/:id", middlewares_1.validateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const task = yield prisma.task.findUnique({
            where: {
                id,
            },
        });
        if (!task) {
            res.status(util_1.HttpStatusCode.NotFound);
            throw new Error("Task does not exist");
        }
        yield prisma.task.update({
            where: {
                id,
            },
            data: Object.assign({}, req.body.data),
        });
        res.status(util_1.HttpStatusCode.OK).send("Task updated");
    }
    catch (e) {
        next(e);
    }
}));
// Create tasks
router.post("/", middlewares_1.validateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.task.create({
            data: Object.assign({}, req.body.data),
        });
        res.status(util_1.HttpStatusCode.Created).send("Project created");
    }
    catch (e) {
        next(e);
    }
}));
// Get all tasks
router.get("/:projectid", middlewares_1.validateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project_id = req.params.projectid;
        const project = yield prisma.project.findFirst({
            where: {
                id: project_id,
            },
        });
        if (!project) {
            res.status(util_1.HttpStatusCode.NotFound);
            throw new Error("Project not found");
        }
        const tasks = yield prisma.task.findMany({
            where: {
                project_id,
            },
            orderBy: {
                order: "asc",
            },
        });
        res.status(util_1.HttpStatusCode.OK).json({
            project,
            tasks,
        });
    }
    catch (e) {
        next(e);
    }
}));
// Get single task
router.get("/one/:id", middlewares_1.validateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const project = yield prisma.task.findFirst({
            where: {
                id,
            },
        });
        if (!project) {
            res.status(util_1.HttpStatusCode.NotFound);
            throw new Error("Task not found");
        }
        res.status(util_1.HttpStatusCode.OK).json(project);
    }
    catch (e) {
        next(e);
    }
}));
router.delete("/:id", middlewares_1.validateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const task = yield prisma.task.findFirst({
            where: {
                id,
            },
        });
        if (!task) {
            res.status(util_1.HttpStatusCode.NotFound);
            throw new Error("Task not found");
        }
        yield prisma.task.delete({
            where: {
                id,
            },
        });
        res.status(util_1.HttpStatusCode.OK).json(task);
    }
    catch (e) {
        next(e);
    }
}));
exports.default = router;
//# sourceMappingURL=task.js.map