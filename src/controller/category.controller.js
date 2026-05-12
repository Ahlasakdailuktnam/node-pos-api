const {db, isArray,isEmpty} = require("../util/helper")

exports.getCategory = async (req,res) => {
   const [list] = await db.query("SELECT * FROM category");
   res.json({
    list: list,
   });
};

exports.createCategory = async (req,res) => {
  var sql = "INSERT INTO category(Name,Description,Status,ParentId) VALUES (:Name,:Description,:Status,:ParentID) ";
  var [data] = await db.query(sql , {
    Name: req.body.Name,
    Description: req.body.Description,
    Status: req.body.Status,
    ParentID: req.body.ParentID,
  });
  res.json({
    data: data,
  })
}
exports.updateCategory = (req,res)=> {
    res.json({
        list:[3]
    })
}
exports.deleteCategory = async (req,res) => {
    var sql = "DELETE FROM category WHERE Id=:Id";
  var [data] = await db.query(sql , {
   Id: req.body.id,
  });
  res.json({
    data: data,
    message: "delete bn jork jum",
  })
}