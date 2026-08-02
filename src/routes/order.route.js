const { validate_token } = require("../controller/auth.controller");
const { create, getAll, getById } = require("../controller/order.controller");
module.exports = (app) => {
  app.post("/api/order", validate_token(), create);
  app.get("/api/order", validate_token(), getAll);
  app.get("/api/order/:id", validate_token(), getById);
};
