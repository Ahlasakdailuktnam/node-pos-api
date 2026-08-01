const asyncHandler = require("../middleware/asyncHandler");
const customerService = require("../services/customer.service");
exports.getCustomer = asyncHandler(async(req,res) => {
     
    const filter = {
        search : req.query.search || "",
        type: req.query.type || ""
    };
    const customer = await customerService.getCustomer(filter );
    res.json({
        success: true,
        data:customer
    });
});