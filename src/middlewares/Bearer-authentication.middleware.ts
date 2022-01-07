import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";

async function bearerAuthenticationMiddleware(
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
    if (authorizationType !== "Bearer" || !token) {
      throw new Error("Tipo de autentificação inválido");
    }

    const tokenPayload = JWT.verify(token, "quero_trabalho_poh");
    if (typeof tokenPayload !== "object" || !tokenPayload.sub) {
      throw new Error("Token inválido");
    }

    const user = {
      uuid: tokenPayload.sub,
      nome: tokenPayload.nome,
    };
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}

export default bearerAuthenticationMiddleware;
