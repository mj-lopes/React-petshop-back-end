"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const purchase_repository_1 = __importDefault(require("../repositories/purchase.repository"));
const Bearer_authentication_middleware_1 = __importDefault(require("../middlewares/Bearer-authentication.middleware"));
const purchasesRouter = (0, express_1.Router)();
purchasesRouter.post("/", Bearer_authentication_middleware_1.default, async (req, res, next) => {
    try {
        const purchase = req.body;
        const buyerID = purchase.shift().comprador;
        const purchaseID = await purchase_repository_1.default.save_new_purchase(buyerID, "Processando a compra");
        purchase.forEach(async (product) => {
            await purchase_repository_1.default.save_product_from_purchase(purchaseID.uuid, product.uuid, product.preco, product.quantidade);
        });
        res.sendStatus(http_status_codes_1.StatusCodes.CREATED);
    }
    catch (error) {
        next(error);
    }
});
purchasesRouter.get("/", Bearer_authentication_middleware_1.default, async (req, res, next) => {
    try {
        const user = req.user;
        const purchases = await purchase_repository_1.default.get_all_purchases_from_user(user.uuid);
        res.status(http_status_codes_1.StatusCodes.OK).send(purchases);
    }
    catch (error) {
        next(error);
    }
});
purchasesRouter.get("/:uuid", Bearer_authentication_middleware_1.default, async (req, res, next) => {
    try {
        const purchaseID = req.params.uuid;
        const purchaseInfo = await purchase_repository_1.default.get_purchase_detail(purchaseID);
        const products = await purchase_repository_1.default.get_products_from_purchase(purchaseID);
        if (!purchaseInfo || products.length === 0)
            res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT);
        const response = JSON.stringify([purchaseInfo, ...products]);
        res.status(http_status_codes_1.StatusCodes.OK).send(response);
    }
    catch (error) {
        next(error);
    }
});
exports.default = purchasesRouter;
