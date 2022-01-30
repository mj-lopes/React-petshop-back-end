"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = void 0;
const application_error_1 = require("./application.error");
class DatabaseError extends application_error_1.ApplicationError {
}
exports.DatabaseError = DatabaseError;
