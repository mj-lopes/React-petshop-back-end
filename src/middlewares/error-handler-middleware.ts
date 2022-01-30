import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DatabaseError } from "../errors/database.error";
import { ForbiddenError } from "../errors/forbidden.error";
import HttpResponse from "../models/httpResponse.model";

// Erro generico
const UNEXPECTED_ERROR = new HttpResponse<void>(
  StatusCodes.INTERNAL_SERVER_ERROR,
  { message: "erro-inesperado" },
);

// Erro de autenticacao
const FORBIDDEN_ERROR = new HttpResponse<void>(StatusCodes.FORBIDDEN, {
  message: "forbidden",
});

// Erro de BD
const DB_ERROR = new HttpResponse<void>(StatusCodes.INTERNAL_SERVER_ERROR, {
  message: "database-error",
});

function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let errorResponse = UNEXPECTED_ERROR;

  if (error instanceof ForbiddenError) {
    errorResponse = FORBIDDEN_ERROR;
  }

  if (error instanceof DatabaseError) {
    errorResponse = DB_ERROR;
  }

  errorResponse.body.message = error.message;

  return res.status(errorResponse.status).send(errorResponse.body);
}

export default errorHandler;
