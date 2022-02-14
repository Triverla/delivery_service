const res = require("express/lib/response");
const query = require("../../database/index");
const { multipleColumnSet } = require("../Support/utils");

class Order {
  tableName = "orders";

  find = async (params = {}) => {
    const limit = params.limit || 10;
    const offset = params.offset || 0;
    const page = params.page || 1;

    let sql = `SELECT order_id, distance, status FROM ${this.tableName} limit ${limit} offset ${offset}`;

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

  //TO DO: fetch origin and destination values from google map api

  create = async ({ destination, origin }) => {
    let cusId = Math.floor(Math.random() * 1000);
    let OrderId = 10;
    let distance = Math.floor(Math.random() * (9999 - 1000) + 1000);

    const sql2 = `SELECT * FROM ${this.tableName}
        WHERE order_id = ${OrderId}`;

    const result2 = await query(sql2, [cusId]);

    if (result2.length > 0) {
      throw new Error("Order already exists");
    }

    const sql = `INSERT INTO ${this.tableName}
        (order_id, customer_id, destination, origin, distance, status) VALUES (${OrderId},${cusId},?,?,${distance}, 'unassigned')`;

    const result = await query(sql, [destination, origin]);
    const affectedRows = result ? result.affectedRows : 0;

    if (affectedRows < 1) {
      throw new Error("Order not placed");
    }

    const sql3 = `SELECT * FROM ${this.tableName}
        WHERE order_id = ${OrderId}`;

    const result3 = await query(sql3, [cusId]);

    return result3[0];
  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);
    const sql2 = `SELECT status FROM ${this.tableName}
    WHERE id = ${id}`;

    const result2 = await query(sql2, [id]);

    if (result2[0].status == params.status.toLowerCase()) {
      throw new Error("Order already exists");
    }

    const sql = `UPDATE orders SET ${columnSet} WHERE id = ?`;

    const result = await query(sql, [...values, id]);

    return result;
  };
}

module.exports = new Order();
