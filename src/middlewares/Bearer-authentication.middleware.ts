import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import { ForbiddenError } from "../errors/forbidden.error";
import userRepository from "../repositories/user.repository";

async function bearerAuthenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const SECRET = `${process.env.DB_CRYPTSECRET}`;

  try {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
      throw new ForbiddenError({ log: "Credenciais não encontradas" });
    }

    const [authorizationType, token] = authorizationHeader.split(" ");
    if (authorizationType !== "Bearer" || !token) {
      throw new ForbiddenError({ log: "Autenticação inválida" });
    }

    try {
      const tokenPayload = JWT.verify(token, SECRET);

      if (typeof tokenPayload !== "object" || !tokenPayload.sub) {
        throw new Error();
      }

      const user = await userRepository.findUserByUUID(tokenPayload.sub);
      req.user = user;

      return next();
    } catch (e) {
      throw new ForbiddenError({ log: "Token inválido" });
    }
  } catch (error) {
    return next(error);
  }
}

export default bearerAuthenticationMiddleware;
