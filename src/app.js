const express = require("express");
const app = express();

const ProductsRoute = require("./router/products");

app.use("/products", ProductsRoute);

module.exports = app;
