
const { validate_token } = require("../controller/auth.controller");
const { getCustomer } = require("../controller/customer.controller");

module.exports = (app) => {
  app.get("/api/customer", validate_token(), getCustomer);
};
