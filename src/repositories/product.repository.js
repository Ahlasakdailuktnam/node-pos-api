const { db } = require("../util/helper");
exports.getAll = async (search = "") => {
  let sql = `
    SELECT 
      p.*,
      c.name AS category_name
    FROM product p
    INNER JOIN category c 
    ON p.category_id = c.id
  `;
  const queryParams = [];
  if (search && search.trim() !== "") {
    sql += ` WHERE p.name LIKE ? OR p.brand LIKE ? OR p.barcode LIKE ?`;
    const searchWildcard = `%${search}%`;
    queryParams.push(searchWildcard, searchWildcard, searchWildcard);
  }
  sql += ` ORDER BY p.id DESC`;
  const [rows] = await db.query(sql, queryParams);
  return rows;
};
// Get Product By ID
exports.getById = async (id) => {
  const [rows] = await db.query(
    `
        SELECT *
        FROM product
        WHERE id = ?
        `,
    [id],
  );
  return rows[0];
};
// Create Product
exports.create = async (data) => {
  const sql = `
    INSERT INTO product
    (
        category_id,
        barcode,
        name,
        brand,
        description,
        qty,
        price,
        discount,
        status,
        image,
        create_by
    )
    VALUES(?,?,?,?,?,?,?,?,?,?,?)
    `;
  const [result] = await db.query(sql, [
    data.category_id,
    data.barcode,
    data.name,
    data.brand,
    data.description,
    data.qty,
    data.price,
    data.discount,
    data.status,
    data.image,
    data.create_by,
  ]);
  return result.insertId;
};
// Update Product
exports.update = async (id, data) => {
  const sql = `
    UPDATE product SET
    category_id=?,
    barcode=?,
    name=?,
    brand=?,
    description=?,
    qty=?,
    price=?,
    discount=?,
    status=?,
    image=?
    WHERE id=?
    `;
  const [result] = await db.query(sql, [
    data.category_id,
    data.barcode,
    data.name,
    data.brand,
    data.description,
    data.qty,
    data.price,
    data.discount,
    data.status,
    data.image,
    id,
  ]);
  return result.affectedRows;
};

// Delete
exports.remove = async (id) => {
  const [result] = await db.query(
    `
        DELETE FROM product
        WHERE id=?
        `,
    [id],
  );
  return result.affectedRows;
};
