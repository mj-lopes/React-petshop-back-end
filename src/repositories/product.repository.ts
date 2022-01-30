import db from "../db";
import { DatabaseError } from "../errors/database.error";
import Product from "../models/product.model";

class productsRepository {
  async getAllProducts(): Promise<Product[]> {
    try {
      const query = `
      SELECT *
      FROM produtos
    `;

      const { rows } = await db.query<Product>(query);

      return rows || [];
    } catch (error) {
      throw new DatabaseError({
        log: "Ocorreu um erro ao pesquisar pelos produtos",
      });
    }
  }

  async getProductByID(uuid: string): Promise<Product> {
    try {
      const query = `
      SELECT * 
      FROM produtos
      WHERE uuid = $1
    `;

      const values = [uuid];
      const { rows } = await db.query<Product>(query, values);
      const [product] = rows;

      return product || [];
    } catch (error) {
      throw new DatabaseError({
        log: "Ocorreu um erro ao pesquisar pelos produto pelo seu UUID",
      });
    }
  }

  async getAllProductsFromAnimalType(animalType: string): Promise<Product[]> {
    try {
      const query = `
      SELECT * 
      FROM produtos
      WHERE tipoanimal ILIKE $1
    `;

      const values = [animalType];
      const { rows } = await db.query<Product>(query, values);

      return rows || [];
    } catch (error) {
      throw new DatabaseError({
        log: "Ocorreu um erro ao pesquisar pelos produtos através do tipo animal",
      });
    }
  }

  async getAllProductsFromCategory(category: string): Promise<Product[]> {
    try {
      const query = `
      SELECT * 
      FROM produtos
      WHERE categoria ILIKE $1
    `;

      const values = [category];
      const { rows } = await db.query<Product>(query, values);

      return rows || [];
    } catch (error) {
      throw new DatabaseError({
        log: "Ocorreu um erro ao pesquisar pelos produtos através da categoria",
      });
    }
  }

  async saveNewProduct(newProduct: Product): Promise<{ uuid: string }> {
    try {
      const query = `
      INSERT INTO produtos(nome, categoria, tipoanimal, marca, preco, imgurl, descricao) 
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING uuid
    `;

      const values = [
        newProduct.nome,
        newProduct.categoria,
        newProduct.tipoanimal,
        newProduct.marca,
        newProduct.preco,
        newProduct.imgurl,
        newProduct.descricao,
      ];
      const { rows } = await db.query<{ uuid: string }>(query, values);
      const [uuid] = rows;

      return uuid;
    } catch (error) {
      throw new DatabaseError({
        log: "Ocorreu um erro ao registrar o novo produto",
      });
    }
  }

  async updateProduct(product: Product): Promise<{ uuid: string }> {
    try {
      const query = `
      UPDATE produtos
      SET nome = $1,
          categoria = $2,
          tipoanimal = $3,
          marca = $4,
          preco = $5,
          imgurl = $6,
          descricao = $7
      WHERE uuid = $6
      RETURNING uuid
    `;
      const values = [
        product.nome,
        product.categoria,
        product.tipoanimal,
        product.marca,
        product.preco,
        product.uuid,
      ];

      const { rows } = await db.query<{ uuid: string }>(query, values);
      const [uuid] = rows;

      return uuid;
    } catch (error) {
      throw new DatabaseError({
        log: "Ocorreu um erro ao atualizar o produto",
      });
    }
  }

  async deleteProduct(uuid: string): Promise<{ uuid: string }> {
    try {
      const query = `
      UPDATE produtos
      SET flagativo = '0'
      WHERE uuid = $1
      RETURNING uuid
    `;
      const values = [uuid];
      const { rows } = await db.query<{ uuid: string }>(query, values);
      const [id] = rows;

      return id || [];
    } catch (error) {
      throw new DatabaseError({
        log: "Ocorreu um erro ao deletar o produto",
      });
    }
  }

  async getProductsFromQuerySearch(
    querySearchValue: string[],
  ): Promise<Product[]> {
    try {
      const query = `
      SELECT * 
      FROM produtos
      WHERE nome ILIKE $1
    `;
      const queryValue = "%" + querySearchValue.join("%%") + "%";
      const values = [queryValue];

      const { rows } = await db.query<Product>(query, values);

      return rows || [];
    } catch (error) {
      throw new DatabaseError({
        log: "Ocorreu um erro ao pesquisar pelos produtos através da querySearch",
      });
    }
  }
}

export default new productsRepository();
