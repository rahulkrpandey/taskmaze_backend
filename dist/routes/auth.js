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
router.post("/refresh", middlewares_1.validateRefreshToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken, accessToken, time } = (0, util_1.generateRefreshAndJwtToken)(req.body.form.username);
        return res.status(util_1.HttpStatusCode.OK).json({
            accessToken,
            refreshToken,
            expiresIn: time,
            username: req.body.form.username,
        });
    }
    catch (e) {
        next(e);
    }
}));
router.post("/login", middlewares_1.validatePassword, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken, accessToken, time } = (0, util_1.generateRefreshAndJwtToken)(req.body.form.username);
        return res.status(util_1.HttpStatusCode.OK).json({
            accessToken,
            refreshToken,
            expiresIn: time,
            username: req.body.form.username,
        });
    }
    catch (e) {
        next(e);
    }
}));
router.post("/signup", middlewares_1.passwordEncrypt, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = req.body.form;
        yield prisma.user.create({
            data: Object.assign({}, form),
        });
        console.log(form);
        res.status(util_1.HttpStatusCode.Created).send("User created");
    }
    catch (e) {
        res.status(util_1.HttpStatusCode.BadRequest);
        next(e);
    }
}));
exports.default = router;
//# sourceMappingURL=auth.js.map