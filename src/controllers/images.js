const mysql = require("../mysql");

exports.postImage = async (req, res, next) => {
  try {
    const productQuery = `SELECT id_product FROM products WHERE id_product = ?`;
    const productResult = await mysql.execute(productQuery, [
      req.params.id_product,
    ]);

    if (productResult.length === 0) {
      return res.status(404).send({ message: "Product not found" });
    }

    const query = `INSERT INTO product_images (id_product,path) VALUES (?, ?)`;
    const result = await mysql.execute(query, [
      req.params.id_product,
      req.file.path,
    ]);
    const response = {
      message: "Image inserted successfully",
      imageCreated: {
        id_image: result.insertId,
        id_product: req.params.id_product,
        image_product: "http://localhost:3000/" + req.file.path,
        request: {
          type: "GET",
          description: "return images by product id",
          url: "http://localhost:3000/images/" + req.params.id_product,
        },
      },
    };
    res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getImage = async (req, res, next) => {
  try {
    const query = "SELECT * FROM product_images WHERE id_product = ?";
    const result = await mysql.execute(query, [req.params.id_product]);

    if (result.length === 0) {
      return res.status(404).send({ message: "Images of product not found" });
    }

    const response = {
      images: result.map((img) => {
        return {
          id_image: img.id_image,
          id_product: img.id_product,
          path: "http://localhost:3000/" + img.path,
        };
      }),
    };
    return res.status(200).send({ response });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const query = `DELETE FROM product_images WHERE id_image = ?`;
    const result = await mysql.execute(query, [req.params.id_image]);

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Image not found" });
    }

    const response = {
      message: "Image deleted successfully",
      request: {
        type: "POST",
        description: "insert image",
        URL: "http://localhost:3000/images/:id_product",
        body: {
          image_product: "File",
        },
      },
    };
    res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
