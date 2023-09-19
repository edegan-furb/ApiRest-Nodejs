const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signIn = (req, res, next) => {
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
};

exports.login = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    const query = `SELECT * FROM users WHERE email = ?`;
    conn.query(query, [req.body.email], (error, results, fields) => {
      if (results.length < 1) {
        return res.status(401).send({ message: "Authentication failure" });
      }
      bcrypt.compare(req.body.password, results[0].password, (err, result) => {
        if (err) {
          return res.status(401).send({ message: "Authentication failure" });
        }
        if (result) {
          const token = jwt.sign(
            {
              id_user: results[0].id_user,
              email: results[0].email,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res
            .status(200)
            .send({ message: "Authentication success", token: token });
        }
        return res.status(401).send({ message: "Authentication failure" });
      });
    });
  });
};
