const express = require("express");
const cors = require("cors");
const path = require("path");

const errorHandler = require("./src/middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));

require("./src/routes/category.route")(app);
require("./src/routes/auth.route")(app);
require("./src/routes/supplier.route")(app);
require("./src/routes/product.route")(app);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(errorHandler);

const PORT = 8081;

app.listen(PORT, () => {
  console.log("http://localhost:" + PORT);
});
