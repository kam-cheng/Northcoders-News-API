const db = require("../db/connection.js");
const { checkExists } = require("./utils/check-exists");

exports.fetchUsers = async () => {
  const users = await db.query("SELECT username FROM users");
  return users.rows;
};

exports.fetchUsername = async (username) => {
  const user = await db.query(`SELECT * FROM users WHERE name = $1`, [
    username,
  ]);
  if (user.rows.length === 0) await checkExists("users", "name", username);
  return user.rows[0];
};
