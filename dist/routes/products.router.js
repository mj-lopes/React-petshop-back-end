"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const Bearer_authentication_middleware_1 = __importDefault(require("../middlewares/Bearer-authentication.middleware"));
const product_repository_1 = __importDefault(require("../repositories/product.repository"));
const productsRouter = (0, express_1.Router)();
productsRouter.post("/", Bearer_authentication_middleware_1.default, async (req, res, next) => {
    try {
        const newProduct = req.body;
        const uuid = await product_repository_1.default.saveNewProduct(newProduct);
        res.status(http_status_codes_1.StatusCodes.CREATED).send(uuid);
    }
    catch (error) {
        next(error);
    }
});
productsRouter.get("/", async (req, res, next) => {
    try {
        const products = await product_repository_1.default.getAllProducts();
        if (products.length === 0)
            return res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
        res.status(http_status_codes_1.StatusCodes.OK).send(products);
    }
    catch (error) {
        next(error);
    }
});
productsRouter.get("/product/:uuid", async (req, res, next) => {
    try {
        const uuid = req.params.uuid;
        const product = await product_repository_1.default.getProductByID(uuid);
        if (!product)
            return res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
        res.status(http_status_codes_1.StatusCodes.OK).send(product);
    }
    catch (error) {
        next(error);
    }
});
productsRouter.get("/:category", async (req, res, next) => {
    try {
        const category = req.params.category;
        let productsFromCategory = [];
        if (category === "remedios" || category === "acessorios_brinquedos") {
            productsFromCategory =
                await product_repository_1.default.getAllProductsFromCategory(category);
        }
        else {
            productsFromCategory =
                await product_repository_1.default.getAllProductsFromAnimalType(category);
        }
        if (productsFromCategory.length === 0)
            return res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
        res.status(http_status_codes_1.StatusCodes.OK).send(productsFromCategory);
    }
    catch (error) {
        next(error);
    }
});
productsRouter.get("/search/:query", async (req, res, next) => {
    try {
        const query = req.params.query
            .trim()
            .split(" ")
            .filter((x) => x);
        const searchResult = await product_repository_1.default.getProductsFromQuerySearch(query);
        if (searchResult.length === 0)
            return res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
        res.status(http_status_codes_1.StatusCodes.OK).send(searchResult);
    }
    catch (error) {
        next(error);
    }
});
productsRouter.put("/:uuid", Bearer_authentication_middleware_1.default, async (req, res, next) => {
    try {
        const product = req.body;
        const uuid = req.params.uuid;
        product.uuid = uuid;
        const productUpdated = product_repository_1.default.updateProduct(product);
        res.status(http_status_codes_1.StatusCodes.OK).send(productUpdated);
    }
    catch (error) {
        next(error);
    }
});
productsRouter.delete("/:uuid", Bearer_authentication_middleware_1.default, async (req, res, next) => {
    try {
        const uuid = req.params.uuid;
        const productDeleted = product_repository_1.default.deleteProduct(uuid);
        res.status(http_status_codes_1.StatusCodes.OK).send(productDeleted);
    }
    catch (error) {
        next(error);
    }
});
exports.default = productsRouter;
