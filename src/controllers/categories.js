const mysql = require("../mysql");

exports.getCategories = async (req, res, next) => {
  try {
    const result = await mysql.execute("SELECT * FROM categories;");
    const response = {
      categories: result.map((cat) => {
        return {
          id_categories: cat.id_categories,
          name: cat.name,
          request: {
            type: "GET",
            description: "return category by id",
            URL: "http://localhost:3000/categories/" + cat.id_categories,
          },
        };
      }),
    };
    return res.status(200).send({ response });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.postCategory = async (req, res, next) => {
  try {
    const query = `INSERT INTO categories (name) VALUES (?)`;
    const result = await mysql.execute(query, [req.body.name]);
    
    const response = {
      message: "Category inserted successfully",
      categoryCreated: {
        id_category: result.insertId,
        name: req.body.name,
        request: {
          type: "GET",
          description: "get category by id",
          URL: "http://localhost:3000/categories/" + result.insertId,
        },
      },
    };
    res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const query = "SELECT * FROM categories WHERE id_categories = ?;";
    const result = await mysql.execute(query, [req.params.id_categories]);

    if (result.length == 0) {
      return res.status(404).send({ message: "Category not found" });
    }

    const response = {
      category: {
        id_categories: result[0].id_categories,
        name: result[0].name,
        request: {
          type: "GET",
          description: "return all categories",
          URL: "http://localhost:3000/categories",
        },
      },
    };
    return res.status(200).send({ response });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.patchCategory = async (req, res, next) => {
  try {
    const categoryQuery = `SELECT id_categories FROM categories WHERE id_categories = ?`;
    const categoryResult = await mysql.execute(categoryQuery, [
      req.params.id_categories,
    ]);

    if (categoryResult.length === 0) {
      return res.status(404).send({ message: "Category not found" });
    }

    const query = `UPDATE categories
                    SET name          = ?
                  WHERE id_categories = ?`;
    await mysql.execute(query, [req.body.name, req.params.id_categories]);

    const response = {
      message: "Product updated successfully",
      productUpdated: {
        id_categories: req.params.id_categories,
        name: req.body.name,
        request: {
          type: "GET",
          description: "return category by id",
          URL: "http://localhost:3000/categories/" + req.body.id_categories,
        },
      },
    };

    res.status(202).send({ response });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const query = `DELETE FROM categories WHERE id_categories = ?`;
    const result = await mysql.execute(query, [req.params.id_categories]);
    
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Category not found" });
    }
    const response = {
      message: "Category deleted successfully",
      request: {
        type: "POST",
        description: "insert category",
        URL: "http://localhost:3000/categories/",
        body: {
          name: "String",
        },
      },
    };
    res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
