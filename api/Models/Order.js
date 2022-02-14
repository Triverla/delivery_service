const res = require("express/lib/response");
const query = require("../../database/index");
const { multipleColumnSet } = require("../Support/utils");

class Order {
  tableName = "orders";

  find = async (params = {}) => {
    let sql = `SELECT order_id, distance, status FROM ${this.tableName}`;

    if (!Object.keys(params).limit) {
      return await query(sql);
    }

    const { columnSet, values } = multipleColumnSet(params);
    sql += ` WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

    const result = await query(sql, [...values]);

    // return back the first row (user)
    return result[0];
  };

  create = async ({ destination, origin }) => {
    let cusId = Math.floor(Math.random() * 1000);
    let OrderId = Math.floor(Math.random() * (999999 - 100000) + 100000);
    let distance = Math.floor(Math.random() * (9999 - 1000) + 1000);
    const sql = `INSERT INTO ${this.tableName}
        (order_id, customer_id, destination, origin, distance, status) VALUES (${OrderId},${cusId},?,?,${distance}, 'unassigned')`;

    const result = await query(sql, [
      destination,
      origin
    ]);
    const affectedRows = result ? result.affectedRows : 0;

    if(affectedRows < 1) {
        throw new Error("Order not placed");
    }

    const sql2 = `SELECT * FROM ${this.tableName}
        WHERE order_id = ${OrderId}`;

    const result2 = await query(sql2, [cusId]);

    return result2[0];

  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `UPDATE orders SET ${columnSet} WHERE id = ?`;

    const result = await query(sql, [...values, id]);

    return result;
  };
}

module.exports = new Order();
