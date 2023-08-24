const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) => {
  res.status(200).send({
    message: "GET products: all good",
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

        res.status(201).send({
          message: "Product inserted successfully",
          id_product: result.insertId,
        });
      }
    );
  });
});

router.get("/:_id", (req, res, next) => {
  const id = req.params.id_product;

  if (id === "special") {
    res.status(200).send({
      message: "GET special product: all good",
      id: id,
    });
  } else {
    res.status(200).send({
      message: "GET especific product: all good",
      id: id,
    });
  }
});

router.patch("/", (req, res, next) => {
  res.status(201).send({
    message: "PATCH product: all good",
  });
});

router.delete("/", (req, res, next) => {
  res.status(201).send({
    message: "DELETE product: all good",
  });
});

module.exports = router;
