import { NextFunction, Request, Response } from "express";
import { DatabaseError } from "../errors/database.error";
import { ForbiddenError } from "../errors/forbidden.error";
import userRepository from "../repositories/user.repository";

async function basicAuthenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorizationHeader = req.headers["authorization"];

    if (!authorizationHeader) {
      throw new ForbiddenError({ log: "Credenciais não informadas" });
    }

    const [authorizationType, token] = authorizationHeader.split(" ");

    if (authorizationType !== "Basic" || !token) {
      throw new ForbiddenError({ log: "Autenticação inválida" });
    }

    const tokenContent = Buffer.from(token, "base64").toString("utf-8");

    const [username, password] = tokenContent.split(":");

    if (!username || !password) {
      throw new ForbiddenError({ log: "Credencias não preenchidas" });
    }

    try {
      const user = await userRepository.findByUsernameAndPassword(
        username,
        password,
      );
      console.log(user);

      if (user === null) throw new Error();

      req.user = user;
      return next();
    } catch (e) {
      throw new DatabaseError({ log: "Usuário ou senha inválidos" });
    }
  } catch (error) {
    return next(error);
  }
}

export default basicAuthenticationMiddleware;
