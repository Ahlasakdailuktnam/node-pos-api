const { db } = require("../util/helper");
exports.create = async (data, user) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    // create order number
    const [rows] = await connection.query(`
      SELECT order_no
      FROM orders
      ORDER BY id DESC
      LIMIT 1
    `);

    let orderNo = "ORD-000001";
    if (rows.length > 0) {
      const last = parseInt(rows[0].order_no.replace("ORD-", ""));
      orderNo = `ORD-${String(last + 1).padStart(6, "0")}`;
    }
    // Insert order
    const [orderResult] = await connection.query(
      `
    INSERT INTO orders
    (
      order_no,
      customer_id,
      user_id,
      total_amount,
      paid,
      payment_method,
      remark,
      create_by
    )
    VALUES
    (
      :order_no,
      :customer_id,
      :user_id,
      :total_amount,
      :paid,
      :payment_method,
      :remark,
      :create_by
    )
    `,
      {
        order_no: orderNo,
        customer_id: data.customer_id,
        user_id: user.data.id,
        total_amount: data.total_amount,
        paid: data.paid,
        payment_method: data.payment_method,
        remark: data.remark,
        create_by: user.data.id,
      },
    );
    const orderId = orderResult.insertId;
    for (const item of data.items) {
      // Insert order detail
      await connection.query(
        `
    INSERT INTO order_detail
    (
      order_id,
      product_id,
      qty,
      price,
      discount,
      total
    )
    VALUES
    (
      :order_id,
      :product_id,
      :qty,
      :price,
      :discount,
      :total
    )
    `,
        {
          order_id: orderId,
          product_id: item.product_id,
          qty: item.qty,
          price: item.price,
          discount: item.discount,
          total: item.total,
        },
      );
      const [product] = await connection.query(
        `
  SELECT qty
  FROM product
  WHERE id = ?
  `,
        [item.product_id],
      );

      if (product.length === 0) {
        throw new Error("Product not found");
      }

      if (product[0].qty < item.qty) {
        throw new Error(`Product ${item.product_id} out of stock`);
      }

      await connection.query(
        `
    UPDATE product
    SET qty = qty - ?
    WHERE id = ?
    `,
        [item.qty, item.product_id],
      );
    }
    await connection.commit();
    return {
      id: orderId,
      order_no: orderNo,
    };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};
exports.getAll = async (filter) => {
  const { search = "" } = filter;
  let whereClause = "WHERE 1=1";
  const params = [];
  if (search && search.trim() !== "") {
    whereClause += `
      AND (
        o.order_no LIKE ?
        OR c.name LIKE ?
        OR u.name LIKE ?
      )
    `;
    const keyword = `%${search}%`;
    params.push(keyword, keyword, keyword);
  }
  const sql = `
    SELECT
      o.id,
      o.order_no,
      c.name AS customer_name,
      u.name AS user_name,
      o.total_amount,
      o.paid,
      o.payment_method,
      o.create_at
    FROM orders o
    LEFT JOIN customer c ON o.customer_id = c.id
    LEFT JOIN user u ON o.user_id = u.id
    ${whereClause}
    ORDER BY o.id DESC
  `;
  const [rows] = await db.query(sql, params);
  return rows;
};
exports.getById = async (id) => {
  const [order] = await db.query(
    `
    SELECT
      o.id,
      o.order_no,
      o.total_amount,
      o.paid,
      o.payment_method,
      o.remark,
      o.create_at,
      c.name AS customer_name,
      c.tel AS customer_tel,
      u.name AS cashier_name
    FROM orders o
    LEFT JOIN customer c
      ON o.customer_id = c.id
    LEFT JOIN user u
      ON o.user_id = u.id
    WHERE o.id = ?
    `,
    [id],
  );

  if (order.length === 0) {
    return null;
  }

  const [details] = await db.query(
    `
    SELECT
      od.id,
      od.product_id,
      p.name AS product_name,
      od.qty,
      od.price,
      od.discount,
      od.total

    FROM order_detail od
    INNER JOIN product p
      ON od.product_id = p.id
    WHERE od.order_id = ?
    `,
    [id],
  );

  return {
    ...order[0],
    items: details,
  };
};
