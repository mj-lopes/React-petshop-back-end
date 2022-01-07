import { NextFunction, Request, Response } from "express";
import userRepository from "../repositories/user.repository";

async function basicAuthenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorizationHeader = req.headers["authorization"];

    if (!authorizationHeader) {
      throw new Error("Credenciais não informadas");
    }

    const [authorizationType, token] = authorizationHeader.split(" ");

    if (authorizationType !== "Basic" || !token) {
      throw new Error("Tipo de autentificação inválido");
    }

    const tokenContent = Buffer.from(token, "base64").toString("utf-8");

    const [username, password] = tokenContent.split(":");

    if (!username || !password) {
      throw new Error("Credencias não preenchidas");
    }

    const user = await userRepository.findByUsernameAndPassword(
      username,
      password,
    );

    if (!user) {
      throw new Error("Usuário ou senha inválidos");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export default basicAuthenticationMiddleware;
