const {
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controller/supplier.controller");
const {validate_token} = require("../controller/auth.controller")
module.exports = (app) => {
  app.get("/api/supplier", validate_token(), getSupplier);
  app.post("/api/supplier", createSupplier);
  
};  