import { Response, Request, NextFunction, Router } from "express";
import { StatusCodes } from "http-status-codes";
import Product from "../models/product.model";
import productRepository from "../repositories/product.repository";

const productsRouter = Router();

productsRouter.post(
  "/products",
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
  "/products",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await productRepository.getAllProducts();

      res.status(StatusCodes.OK).send(products);
    } catch (error) {
      next(error);
    }
  },
);

productsRouter.get(
  "/products/:uuid",
  async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {
      const uuid = req.params.uuid;
      const product = await productRepository.getProductByID(uuid);

      res.status(StatusCodes.OK).send(product);
    } catch (error) {
      next(error);
    }
  },
);

productsRouter.get(
  "/products/:category",
  async (
    req: Request<{ category: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    const category = req.params.category;
    let productsFromCategory: Product[] = [];

    if (category === "remedios" || category === "acessorios_brinquedos") {
      productsFromCategory = await productRepository.getAllProductsFromCategory(
        category,
      );
    } else {
      productsFromCategory =
        await productRepository.getAllProductsFromAnimalType(category);
    }
    res.status(StatusCodes.OK).send(productsFromCategory);
  },
);

productsRouter.get(
  "/products/search/:query",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.params.query
        .trim()
        .split(" ")
        .filter((x) => x);
      const searchResult = await productRepository.getProductsFromQuerySearch(
        query,
      );
      res.status(StatusCodes.OK).send(searchResult);
    } catch (error) {
      next(error);
    }
  },
);

productsRouter.put(
  "/products/:uuid",
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
  "/products/:uuid",
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
