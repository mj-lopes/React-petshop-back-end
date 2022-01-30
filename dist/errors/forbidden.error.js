"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const application_error_1 = require("./application.error");
class ForbiddenError extends application_error_1.ApplicationError {
}
exports.ForbiddenError = ForbiddenError;
