const {
  register,
  login,
  getProfile,
  validate_token,
  getList
} = require("../../src/controller/auth.controller");

module.exports = (app) => {

  // register
  app.get("/api/auth/getlist", getList);
  app.post("/api/auth/register", register);

  // login
  app.post("/api/auth/login", login);

  // profile
  app.get(
    "/api/auth/profile",
    validate_token(),
    getProfile
  );

};