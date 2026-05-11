const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors({ origin: "*" }));
app.get("/", (req ,res)=> {
    const list = [
        {id:1 , name: "a"},
        {id:2 , name: "a"},
    ];
    res.json([
        list,
    ]);
})

app.get("/api/home", (req,res)=> {
    const data = [
        {
            "title" : "customer",
            "obj" : {
                "total": 100,
                "total_m": 50,
                "total_f": 50,
            }
        },
        {
            "title" : "sale",
            "obj" : {
                "total": 100,
                "total_m": 50,
                "total_f": 50,
            }
        },
    ]
    res.json({
        list:data,
    })
})

require("./src/routes/category.route")(app);

const PORT=8081;
app.listen(PORT,()=> {
     console.log("http://localhost:" + PORT);  
})