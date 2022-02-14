const db = require("../db/connection.js");

exports.fetchTopics = async () => {
  const topics = await db.query("SELECT * FROM topics");
  return topics.rows;
};

exports.fetchArticles = async () => {
  const articles =
    await db.query(`SELECT article_id, author, created_at, title, topic, votes 
    FROM articles
  LEFT JOIN users ON articles.author = users.username
  ORDER BY created_at desc`);
  return articles.rows;
};
