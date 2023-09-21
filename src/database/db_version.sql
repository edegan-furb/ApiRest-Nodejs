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