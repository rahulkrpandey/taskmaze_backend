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
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = "", payload;
        try {
            token = socket.handshake.auth.TOKEN;
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
        console.log("token is valid", socket.handshake.auth.TOKEN);
        socket.request.headers.userId = username;
        next();
    }
    catch (err) {
        console.log("server", err);
        next(err);
    }
});
exports.verifyToken = verifyToken;
//# sourceMappingURL=sockets.js.map