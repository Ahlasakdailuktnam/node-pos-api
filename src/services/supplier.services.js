const { db } = require("../util/helper");
const AppError = require("../util/AppError");
const getAllSuppliers = async () => {
  const [list] = await db.query("SELECT * FROM suppiler ORDER BY id DESC");
  if (list.length === 0) {
    throw new AppError("No supplier found", 404);
  }
  return list;
};
const createSupplier = async (data, user) => {
  const { name, code, tel, email, address, website, note } = data;
  const [exist] = await db.query("SELECT id FROM suppiler WHERE code=?", [
    code,
  ]);
  if (exist.length > 0) {
    throw new AppError("Supplier code already exists", 409);
  }
  const sql = `
        INSERT INTO suppiler
        (
            name,
            code,
            tel,
            email,
            address,
            website,
            note,
            create_by
        )
        VALUES
        (
            :name,
            :code,
            :tel,
            :email,
            :address,
            :website,
            :note,
            :create_by
        )
    `;
  const [result] = await db.query(sql, {
    name,
    code,
    tel,
    email,
    address,
    website,
    note,
    create_by: user,
  });

  return result.insertId;
};
module.exports = {
  getAllSuppliers,
  createSupplier,
};
