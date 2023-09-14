const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query("SELECT * FROM orders;", (error, result, fields) => {
      conn.release();
      if (error) {
        return res.status(500).send({ error: error });
      }
      const response = {
        quantity: result.length,
        orders: result.map((order) => {
          return {
            id_order: order.id_order,
            id_product: order.id_product,
            quantity: order.quantity,
            request: {
              type: "GET",
              description: "return all orders",
              URL: "http://localhost:3000/orders/" + order.id_order,
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
      return res.status(500).send({ error: error });
    }
    conn.query(
      `SELECT * FROM products WHERE id_product = ?`,
      [req.body.id_product],
      (error, result, field) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        if (result.length == 0) {
          return res.status(404).send({ message: "Product not found" });
        }
        conn.query(
          "INSERT INTO orders (id_product, quantity) VALUES (?, ?)",
          [req.body.id_product, req.body.quantity],
          (error, result, fields) => {
            conn.release();

            if (error) {
              return res.status(500).send({ error: error });
            }
            const response = {
              message: "Order inserted successfully",
              orderCreated: {
                id_order: result.insertId,
                id_product: req.body.id_product,
                quantity: req.body.quantity,
                request: {
                  type: "GET",
                  description: "return order by id",
                  URL: "http://localhost:3000/orders/" + result.insertId,
                },
              },
            };
            res.status(201).send(response);
          }
        );
      }
    );
  });
});

router.get("/:id_order", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM orders WHERE id_order = ?;",
      [req.params.id_order],
      (error, result, fields) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        if (result.length == 0) {
          return res.status(404).send({ message: "Order not found" });
        }
        const response = {
          order: {
            id_order: result[0].id_order,
            id_product: result[0].id_product,
            quantity: result[0].quantity,
            request: {
              type: "GET",
              description: "return all orders",
              URL: "http://localhost:3000/orders",
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
      return res.status(500).send({ error: error });
    }

    conn.query(
      `UPDATE orders
          SET quantity = ?
        WHERE id_order = ?`,
      [req.body.quantity, req.body.id_order],
      (error, result, fields) => {
        conn.release();

        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          message: "Order updated successfully",
          productUpdated: {
            id_order: req.body.id_order,
            id_product: result.id_product,
            quantity: req.body.quantity,
            request: {
              type: "GET",
              description: "return order by id",
              URL: "http://localhost:3000/order/" + req.body.id_order,
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
      `DELETE FROM orders WHERE id_order = ?`,
      [req.body.id_order],
      (error, result, fields) => {
        conn.release();

        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          message: "Order deleted successfully",
          request: {
            type: "POST",
            description: "insert order",
            URL: "http://localhost:3000/orders/",
            body: {
              id_order: "Number",
              quantity: "Number",
            },
          },
        };
        res.status(201).send(response);
      }
    );
  });
});

module.exports = router;
