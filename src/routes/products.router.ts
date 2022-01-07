import { Response, Request, NextFunction, Router } from "express";
import { StatusCodes } from "http-status-codes";
import productRepository from "../repositories/product.repository";

const productsRouter = Router();

productsRouter.get(
  "/products",
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await productRepository.getAllProducts();
    res.status(StatusCodes.OK).send(products);
  },
);

productsRouter.get(
  "/products/:uuid",
  async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const uuid = req.params.uuid;
    const product = await productRepository.getProductByID(uuid);
    res.status(StatusCodes.OK).send(product);
  },
);

productsRouter.post(
  "/products",
  async (req: Request, res: Response, next: NextFunction) => {
    const newProduct = req.body;
    const uuid = await productRepository.saveNewProduct(newProduct);
    res.status(StatusCodes.CREATED).send(uuid);
  },
);

productsRouter.put(
  "/products/:uuid",
  async (req: Request, res: Response, next: NextFunction) => {
    const product = req.body;
    const uuid = req.params.uuid;
    product.uuid = uuid;
    const productUpdated = productRepository.updateProduct(product);
    res.status(StatusCodes.OK).send(productUpdated);
  },
);

productsRouter.delete(
  "/products/:uuid",
  async (req: Request, res: Response, next: NextFunction) => {
    const uuid = req.params.uuid;
    console.log(uuid);
    const productDeleted = productRepository.deleteProduct(uuid);
    res.status(StatusCodes.OK).send(productDeleted);
  },
);

export default productsRouter;
