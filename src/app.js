const express = require("express");
const app = express();
const morgan = require("morgan");

const productsRoute = require("./router/products");
const ordersRoute = require("./router/orders");

app.use(morgan("dev"));

app.use("/products", productsRoute);
app.use("/orders", ordersRoute);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    error: {
      message: error.message,
    },
  });
});
module.exports = app;
