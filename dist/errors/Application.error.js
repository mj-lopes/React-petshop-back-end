"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationError = exports.DEFAULT_ERROR_CONFIG = void 0;
exports.DEFAULT_ERROR_CONFIG = {
    log: "Um erro inesperado ocorreu",
    messagekey: "erro-inesperado",
};
class ApplicationError extends Error {
    constructor(config) {
        super(config.log || exports.DEFAULT_ERROR_CONFIG.log);
        this.config = config;
        if (!config.messagekey) {
            config.messagekey = exports.DEFAULT_ERROR_CONFIG.messagekey;
        }
    }
}
exports.ApplicationError = ApplicationError;
