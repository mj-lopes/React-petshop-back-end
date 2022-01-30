"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const Bearer_authentication_middleware_1 = __importDefault(require("../middlewares/Bearer-authentication.middleware"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const usersRoute = (0, express_1.Router)();
usersRoute.post("/", async (req, res, next) => {
    try {
        const newUser = req.body;
        const uuid = await user_repository_1.default.createUser(newUser);
        res.status(http_status_codes_1.StatusCodes.CREATED).send(uuid);
    }
    catch (error) {
        next(error);
    }
});
usersRoute.get("/", Bearer_authentication_middleware_1.default, async (req, res, next) => {
    try {
        const users = await user_repository_1.default.getAllUsers();
        res.status(http_status_codes_1.StatusCodes.OK).send(users);
    }
    catch (error) {
        next(error);
    }
});
usersRoute.get("/:uuid", Bearer_authentication_middleware_1.default, async (req, res, next) => {
    try {
        const uuid = req.params.uuid;
        const user = await user_repository_1.default.findUserByUUID(uuid);
        res.status(http_status_codes_1.StatusCodes.OK).send(user);
    }
    catch (error) {
        next(error);
    }
});
usersRoute.put("/:uuid", Bearer_authentication_middleware_1.default, async (req, res, next) => {
    try {
        const uuid = req.params.uuid;
        const modifiedUser = req.body;
        modifiedUser.uuid = uuid;
        const userUpdated = await user_repository_1.default.updateUser(modifiedUser);
        res.status(http_status_codes_1.StatusCodes.OK).send(userUpdated);
    }
    catch (error) {
        next(error);
    }
});
usersRoute.delete("/:uuid", Bearer_authentication_middleware_1.default, async (req, res, next) => {
    try {
        const uuid = req.params.uuid;
        const userDeleted = await user_repository_1.default.deleteUser(uuid);
        res.status(http_status_codes_1.StatusCodes.OK).send(userDeleted);
    }
    catch (error) {
        next(error);
    }
});
exports.default = usersRoute;
