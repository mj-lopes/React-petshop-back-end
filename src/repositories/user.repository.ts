import db from "../db";
import { DatabaseError } from "../errors/database.error";
import User from "../models/user.model";

class userRepository {
  async createUser(user: User): Promise<{ uuid: string }> {
    try {
      const query = `
      INSERT INTO usuarios (nome, cpf, email, senha)
      VALUES ($1, $2, $3, crypt($4, 'quero_trabalho_poh'))
      RETURNING uuid
    `;

      const values = [user.nome, user.cpf, user.email, user.senha];
      const { rows } = await db.query<{ uuid: string }>(query, values);
      const [newUser] = rows;

      return newUser;
    } catch (error) {
      throw new DatabaseError({
        log: "Ocorreu um erro ao registrar o usuário",
      });
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const query = `
      SELECT * 
      FROM usuarios
    `;
      const { rows } = await db.query(query);

      return rows;
    } catch (error) {
      throw new DatabaseError({
        log: "Ocorreu um erro ao puxar todos os usuários",
      });
    }
  }

  async findUserByUUID(uuid: string): Promise<User | []> {
    try {
      const query = `
      SELECT * 
      FROM usuarios
      WHERE uuid = $1
    `;
      const values = [uuid];
      const { rows } = await db.query<User>(query, values);
      const [user] = rows;

      return user || [];
    } catch (error) {
      throw new DatabaseError({
        log: "Ocorreu um erro na procura do usuário",
      });
    }
  }

  async findByUsernameAndPassword(
    nome: string,
    senha: string,
  ): Promise<User | null> {
    try {
      const query = `
      SELECT nome, uuid
      FROM usuarios
      WHERE nome = $1
      AND senha = crypt($2, 'quero_trabalho_poh')     
      `;
      const values = [nome, senha];

      const { rows } = await db.query<User>(query, values);
      const [user] = rows;

      return user || null;
    } catch (error) {
      throw new DatabaseError({
        log: "Ocorreu um erro no login do usuário",
      });
    }
  }

  async updateUser(user: User): Promise<{ uuid: string } | []> {
    try {
      const query = `
      UPDATE usuarios 
      SET nome = $1,
          cpf = $2,
          email = $3,
          senha = crypt($4, 'quero_trabalho_poh')
      WHERE uuid = $5
      RETURNING uuid
    `;

      const values = [user.nome, user.cpf, user.email, user.senha, user.uuid];
      const { rows } = await db.query<{ uuid: string }>(query, values);
      const [newUser] = rows;

      return newUser;
    } catch (error) {
      throw new DatabaseError({
        log: "Ocorreu um erro ao atualizar os dados do usuário",
      });
    }
  }

  async deleteUser(uuid: string): Promise<{ uuid: string }> {
    try {
      const query = `
      UPDATE usuarios
      SET flagativo = '0'
      WHERE uuid = $1
      RETURNING uuid
    `;

      const values = [uuid];
      const { rows } = await db.query<{ uuid: string }>(query, values);
      const [uuidUserDeleted] = rows;

      return uuidUserDeleted;
    } catch (error) {
      throw new DatabaseError({
        log: "Ocorreu um erro ao deletar os dados do usuário",
      });
    }
  }
}

export default new userRepository();
