"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const database_error_1 = require("../errors/database.error");
const forbidden_error_1 = require("../errors/forbidden.error");
const httpResponse_model_1 = __importDefault(require("../models/httpResponse.model"));
const UNEXPECTED_ERROR = new httpResponse_model_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, { message: "erro-inesperado" });
const FORBIDDEN_ERROR = new httpResponse_model_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, {
    message: "forbidden",
});
const DB_ERROR = new httpResponse_model_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, {
    message: "database-error",
});
function errorHandler(error, req, res, next) {
    let errorResponse = UNEXPECTED_ERROR;
    if (error instanceof forbidden_error_1.ForbiddenError) {
        errorResponse = FORBIDDEN_ERROR;
    }
    if (error instanceof database_error_1.DatabaseError) {
        errorResponse = DB_ERROR;
    }
    errorResponse.body.message = error.message;
    return res.status(errorResponse.status).send(errorResponse.body);
}
exports.default = errorHandler;
