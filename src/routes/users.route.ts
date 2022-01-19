import { Response, Request, NextFunction, Router } from "express";
import { StatusCodes } from "http-status-codes";
import userRepository from "../repositories/user.repository";

const usersRoute = Router();

usersRoute.get(
  "/users",
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userRepository.getAllUsers();
    res.status(StatusCodes.OK).send(users);
  },
);

usersRoute.post(
  "/users",
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = req.body;
    console.log(newUser);
    const uuid = await userRepository.createUser(newUser);
    res.status(StatusCodes.CREATED).send(uuid);
  },
);

usersRoute.get(
  "/users/:uuid",
  async (req: Request, res: Response, next: NextFunction) => {
    const uuid = req.params.uuid;
    const user = await userRepository.findUserByUUID(uuid);

    res.status(StatusCodes.OK).send(user);
  },
);

usersRoute.put(
  "/users/:uuid",
  async (req: Request, res: Response, next: NextFunction) => {
    const uuid = req.params.uuid;
    const modifiedUser = req.body;
    modifiedUser.uuid = uuid;
    const userUpdated = await userRepository.updateUser(modifiedUser);

    res.status(StatusCodes.OK).send(userUpdated);
  },
);

usersRoute.delete(
  "/users/:uuid",
  async (req: Request, res: Response, next: NextFunction) => {
    const uuid = req.params.uuid;
    const userDeleted = await userRepository.deleteUser(uuid);

    res.status(StatusCodes.OK).send(userDeleted);
  },
);

export default usersRoute;
