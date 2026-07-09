const asyncHandler = require("../middleware/asyncHandler");
const supplierService = require("../services/supplier.services");
exports.getSupplier = asyncHandler(async (req, res) => {
    const suppliers = await supplierService.getAllSuppliers();
    res.json({
        success: true,
        data: suppliers,
    });
});
exports.createSupplier = asyncHandler(async (req, res) => {
    const id = await supplierService.createSupplier(
        req.body,
        req.auth?.name
    );
    res.status(201).json({
        success: true,
        message: "Supplier created successfully",
        id,
    });
});