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
exports.validateRefreshToken = exports.validateToken = exports.validatePassword = exports.passwordEncrypt = void 0;
const client_1 = require("@prisma/client");
const util_1 = require("../util");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const passwordEncrypt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(util_1.HttpStatusCode.BadRequest);
    try {
        const form = req.body.form;
        const saltRounds = +process.env.SALT;
        const pass = yield bcrypt_1.default.hash(form.password, saltRounds);
        req.body.form.password = pass;
        next();
    }
    catch (e) {
        next(e);
    }
});
exports.passwordEncrypt = passwordEncrypt;
const validatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(util_1.HttpStatusCode.BadRequest);
    try {
        const form = req.body.form;
        const user = yield prisma.user.findFirst({
            where: {
                username: form.username,
            },
        });
        if (!user) {
            res.status(util_1.HttpStatusCode.NotFound);
            throw new Error("User not found");
        }
        console.log(user);
        const comp = yield bcrypt_1.default.compare(form.password, user.password);
        if (!comp) {
            console.log(user.password);
            console.log(form.password);
            res.status(util_1.HttpStatusCode.Unauthorized);
            throw new Error("Wrong password");
        }
        next();
    }
    catch (e) {
        next(e);
    }
});
exports.validatePassword = validatePassword;
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(util_1.HttpStatusCode.BadRequest);
    try {
        let token = "", payload;
        try {
            token = req.headers.authorization.split("Bearer ")[1];
            // console.log(token);
            payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (e) {
            throw e;
        }
        if (typeof payload === "string") {
            throw new Error("Payload is not correct");
        }
        const username = payload.username;
        if (!username) {
            throw new Error("Username is undefined");
        }
        req.body.form = {
            username,
        };
        req.headers.usernames = [username];
        next();
    }
    catch (e) {
        console.log(e);
        next(e);
    }
});
exports.validateToken = validateToken;
const validateRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(util_1.HttpStatusCode.BadRequest);
    try {
        let token = "", payload;
        try {
            token = req.body.data.refreshToken;
            console.log(token);
            payload = jsonwebtoken_1.default.verify(token, process.env.REFRESH_SECRET);
        }
        catch (e) {
            throw e;
        }
        if (typeof payload === "string") {
            throw new Error("Payload is not correct");
        }
        const username = payload.username;
        if (!username) {
            throw new Error("Username is undefined");
        }
        req.body.form = {
            username,
        };
        next();
    }
    catch (e) {
        console.log(e);
        next(e);
    }
});
exports.validateRefreshToken = validateRefreshToken;
//# sourceMappingURL=index.js.map