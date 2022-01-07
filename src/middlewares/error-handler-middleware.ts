import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.status(StatusCodes.NOT_IMPLEMENTED).send("Um erro ocorreu");
}

export default errorHandler;
