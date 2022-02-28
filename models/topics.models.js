const db = require("../db/connection.js");

exports.fetchTopics = async () => {
  const topics = await db.query("SELECT * FROM topics");
  return topics.rows;
};

exports.addTopic = async (slug, description) => {
  const newTopic = await db.query(
    `INSERT INTO topics 
  (slug, description) 
  VALUES 
  ($1, $2) 
  RETURNING *;`,
    [slug, description]
  );
  return newTopic.rows[0];
};
