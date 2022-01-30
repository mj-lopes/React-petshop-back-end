"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const database_error_1 = require("../errors/database.error");
class userRepository {
    async createUser(user) {
        try {
            const secret = process.env.DB_CRYPTSECRET;
            const query = `
      INSERT INTO usuarios (nome, cpf, email, senha)
      VALUES ($1, $2, $3, crypt($4, '${secret}'))
      RETURNING uuid
    `;
            const values = [user.nome, user.cpf, user.email, user.senha];
            const { rows } = await db_1.default.query(query, values);
            const [newUser] = rows;
            return newUser;
        }
        catch (error) {
            throw new database_error_1.DatabaseError({
                log: "Ocorreu um erro ao registrar o usuário",
            });
        }
    }
    async getAllUsers() {
        try {
            const query = `
      SELECT * 
      FROM usuarios
    `;
            const { rows } = await db_1.default.query(query);
            return rows;
        }
        catch (error) {
            throw new database_error_1.DatabaseError({
                log: "Ocorreu um erro ao puxar todos os usuários",
            });
        }
    }
    async findUserByUUID(uuid) {
        try {
            const query = `
      SELECT * 
      FROM usuarios
      WHERE uuid = $1
    `;
            const values = [uuid];
            const { rows } = await db_1.default.query(query, values);
            const [user] = rows;
            return user || [];
        }
        catch (error) {
            throw new database_error_1.DatabaseError({
                log: "Ocorreu um erro na procura do usuário",
            });
        }
    }
    async findByUsernameAndPassword(nome, senha) {
        try {
            const secret = process.env.DB_CRYPTSECRET;
            const query = `
      SELECT nome, uuid
      FROM usuarios
      WHERE nome = $1
      AND senha = crypt($2, '${secret}')     
      `;
            const values = [nome, senha];
            const { rows } = await db_1.default.query(query, values);
            const [user] = rows;
            return user || null;
        }
        catch (error) {
            throw new database_error_1.DatabaseError({
                log: "Ocorreu um erro no login do usuário",
            });
        }
    }
    async updateUser(user) {
        try {
            const secret = process.env.DB_CRYPTSECRET;
            const query = `
      UPDATE usuarios 
      SET nome = $1,
          cpf = $2,
          email = $3,
          senha = crypt($4, '${secret}')
      WHERE uuid = $5
      RETURNING uuid
    `;
            const values = [user.nome, user.cpf, user.email, user.senha, user.uuid];
            const { rows } = await db_1.default.query(query, values);
            const [newUser] = rows;
            return newUser;
        }
        catch (error) {
            throw new database_error_1.DatabaseError({
                log: "Ocorreu um erro ao atualizar os dados do usuário",
            });
        }
    }
    async deleteUser(uuid) {
        try {
            const query = `
      UPDATE usuarios
      SET flagativo = '0'
      WHERE uuid = $1
      RETURNING uuid
    `;
            const values = [uuid];
            const { rows } = await db_1.default.query(query, values);
            const [uuidUserDeleted] = rows;
            return uuidUserDeleted;
        }
        catch (error) {
            throw new database_error_1.DatabaseError({
                log: "Ocorreu um erro ao deletar os dados do usuário",
            });
        }
    }
}
exports.default = new userRepository();
