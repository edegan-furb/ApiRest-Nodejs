const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    let data = new Date().toISOString().replace(/:/g, "-") + "-";
    cb(null, data + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query("SELECT * FROM products;", (error, result, fields) => {
      conn.release();
      if (error) {
        return res.status(500).send({ error: error });
      }
      const response = {
        products: result.map((prod) => {
          return {
            id_product: prod.id_product,
            name: prod.name,
            price: prod.price,
            image_product: prod.image_product,
            request: {
              type: "GET",
              description: "return products by id",
              URL: "http://localhost:3000/products/" + prod.id_product,
            },
          };
        }),
      };
      return res.status(200).send({ response });
    });
  });
});

router.post("/", upload.single("image_product"), (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
        response: null,
      });
    }

    conn.query(
      "INSERT INTO products (name, price, image_product) VALUES (?, ?, ?)",
      [req.body.name, req.body.price, req.file.path],
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
            image_product: req.file.path,
            request: {
              type: "GET",
              description: "get product by id",
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
            image_product: result[0].image_product,
            request: {
              type: "GET",
              description: "return all orders",
              URL: "http://localhost:3000/products",
            },
          },
        };
        return res.status(200).send({ response });
      }
    );
  });
});

router.patch("/",upload.single("image_product"), (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      `UPDATE products
          SET name          = ?,
              price         = ?,
              image_product = ?
        WHERE id_product    = ?`,
      [req.body.name, req.body.price,req.file.path, req.body.id_product],
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
            image_product: req.file.path,
            request: {
              type: "GET",
              description: "return order by id",
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
          return res.status(500).send({ error: error });
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
            },
          },
        };

        res.status(201).send(response);
      }
    );
  });
});

module.exports = router;
