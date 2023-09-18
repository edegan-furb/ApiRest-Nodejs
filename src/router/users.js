const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");

router.post("/sign-in", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `SELECT * FROM users WHERE email = ?`,
      [req.body.email],
      (error, result) => {
        if (result.length > 0) {
          res.status(409).send({ message: "User already exists" });
        } else {
          bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
            if (errBcrypt) {
              return res.status(500).send({ error: errBcrypt });
            }
            conn.query(
              `INSERT INTO users (email, password) VALUES (?,?)`,
              [req.body.email, hash],
              (error, result) => {
                conn.release();
                if (error) {
                  return res.status(500).send({ error: error });
                }
                const response = {
                  message: "User inserted successfully",
                  userCreated: {
                    id_user: result.insertId,
                    email: req.body.email,
                  },
                };
                return res.status(201).send(response);
              }
            );
          });
        }
      }
    );
  });
});

module.exports = router;
