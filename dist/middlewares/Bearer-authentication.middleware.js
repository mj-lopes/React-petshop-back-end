"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const forbidden_error_1 = require("../errors/forbidden.error");
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
async function bearerAuthenticationMiddleware(req, res, next) {
    try {
        const authorizationHeader = req.headers["authorization"];
        if (!authorizationHeader) {
            throw new forbidden_error_1.ForbiddenError({ log: "Credenciais não encontradas" });
        }
        const [authorizationType, token] = authorizationHeader.split(" ");
        if (authorizationType !== "Bearer" || !token) {
            throw new forbidden_error_1.ForbiddenError({ log: "Autenticação inválida" });
        }
        try {
            const tokenPayload = jsonwebtoken_1.default.verify(token, "quero_trabalho_poh");
            if (typeof tokenPayload !== "object" || !tokenPayload.sub) {
                throw new forbidden_error_1.ForbiddenError({ log: "Token inválido" });
            }
            const user = await user_repository_1.default.findUserByUUID(tokenPayload.sub);
            req.user = user;
            return next();
        }
        catch (e) {
            throw new forbidden_error_1.ForbiddenError({ log: "Token inválido" });
        }
    }
    catch (error) {
        return next(error);
    }
}
exports.default = bearerAuthenticationMiddleware;
