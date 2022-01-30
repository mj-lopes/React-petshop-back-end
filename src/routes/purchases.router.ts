import { Router, Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import ProductBought from "../models/productbought.model";
import purchaseRepository from "../repositories/purchase.repository";
import bearerAuthenticationMiddleware from "../middlewares/Bearer-authentication.middleware";

const purchasesRouter = Router();

purchasesRouter.post(
  "/",
  bearerAuthenticationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const purchase = req.body;
      const buyerID = purchase.shift().comprador;
      const purchaseID = await purchaseRepository.save_new_purchase(
        buyerID,
        "Processando a compra",
      );
      purchase.forEach(async (product: ProductBought) => {
        await purchaseRepository.save_product_from_purchase(
          purchaseID.uuid,
          product.uuid,
          product.preco,
          product.quantidade,
        );
      });

      res.sendStatus(StatusCodes.CREATED);
    } catch (error) {
      next(error);
    }
  },
);

purchasesRouter.get(
  "/",
  bearerAuthenticationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const purchases = await purchaseRepository.get_all_purchases_from_user(
        user.uuid,
      );

      res.status(StatusCodes.OK).send(purchases);
    } catch (error) {
      next(error);
    }
  },
);

purchasesRouter.get(
  "/:uuid",
  bearerAuthenticationMiddleware,
  async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {
      const purchaseID = req.params.uuid;

      const purchaseInfo = await purchaseRepository.get_purchase_detail(
        purchaseID,
      );
      const products = await purchaseRepository.get_products_from_purchase(
        purchaseID,
      );

      const response = JSON.stringify([purchaseInfo, ...products]);

      res.status(StatusCodes.OK).send(response);
    } catch (error) {
      next(error);
    }
  },
);

export default purchasesRouter;
