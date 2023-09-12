const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
        response: null,
      });
    }
    conn.query("SELECT * FROM products;", (error, result, fields) => {
      conn.release();
      if (error) {
        return res.status(500).send({ error: error });
      }
      const response = {
        quantity: result.length,
        products: result.map((prod) => {
          return {
            id_product: prod.id_product,
            name: prod.name,
            price: prod.price,
            request: {
              type: "GET",
              description: "return all products",
              URL: "http://localhost:3000/products/" + prod.id_product,
            },
          };
        }),
      };
      return res.status(200).send({ response });
    });
  });
});

router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
        response: null,
      });
    }

    conn.query(
      "INSERT INTO products (name, price) VALUES (?, ?)",
      [req.body.name, req.body.price],
      (error, result, fields) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        const response = {
          message: "Product inserted successfully",
          productCreated: {
            id_product: result.insertId,
            name: req.body.name,
            price: req.body.price,
            request: {
              type: "POST",
              description: "insert product",
              URL: "http://localhost:3000/products/" + result.insertId,
            },
          },
        };

        res.status(201).send(response);
      }
    );
  });
});

router.get("/:id_product", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM products WHERE id_product = ?;",
      [req.params.id_product],
      (error, result, fields) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        if (result.length == 0) {
          return res.status(404).send({ message: "Product not found" });
        }
        const response = {
          product: {
            id_product: result[0].id_product,
            name: result[0].name,
            price: result[0].price,
            request: {
              type: "GET",
              description: "return product by id",
              URL: "http://localhost:3000/products",
            },
          },
        };
        return res.status(200).send({ response });
      }
    );
  });
});

router.patch("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
        response: null,
      });
    }

    conn.query(
      `UPDATE products
          SET name        = ?,
              price       = ?
        WHERE id_product  = ?`,
      [req.body.name, req.body.price, req.body.id_product],
      (error, result, fields) => {
        conn.release();

        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          message: "Product updated successfully",
          productUpdated: {
            id_product: req.body.id_product,
            name: req.body.name,
            price: req.body.price,
            request: {
              type: "PATCH",
              description: "updated product",
              URL: "http://localhost:3000/products/" + req.body.id_product,
            },
          },
        };

        res.status(202).send({ response });
      }
    );
  });
});

router.delete("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
        response: null,
      });
    }
    conn.query(
      `DELETE FROM products WHERE id_product = ?`,
      [req.body.id_product],
      (error, result, fields) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        const response = {
          message: "Product deleted successfully",
          productCreated: {
            id_product: req.body.id_product,
            request: {
              type: "DELETE",
              description: "delete product",
              URL: "http://localhost:3000/products/",
            },
          },
        };

        res.status(201).send(response);
      }
    );
  });
});

module.exports = router;
