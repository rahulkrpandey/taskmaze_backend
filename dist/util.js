"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshAndJwtToken = exports.HttpStatusCode = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var HttpStatusCode;
(function (HttpStatusCode) {
    // Informational
    HttpStatusCode[HttpStatusCode["Continue"] = 100] = "Continue";
    HttpStatusCode[HttpStatusCode["SwitchingProtocols"] = 101] = "SwitchingProtocols";
    // Successful
    HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
    HttpStatusCode[HttpStatusCode["Created"] = 201] = "Created";
    HttpStatusCode[HttpStatusCode["NoContent"] = 204] = "NoContent";
    // Redirection
    HttpStatusCode[HttpStatusCode["MovedPermanently"] = 301] = "MovedPermanently";
    HttpStatusCode[HttpStatusCode["Found"] = 302] = "Found";
    HttpStatusCode[HttpStatusCode["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    // Client Error
    HttpStatusCode[HttpStatusCode["BadRequest"] = 400] = "BadRequest";
    HttpStatusCode[HttpStatusCode["Unauthorized"] = 401] = "Unauthorized";
    HttpStatusCode[HttpStatusCode["Forbidden"] = 403] = "Forbidden";
    HttpStatusCode[HttpStatusCode["NotFound"] = 404] = "NotFound";
    // Server Error
    HttpStatusCode[HttpStatusCode["InternalServerError"] = 500] = "InternalServerError";
    HttpStatusCode[HttpStatusCode["BadGateway"] = 502] = "BadGateway";
})(HttpStatusCode || (exports.HttpStatusCode = HttpStatusCode = {}));
const generateRefreshAndJwtToken = (username) => {
    const time = 1200; // 1h
    // const time = 3600; // 1h
    const token = jsonwebtoken_1.default.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: `${time}s`,
    });
    const refreshToken = jsonwebtoken_1.default.sign({ username }, process.env.REFRESH_SECRET, {
        expiresIn: "30d",
    });
    return { accessToken: token, refreshToken, time };
};
exports.generateRefreshAndJwtToken = generateRefreshAndJwtToken;
//# sourceMappingURL=util.js.map