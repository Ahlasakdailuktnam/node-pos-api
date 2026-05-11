const {db, isArray,isEmpty} = require("../util/helper")

exports.getCategory = async (req,res) => {
   const [list] = await db.query("SELECT * FROM category");
   res.json({
    list: list,
   });
};

exports.createCategory = (req,res) => {
    res.json({
        list:[2],
    })
}

exports.deleteCategory =(req,res) => {
    res.json({
        list : [4]
    })
}