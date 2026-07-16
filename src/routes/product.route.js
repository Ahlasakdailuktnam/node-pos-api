const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  generateProductBarcode,
} = require("../controller/product.controller");

const { validate_token } = require("../controller/auth.controller");
const upload = require("../middleware/upload.middleware");

module.exports = (app) => {
  app.get("/api/product", validate_token(), getProducts);
  app.get(
    "/api/product/generate-barcode",
    validate_token(),
    generateProductBarcode,
  );
  app.get("/api/product/:id", validate_token(), getProduct);

  app.post(
    "/api/product",
    validate_token(),
    upload("products").single("image"),
    createProduct,
  );

  app.put(
    "/api/product/:id",
    validate_token(),
    upload("products").single("image"),
    updateProduct,
  );

  app.delete("/api/product/:id", validate_token(), deleteProduct);
};
