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
    VALUES
    (
      :category_id,
      :barcode,
      :name,
      :brand,
      :description,
      :qty,
      :price,
      :discount,
      :status,
      :image,
      :create_by
    )
  `;

  const [result] = await db.query(sql, {
    category_id: data.category_id,
    barcode: data.barcode,
    name: data.name,
    brand: data.brand,
    description: data.description,
    qty: data.qty,
    price: data.price,
    discount: data.discount,
    status: data.status,
    image: data.image,
    create_by: data.create_by,
  });

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
// Generate next barcode number
exports.getLastBarcodeNumber = async () => {
  const [rows] = await db.query(`
    SELECT barcode
    FROM product
    WHERE barcode IS NOT NULL
    ORDER BY id DESC
    LIMIT 1
  `);
  if (rows.length === 0) {
    return 0;
  }
  const lastBarcode = rows[0].barcode;
  // BAR-000001 => 1
  const number = parseInt(lastBarcode.replace("BAR-", ""));
  return number || 0;
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
