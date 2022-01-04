import express, { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log("Server online na porta 3000");
});

app.get("/status", (req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(StatusCodes.OK);
});
