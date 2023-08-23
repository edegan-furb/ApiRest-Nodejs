const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).send({
    message: "GET orders: all good",
  });
});

router.post("/", (req, res, next) => {
  const order = {
    _id: req.body._id,
    quantity: req.body.quantity,
  };
  res.status(201).send({
    message: "POST order: all good",
    createdOrder: order,
  });
});

router.get("/:_id", (req, res, next) => {
  const id = req.params._id;

  if (id === "special") {
    res.status(200).send({
      message: "GET special order: all good",
      id: id,
    });
  } else {
    res.status(200).send({
      message: "GET especific order: all good",
      id: id,
    });
  }
});

router.patch("/", (req, res, next) => {
  res.status(201).send({
    message: "PATCH order: all good",
  });
});

router.delete("/", (req, res, next) => {
  res.status(201).send({
    message: "DELETE order: all good",
  });
});

module.exports = router;
