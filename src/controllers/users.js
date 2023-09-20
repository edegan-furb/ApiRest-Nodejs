const mysql = require("../mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signIn = async (req, res, next) => {
  try {
    const userQuery = `SELECT * FROM users WHERE email = ?`;
    const userResult = await mysql.execute(userQuery, [req.body.email]);

    if (userResult.length > 0) {
      res.status(409).send({ message: "User already exists" });
    } else {
      bcrypt.hash(req.body.password, 10, async (errBcrypt, hash) => {
        if (errBcrypt) {
          return res.status(500).send({ error: errBcrypt });
        }
        const signInQuery = `INSERT INTO users (email, password) VALUES (?,?)`;
        const signInResult = await mysql.execute(signInQuery, [req.body.email, hash]);
        const response = {
          message: "User inserted successfully",
          userCreated: {
            id_user: signInResult.insertId,
            email: req.body.email,
          },
        };
        return res.status(201).send(response);
      });
    }
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.login = async (req, res, next) => {
  try {
    const query = `SELECT * FROM users WHERE email = ?`;
    const results = await mysql.execute(query, [req.body.email]);
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
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
