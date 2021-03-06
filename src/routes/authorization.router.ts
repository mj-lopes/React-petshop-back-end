import { NextFunction, Request, Response, Router } from "express";
import JWT from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import basicAuthenticationMiddleware from "../middlewares/basic-authentication-middleware";
import bearerAuthenticationMiddleware from "../middlewares/Bearer-authentication.middleware";

const authorizationRoute = Router();

authorizationRoute.post(
  "/",
  basicAuthenticationMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      const jwtPayload = { nome: user?.nome };
      const secretKey = `${process.env.DB_CRYPTSECRET}`;
      const jwtOptions = { subject: user?.uuid };

      const jwt = JWT.sign(jwtPayload, secretKey, jwtOptions);
      res.status(StatusCodes.OK).json({ token: jwt });
    } catch (error) {
      next(error);
    }
  },
);

authorizationRoute.post(
  "/validate",
  bearerAuthenticationMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      res.status(StatusCodes.OK).send(user);
    } catch (error) {
      next(error);
    }
  },
);

export default authorizationRoute;
