"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const basic_authentication_middleware_1 = __importDefault(require("../middlewares/basic-authentication-middleware"));
const Bearer_authentication_middleware_1 = __importDefault(require("../middlewares/Bearer-authentication.middleware"));
const authorizationRoute = (0, express_1.Router)();
authorizationRoute.post("/", basic_authentication_middleware_1.default, (req, res, next) => {
    try {
        const user = req.user;
        const jwtPayload = { nome: user === null || user === void 0 ? void 0 : user.nome };
        const secretKey = "quero_trabalho_poh";
        const jwtOptions = { subject: user === null || user === void 0 ? void 0 : user.uuid };
        const jwt = jsonwebtoken_1.default.sign(jwtPayload, secretKey, jwtOptions);
        res.status(http_status_codes_1.StatusCodes.OK).json({ token: jwt });
    }
    catch (error) {
        next(error);
    }
});
authorizationRoute.post("/validate", Bearer_authentication_middleware_1.default, (req, res, next) => {
    try {
        const user = req.user;
        res.status(http_status_codes_1.StatusCodes.OK).send(user);
    }
    catch (error) {
        next(error);
    }
});
exports.default = authorizationRoute;
