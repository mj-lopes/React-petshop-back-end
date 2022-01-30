"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_error_1 = require("../errors/database.error");
const forbidden_error_1 = require("../errors/forbidden.error");
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
async function basicAuthenticationMiddleware(req, res, next) {
    try {
        const authorizationHeader = req.headers["authorization"];
        if (!authorizationHeader) {
            throw new forbidden_error_1.ForbiddenError({ log: "Credenciais não informadas" });
        }
        const [authorizationType, token] = authorizationHeader.split(" ");
        if (authorizationType !== "Basic" || !token) {
            throw new forbidden_error_1.ForbiddenError({ log: "Autenticação inválida" });
        }
        const tokenContent = Buffer.from(token, "base64").toString("utf-8");
        const [username, password] = tokenContent.split(":");
        if (!username || !password) {
            throw new forbidden_error_1.ForbiddenError({ log: "Credencias não preenchidas" });
        }
        try {
            const user = await user_repository_1.default.findByUsernameAndPassword(username, password);
            if (user === null)
                throw new Error();
            req.user = user;
            return next();
        }
        catch (e) {
            throw new database_error_1.DatabaseError({ log: "Usuário ou senha inválidos" });
        }
    }
    catch (error) {
        return next(error);
    }
}
exports.default = basicAuthenticationMiddleware;
