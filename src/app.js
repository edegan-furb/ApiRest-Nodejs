const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const productsRoute = require("./router/products");
const ordersRoute = require("./router/orders");
const usersRoute = require("./router/users");
const imagesRoute = require("./router/images");
const categoriesRoute = require("./router/categories");

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/products", productsRoute);
app.use("/orders", ordersRoute);
app.use("/users", usersRoute);
app.use("/images", imagesRoute);
app.use("/categories", categoriesRoute);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).send({});
  }
  next();
});

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
