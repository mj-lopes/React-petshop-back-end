import { Response, Request, NextFunction, Router } from "express";
import { StatusCodes } from "http-status-codes";
import Product from "../models/product.model";
import productRepository from "../repositories/product.repository";

const productsRouter = Router();

productsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newProduct = req.body;
      const uuid = await productRepository.saveNewProduct(newProduct);

      res.status(StatusCodes.CREATED).send(uuid);
    } catch (error) {
      next(error);
    }
  },
);

productsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await productRepository.getAllProducts();

      if (products.length === 0) return res.sendStatus(StatusCodes.NO_CONTENT);

      res.status(StatusCodes.OK).send(products);
    } catch (error) {
      next(error);
    }
  },
);

productsRouter.get(
  "/:uuid",
  async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {
      const uuid = req.params.uuid;
      const product = await productRepository.getProductByID(uuid);

      if (!product) return res.sendStatus(StatusCodes.NO_CONTENT);

      res.status(StatusCodes.OK).send(product);
    } catch (error) {
      next(error);
    }
  },
);

productsRouter.get(
  "/:category",
  async (
    req: Request<{ category: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const category = req.params.category;
      let productsFromCategory: Product[] = [];

      if (category === "remedios" || category === "acessorios_brinquedos") {
        productsFromCategory =
          await productRepository.getAllProductsFromCategory(category);
      } else {
        productsFromCategory =
          await productRepository.getAllProductsFromAnimalType(category);
      }

      if (productsFromCategory.length === 0)
        return res.sendStatus(StatusCodes.NO_CONTENT);

      res.status(StatusCodes.OK).send(productsFromCategory);
    } catch (error) {
      next(error);
    }
  },
);

productsRouter.get(
  "/search/:query",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.params.query
        .trim()
        .split(" ")
        .filter((x) => x);
      const searchResult = await productRepository.getProductsFromQuerySearch(
        query,
      );

      if (searchResult.length === 0)
        return res.sendStatus(StatusCodes.NO_CONTENT);

      res.status(StatusCodes.OK).send(searchResult);
    } catch (error) {
      next(error);
    }
  },
);

productsRouter.put(
  "/:uuid",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = req.body;
      const uuid = req.params.uuid;
      product.uuid = uuid;

      const productUpdated = productRepository.updateProduct(product);
      res.status(StatusCodes.OK).send(productUpdated);
    } catch (error) {
      next(error);
    }
  },
);

productsRouter.delete(
  "/:uuid",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uuid = req.params.uuid;
      const productDeleted = productRepository.deleteProduct(uuid);

      res.status(StatusCodes.OK).send(productDeleted);
    } catch (error) {
      next(error);
    }
  },
);

export default productsRouter;
