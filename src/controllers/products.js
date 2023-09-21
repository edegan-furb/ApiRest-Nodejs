const mysql = require("../mysql");

exports.getProduct = async (req, res, next) => {
  try {
    const name = req.query.name || '';

    const query = `
            SELECT *
               FROM products
              WHERE id_categories = ?
                AND (
                    name LIKE '%${name}%'
                );
        `;
    const result = await mysql.execute(query, [req.query.id_categories]);
    const response = {
      products: result.map((prod) => {
        return {
          id_product: prod.id_product,
          name: prod.name,
          price: prod.price,
          id_categories: prod.id_categories,
          request: {
            type: "GET",
            description: "return products by id",
            URL: "http://localhost:3000/products/" + prod.id_product,
          },
        };
      }),
    };
    return res.status(200).send({ response });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.postProduct = async (req, res, next) => {
  try {
    const categoryQuery = `SELECT id_categories FROM categories WHERE id_categories = ?`;
    const categoryResult = await mysql.execute(categoryQuery, [
      req.body.id_categories,
    ]);

    if (categoryResult.length === 0) {
      return res.status(404).send({ message: "Category not found" });
    }

    const query = `INSERT INTO products (name, price, id_categories) VALUES (?, ?, ?)`;
    const result = await mysql.execute(query, [
      req.body.name,
      req.body.price,
      req.body.id_categories,
    ]);
    const response = {
      message: "Product inserted successfully",
      productCreated: {
        id_product: result.insertId,
        name: req.body.name,
        price: req.body.price,
        id_categories: req.body.id_categories,
        request: {
          type: "GET",
          description: "get product by id",
          URL: "http://localhost:3000/products/" + result.insertId,
        },
      },
    };
    res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const query = "SELECT * FROM products WHERE id_product = ?;";
    const result = await mysql.execute(query, [req.params.id_product]);

    if (result.length == 0) {
      return res.status(404).send({ message: "Product not found" });
    }

    const response = {
      product: {
        id_product: result[0].id_product,
        name: result[0].name,
        price: result[0].price,
        id_categories: result[0].id_categories,
        request: {
          type: "GET",
          description: "return all orders",
          URL: "http://localhost:3000/products",
        },
      },
    };
    return res.status(200).send({ response });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.patchProduct = async (req, res, next) => {
  try {
    const categoryQuery = `SELECT id_categories FROM categories WHERE id_categories = ?`;
    const categoryResult = await mysql.execute(categoryQuery, [
      req.body.id_categories,
    ]);

    if (categoryResult.length === 0) {
      return res.status(404).send({ message: "Category not found" });
    }

    const productQuery = "SELECT * FROM products WHERE id_product = ?;";
    const productResult = await mysql.execute(productQuery, [
      req.params.id_product,
    ]);

    if (productResult.length == 0) {
      return res.status(404).send({ message: "Product not found" });
    }

    const query = `UPDATE products
                    SET name          = ?,
                        price         = ?,
                        id_categories = ?
                  WHERE id_product    = ?`;
    await mysql.execute(query, [
      req.body.name,
      req.body.price,
      req.body.id_categories,
      req.params.id_product,
    ]);

    const response = {
      message: "Product updated successfully",
      productUpdated: {
        id_product: req.body.id_product,
        name: req.body.name,
        price: req.body.price,
        id_categories: req.body.id_categories,
        request: {
          type: "GET",
          description: "return order by id",
          URL: "http://localhost:3000/products/" + req.body.id_product,
        },
      },
    };

    res.status(202).send({ response });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const query = `DELETE FROM products WHERE id_product = ?`;
    const result = await mysql.execute(query, [req.params.id_product]);
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Product not found" });
    }
    const response = {
      message: "Product deleted successfully",
      request: {
        type: "POST",
        description: "insert product",
        URL: "http://localhost:3000/products/",
        body: {
          name: "String",
          price: "Number",
          id_categories: "Number",
        },
      },
    };
    res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
