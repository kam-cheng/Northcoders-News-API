const db = require("../db/connection.js");

exports.fetchTopics = async () => {
  const topics = await db.query("SELECT * FROM topics");
  return topics.rows;
};

exports.fetchUsers = async () => {
  const users = await db.query("SELECT username FROM users");
  return users.rows;
};

exports.fetchArticles = async (
  sortBy = "created_at",
  order = "desc",
  topic,
  articleId
) => {
  const queryValues = [];
  // greenlist for sortBy
  if (
    !["article_id", "author", "created_at", "title", "topic", "votes"].includes(
      sortBy
    )
  )
    return Promise.reject({
      status: 400,
      msg: `invalid sort by query specified: ${sortBy}`,
    });
  //greenlist for order
  if (!["asc", "desc"].includes(order))
    return Promise.reject({
      status: 400,
      msg: `invalid order query specified: ${order}`,
    });

  let queryString = `SELECT article_id, author, created_at, title, topic, votes`;

  if (articleId) {
    queryValues.push(articleId);
    queryString += `, body`;
  }
  queryString += ` FROM articles
  LEFT JOIN users ON articles.author = users.username`;

  if (topic) {
    queryValues.push(topic);
    queryString += ` WHERE topic = $1`;
  }

  if (articleId) {
    queryString += ` WHERE article_id = $1`;
  }

  queryString += ` ORDER BY ${sortBy} ${order};`;

  const articles = await db.query(queryString, queryValues);
  if (articles.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `No article found for article_id: ${articleId}`,
    });
  }
  //returns first item if using getArticleById
  if (articleId) return articles.rows[0];
  //for all other instances, return rows
  return articles.rows;
};
