import db from "../db";
import { DatabaseError } from "../errors/database.error";
import ProductBought from "../models/productbought.model";
import Purchase from "../models/purchase.model";

class purchaseRepositoty {
  async save_new_purchase(
    buyer: string,
    status = "processando",
  ): Promise<{ uuid: string }> {
    try {
      const query = `
      INSERT INTO compras (fkusuariocomprador, status)
      VALUES ($1, $2)
      RETURNING uuid
    `;

      const values = [buyer, status];

      const { rows } = await db.query(query, values);
      const [uuid] = rows;

      return uuid;
    } catch (error) {
      throw new DatabaseError({
        log: "Ocorreu um erro ao salvar os dados da compra",
      });
    }
  }

  async save_product_from_purchase(
    purchaseID: string,
    idProduct: string,
    productPrice: number,
    howMany: number,
  ): Promise<void> {
    try {
      const query = `
      INSERT INTO produtoscompra 
      VALUES ($1, $2, $3, $4)      
    `;

      const values = [purchaseID, idProduct, productPrice, howMany];

      await db.query(query, values);
    } catch (error) {
      throw new DatabaseError({
        log: "Ocorreu um erro ao salvar os dados da compra",
      });
    }
  }

  async get_all_purchases_from_user(uuid: string): Promise<Purchase[]> {
    try {
      const query = `
    SELECT uuid, status, data 
    FROM compras
    WHERE fkusuariocomprador = $1
   `;

      const values = [uuid];

      const { rows } = await db.query<Purchase>(query, values);

      return rows || [];
    } catch (error) {
      throw new DatabaseError({
        log: "Ocorreu um erro ao pesquisar pelas compras do usuário",
      });
    }
  }

  async get_purchase_detail(purchaseID: string): Promise<Purchase> {
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

      const { rows } = await db.query<Purchase>(query, values);
      const [purchase] = rows;
      return purchase;
    } catch (error) {
      throw new DatabaseError({
        log: "Ocorreu um erro ao pesquisa pela compra do usuário",
      });
    }
  }

  async get_products_from_purchase(
    purchaseID: string,
  ): Promise<ProductBought[]> {
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

      const { rows } = await db.query<ProductBought>(query, values);

      return rows;
    } catch (error) {
      throw new DatabaseError({
        log: "Ocorreu um erro ao pesquisar pelos produtos da compra do usuário",
      });
    }
  }
}

export default new purchaseRepositoty();
