"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const middlewares_1 = require("../middlewares");
const util_1 = require("../util");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.put("/:id", middlewares_1.validateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const project = yield prisma.project.findUnique({
            where: {
                id,
            },
        });
        if (!project) {
            res.status(util_1.HttpStatusCode.NotFound);
            throw new Error("Project does not exist");
        }
        const { usernames } = req.headers;
        if (!project.users.includes(usernames[0])) {
            res.status(util_1.HttpStatusCode.Unauthorized);
            throw new Error("You are not authorized");
        }
        yield prisma.project.update({
            where: {
                id,
            },
            data: Object.assign({}, req.body.data),
        });
        res.status(util_1.HttpStatusCode.OK).send("Project updated");
    }
    catch (e) {
        next(e);
    }
}));
// Create projects
router.post("/", middlewares_1.validateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usernames } = req.headers;
        const users = usernames;
        console.log(users);
        yield prisma.project.create({
            data: Object.assign(Object.assign({}, req.body.data), { users }),
        });
        res.status(util_1.HttpStatusCode.Created).send("Project created");
    }
    catch (e) {
        next(e);
    }
}));
// Get all projects
router.get("/", middlewares_1.validateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usernames } = req.headers;
        const user = usernames[0];
        const projects = yield prisma.project.findMany({
            where: {
                users: {
                    has: user,
                },
            },
        });
        res.status(util_1.HttpStatusCode.OK).json(projects);
    }
    catch (e) {
        next(e);
    }
}));
router.get("/:id", middlewares_1.validateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const project = yield prisma.project.findFirst({
            where: {
                id,
            },
        });
        if (!project) {
            res.status(util_1.HttpStatusCode.NotFound);
            throw new Error("Project not found");
        }
        const { usernames } = req.headers;
        console.log(usernames);
        if (!project.users.includes(usernames[0])) {
            express_1.response.status(util_1.HttpStatusCode.Unauthorized);
            throw new Error("You are not authorized");
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
        const project = yield prisma.project.findFirst({
            where: {
                id,
            },
        });
        if (!project) {
            res.status(util_1.HttpStatusCode.NotFound);
            throw new Error("Project not found");
        }
        const { usernames } = req.headers;
        if (!usernames) {
            throw new Error("User not found");
        }
        if (!project.users.includes(usernames[0])) {
            res.status(util_1.HttpStatusCode.Unauthorized);
            throw new Error("You are not authorized");
        }
        yield prisma.project.delete({
            where: {
                id,
            },
        });
        res.status(util_1.HttpStatusCode.OK).send("Project deleted");
    }
    catch (e) {
        next(e);
    }
}));
exports.default = router;
//# sourceMappingURL=project.js.map