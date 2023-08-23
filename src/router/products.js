const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).send({
    message: "GET products: all good",
  });
});

router.post("/", (req, res, next) => {
  const product = {
    name: req.body.name,
    price: req.body.price,
  };

  res.status(201).send({
    message: "POST product: all good",
    createdProduct: product,
  });
});

router.get("/:_id", (req, res, next) => {
  const id = req.params._id;

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
