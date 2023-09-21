const mysql = require("../mysql");

exports.getOrders = async (req, res, next) => {
  try {
    const query = `SELECT orders.id_order,
                          orders.quantity,
                          products.id_product,
                          products.name,
                          products.price
                     FROM orders
               INNER JOIN products
                       ON products.id_product = orders.id_product;`;
    const result = await mysql.execute(query);
    const response = {
      orders: result.map((order) => {
        return {
          id_order: order.id_order,
          quantity: order.quantity,
          product: {
            id_product: order.id_product,
            name: order.name,
            price: order.price,
          },
          request: {
            type: "GET",
            description: "return order by id",
            URL: "http://localhost:3000/orders/" + order.id_order,
          },
        };
      }),
    };
    return res.status(200).send({ response });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const productQuery = `SELECT * FROM products WHERE id_product = ?`;
    const productResult = await mysql.execute(productQuery, [
      req.body.id_product,
    ]);

    if (productResult.length == 0) {
      return res.status(404).send({ message: "Product not found" });
    }

    const orderQuery =
      "INSERT INTO orders (id_product, quantity) VALUES (?, ?)";
    const orderResult = await mysql.execute(orderQuery, [
      req.body.id_product,
      req.body.quantity,
    ]);
    const response = {
      message: "Order inserted successfully",
      orderCreated: {
        id_order: orderResult.insertId,
        id_product: req.body.id_product,
        quantity: req.body.quantity,
        request: {
          type: "GET",
          description: "return order by id",
          URL: "http://localhost:3000/orders/" + orderResult.insertId,
        },
      },
    };
    res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const query = `SELECT orders.id_order,
                          orders.quantity,
                          products.id_product,
                          products.name,
                          products.price
                     FROM orders
               INNER JOIN products
                       ON products.id_product = orders.id_product
                    WHERE id_order = ?;`;
    const result = await mysql.execute(query, [req.params.id_order]);

    if (result.length == 0) {
      return res.status(404).send({ message: "Order not found" });
    }

    const response = {
      order: {
        id_order: result[0].id_order,
        quantity: result[0].quantity,
        product: {
          id_product: result[0].id_product,
          name: result[0].name,
          price: result[0].price,
        },
        request: {
          type: "GET",
          description: "return all orders",
          URL: "http://localhost:3000/orders",
        },
      },
    };
    return res.status(200).send({ response });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.patchOrder = async (req, res, next) => {
  try {
    const query = `UPDATE orders
                      SET quantity = ?
                    WHERE id_order = ?`;
    const result = await mysql.execute(query, [
      req.body.quantity,
      req.body.id_order,
    ]);

    if (result.length === 0) {
      return res.status(404).send({ message: "Order not found" });
    }

    const response = {
      message: "Order updated successfully",
      productUpdated: {
        id_order: req.body.id_order,
        id_product: result.id_product,
        quantity: req.body.quantity,
        request: {
          type: "GET",
          description: "return order by id",
          URL: "http://localhost:3000/order/" + req.body.id_order,
        },
      },
    };

    res.status(202).send({ response });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const query = `DELETE FROM orders WHERE id_order = ?`;
    const result = await mysql.execute(query, [req.params.id_order]);

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Order not found" });
    }

    const response = {
      message: "Order deleted successfully",
      request: {
        type: "POST",
        description: "insert order",
        URL: "http://localhost:3000/orders/",
        body: {
          id_order: "Number",
          quantity: "Number",
        },
      },
    };
    res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
