"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const database_error_1 = require("../errors/database.error");
class purchaseRepositoty {
    async save_new_purchase(buyer, status = "processando") {
        try {
            const query = `
      INSERT INTO compras (fkusuariocomprador, status)
      VALUES ($1, $2)
      RETURNING uuid
    `;
            const values = [buyer, status];
            const { rows } = await db_1.default.query(query, values);
            const [uuid] = rows;
            return uuid;
        }
        catch (error) {
            throw new database_error_1.DatabaseError({
                log: "Ocorreu um erro ao salvar os dados da compra",
            });
        }
    }
    async save_product_from_purchase(purchaseID, idProduct, productPrice, howMany) {
        try {
            const query = `
      INSERT INTO produtoscompra 
      VALUES ($1, $2, $3, $4)      
    `;
            const values = [purchaseID, idProduct, productPrice, howMany];
            await db_1.default.query(query, values);
        }
        catch (error) {
            throw new database_error_1.DatabaseError({
                log: "Ocorreu um erro ao salvar os dados da compra",
            });
        }
    }
    async get_all_purchases_from_user(uuid) {
        try {
            const query = `
    SELECT uuid, status, data 
    FROM compras
    WHERE fkusuariocomprador = $1
   `;
            const values = [uuid];
            const { rows } = await db_1.default.query(query, values);
            return rows || [];
        }
        catch (error) {
            throw new database_error_1.DatabaseError({
                log: "Ocorreu um erro ao pesquisar pelas compras do usuário",
            });
        }
    }
    async get_purchase_detail(purchaseID) {
        try {
            const query = `
      SELECT 
          uuid idcompra,
          fkusuariocomprador idcomprador,
          status,
          data
      FROM compras
      WHERE uuid = $1
    `;
            const values = [purchaseID];
            const { rows } = await db_1.default.query(query, values);
            const [purchase] = rows;
            return purchase;
        }
        catch (error) {
            throw new database_error_1.DatabaseError({
                log: "Ocorreu um erro ao pesquisa pela compra do usuário",
            });
        }
    }
    async get_products_from_purchase(purchaseID) {
        try {
            const query = `
      SELECT pc.fkproduto uuid,
       p.nome nome,
       p.imgurl,
       pc.preco,
       pc.quantidade
      FROM produtoscompra pc
      INNER JOIN compras c
      ON c.uuid = pc.fkcompra
      INNER JOIN produtos p
      ON pc.fkproduto = p.uuid
      WHERE c.uuid = $1
    `;
            const values = [purchaseID];
            const { rows } = await db_1.default.query(query, values);
            return rows;
        }
        catch (error) {
            throw new database_error_1.DatabaseError({
                log: "Ocorreu um erro ao pesquisar pelos produtos da compra do usuário",
            });
        }
    }
}
exports.default = new purchaseRepositoty();
