const db = require("../../db/connection.js");
const format = require("pg-format");

//testing for empty values
exports.checkExists = async (table, column, value) => {
  const queryString = format(`SELECT * FROM %I WHERE %I = $1;`, table, column);
  const dbOutput = await db.query(queryString, [value]);
  if (dbOutput.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `user input ${value} not found`,
    });
  }
};
