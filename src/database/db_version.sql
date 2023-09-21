-- 20/09/2023
CREATE TABLE IF NOT EXISTS product_images (
  id_image INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  id_product INT,
  path VARCHAR(255),
  FOREIGN KEY (id_product) REFERENCES products (id_product)
);
-- 21/09/2023
CREATE TABLE IF NOT EXISTS categories (
  id_categories INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100)
);
ALTER TABLE products
ADD id_categories INT NOT NULL;

ALTER TABLE products
ADD CONSTRAINT fk_products_categories FOREIGN KEY(id_categories) REFERENCES categories(id_categories);

ALTER TABLE orders
ADD COLUMN id_user INT NOT NULL;

ALTER TABLE orders
ADD CONSTRAINT fk_orders_users
FOREIGN KEY (id_user)
REFERENCES users(id_user); 

SELECT *
FROM users
INNER JOIN orders ON users.id_user = orders.id_user
INNER JOIN products ON orders.id_product = products.id_product
INNER JOIN categories ON products.id_categories = categories.id_categories
INNER JOIN product_images ON products.id_product = product_images.id_product;