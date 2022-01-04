"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const connectionString = 'postgres://mvqniuid:fPBvEcbs2VKD5IFDPWsFhGZTpbu7SzeH@motty.db.elephantsql.com/mvqniuid';
const db = new pg_1.Pool({ connectionString });
exports.default = db;
