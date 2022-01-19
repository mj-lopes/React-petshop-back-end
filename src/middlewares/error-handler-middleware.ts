import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.status(StatusCodes.FORBIDDEN).send(error.message);
}

export default errorHandler;
