import express, { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import cors from "cors";
import "dotenv/config";

import errorHandler from "./middlewares/error-handler-middleware";
import bearerAuthenticationMiddleware from "./middlewares/Bearer-authentication.middleware";

import authorizationRoute from "./routes/authorization.router";
import productsRouter from "./routes/products.router";
import usersRoute from "./routes/users.route";
import purchasesRouter from "./routes/purchases.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/token", authorizationRoute);
app.use("/users", usersRoute);
app.use("/products", productsRouter);
app.use("/purchase", bearerAuthenticationMiddleware, purchasesRouter);
app.use(errorHandler);

const door = process.env.PORT || 3030;

app.listen(door, () => {
  console.log(`Server online na porta ${door}`);
});

app.get("/status", (req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(StatusCodes.OK);
});
