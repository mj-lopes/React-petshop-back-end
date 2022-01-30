import { Response, Request, NextFunction, Router } from "express";
import { StatusCodes } from "http-status-codes";
import bearerAuthenticationMiddleware from "../middlewares/Bearer-authentication.middleware";
import userRepository from "../repositories/user.repository";

const usersRoute = Router();

usersRoute.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = req.body;
      const uuid = await userRepository.createUser(newUser);

      res.status(StatusCodes.CREATED).send(uuid);
    } catch (error) {
      next(error);
    }
  },
);

usersRoute.get(
  "/",
  bearerAuthenticationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userRepository.getAllUsers();

      res.status(StatusCodes.OK).send(users);
    } catch (error) {
      next(error);
    }
  },
);

usersRoute.get(
  "/:uuid",
  bearerAuthenticationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uuid = req.params.uuid;
      const user = await userRepository.findUserByUUID(uuid);

      res.status(StatusCodes.OK).send(user);
    } catch (error) {
      next(error);
    }
  },
);

usersRoute.put(
  "/:uuid",
  bearerAuthenticationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uuid = req.params.uuid;
      const modifiedUser = req.body;
      modifiedUser.uuid = uuid;
      const userUpdated = await userRepository.updateUser(modifiedUser);

      res.status(StatusCodes.OK).send(userUpdated);
    } catch (error) {
      next(error);
    }
  },
);

usersRoute.delete(
  "/:uuid",
  bearerAuthenticationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uuid = req.params.uuid;
      const userDeleted = await userRepository.deleteUser(uuid);

      res.status(StatusCodes.OK).send(userDeleted);
    } catch (error) {
      next(error);
    }
  },
);

export default usersRoute;
