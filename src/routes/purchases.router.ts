import { Router, Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import ProductBought from "../models/productbought.model";
import purchaseRepository from "../repositories/purchase.repository";
import bearerAuthenticationMiddleware from "../middlewares/Bearer-authentication.middleware";

const purchasesRouter = Router();

purchasesRouter.post(
  "/purchase",
  bearerAuthenticationMiddleware,
  async (req: Request, res: Response, Next: NextFunction) => {
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
  },
);

purchasesRouter.get(
  "/purchase",
  bearerAuthenticationMiddleware,
  async (req: Request, res: Response, Next: NextFunction) => {
    const user = req.user;
    const purchases = await purchaseRepository.get_all_purchases_from_user(
      user.uuid,
    );

    res.send(purchases).status(StatusCodes.OK);
  },
);

purchasesRouter.get(
  "/purchase/:uuid",
  bearerAuthenticationMiddleware,
  async (req: Request<{ uuid: string }>, res: Response, Next: NextFunction) => {
    const purchaseID = req.params.uuid;

    const purchaseInfo = await purchaseRepository.get_purchase_detail(
      purchaseID,
    );
    const products = await purchaseRepository.get_products_from_purchase(
      purchaseID,
    );

    const response = JSON.stringify([purchaseInfo, ...products]);

    res.send(response).status(StatusCodes.OK);
  },
);

export default purchasesRouter;
