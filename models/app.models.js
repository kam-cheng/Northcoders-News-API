const db = require("../db/connection.js");

exports.fetchTopics = async () => {
  const topics = await db.query("SELECT * FROM topics");
  return topics.rows;
};

exports.fetchUsers = async () => {
  const users = await db.query("SELECT username FROM users");
  return users.rows;
};

exports.fetchArticles = async (sortBy = "created_at", order = "desc") => {
  if (
    !["article_id", "author", "created_at", "title", "topic", "votes"].includes(
      sortBy
    )
  )
    return Promise.reject({
      status: 400,
      msg: `invalid sort by query specified: ${sortBy}`,
    });
  if (!["asc", "desc"].includes(order))
    return Promise.reject({
      status: 400,
      msg: `invalid order query specified: ${order}`,
    });
  let queryString = `SELECT article_id, author, created_at, title, topic, votes 
    FROM articles
  LEFT JOIN users ON articles.author = users.username
  ORDER BY ${sortBy} ${order};`;
  const articles = await db.query(queryString);
  return articles.rows;
};
