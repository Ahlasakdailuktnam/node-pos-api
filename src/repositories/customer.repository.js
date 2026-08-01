const { db } = require("../util/helper");

exports.getAll = async (filter = {}) => {
  const { search = "", type = "" } = filter;

  let whereClause = "WHERE 1=1";
  const queryParams = [];
  if (search && search.trim() !== "") {
    whereClause += `
            AND (
                name LIKE ?
                OR tel LIKE ?
                OR email LIKE ?
                OR address LIKE ?
            )
        `;

    const keyword = `%${search}%`;

    queryParams.push(keyword, keyword, keyword, keyword);
  }

  if (type) {
    whereClause += " AND type = ?";
    queryParams.push(type);
  }

  const sql = `
        SELECT *
        FROM customer
        ${whereClause}
        ORDER BY id DESC
    `;
  const [rows] = await db.query(sql, queryParams);

  return rows;
};
