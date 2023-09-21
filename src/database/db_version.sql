-- 20/09/2023
CREATE TABLE IF NOT EXISTS product_images (
  id_image INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  id_product INT,
  path VARCHAR(255),
  FOREIGN KEY (id_product) REFERENCES products (id_product)
);