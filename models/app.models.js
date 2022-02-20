const db = require("../db/connection.js");
const fs = require("fs/promises");

exports.fetchTopics = async () => {
  const topics = await db.query("SELECT * FROM topics");
  return topics.rows;
};

exports.fetchEndpoints = async () => {
  const endpoint = await fs.readFile("./endpoints.json", "utf-8");
  return JSON.parse(endpoint);
};
