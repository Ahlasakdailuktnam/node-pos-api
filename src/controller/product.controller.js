const productService = require("../services/product.service");

const asyncHandler = require("../middleware/asyncHandler");

exports.getProducts = asyncHandler(async (req, res) => {
  const search = req.query.search || "";
  const data = await productService.getProducts(search);
  res.json({
    success: true,
    data,
  });
});

exports.getProduct = asyncHandler(async (req, res) => {
  const data = await productService.getProductById(req.params.id);

  res.json({
    success: true,
    data,
  });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const data = {
    ...req.body,
    image: req.file ? req.file.filename : null,
  };
   const id = await productService.createProduct(data);
  res.status(201).json({
    success: true,
    id,
  });
});

// ពេល Update ត្រូវចាប់យក file ដូចពេល Create ដែរ
exports.updateProduct = asyncHandler(async (req, res) => {
  const data = {
    ...req.body,
  };
  // ប្រសិនបើមានរូបភាពថ្មីត្រូវបានបញ្ជូនមក
  if (req.file) {
    data.image = req.file.filename;
  }
  await productService.updateProduct(req.params.id, data);
  res.json({
    success: true,
    message: "Product updated successfully",
  });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);

  res.json({
    success: true,
    message: "Product deleted",
  });
});
