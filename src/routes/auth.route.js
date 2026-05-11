import {getCategory,createCategory,updateCategory,deleteCategory} from "../../src/controller/category.controller"

module.exports = (app ) => {
    app.get("/api/category", getCategory);
    app.post("/api/category", createCategory);
    app.put("/api/category", updateCategory);
    app.delete("/api/category", deleteCategory);
}