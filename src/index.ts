import express, { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import errorHandler from "./middlewares/error-handler-middleware";
import authorizationRoute from "./routes/authorization.router";
import productsRouter from "./routes/products.router";
import usersRoute from "./routes/users.route";
import purchasesRouter from "./routes/purchases.router";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(usersRoute);
app.use(productsRouter);
app.use(authorizationRoute);
app.use(purchasesRouter);
app.use(errorHandler);

app.listen(9090, () => {
  console.log("Server online na porta 3000");
});

app.get("/status", (req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(StatusCodes.OK);
});
