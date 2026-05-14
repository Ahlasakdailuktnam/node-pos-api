const {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/category.controller");
const {validate_token} = require("../controller/auth.controller")
module.exports = (app) => {
  app.get("/api/category", validate_token(), getCategory);
  app.post("/api/category", createCategory);
  app.put("/api/category", updateCategory);
  app.delete("/api/category", deleteCategory);
};  