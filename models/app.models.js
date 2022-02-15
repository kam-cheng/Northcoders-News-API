const db = require("../db/connection.js");

exports.fetchTopics = async () => {
  const topics = await db.query("SELECT * FROM topics");
  return topics.rows;
};

exports.fetchArticles = async (articleId) => {
  let queryString = `SELECT author, title, article_id`;
  const queryValues = [];

  if (articleId) {
    queryValues.push(articleId);
    queryString += `, body`;
  }
  queryString += `, topic, created_at, votes FROM articles
  LEFT JOIN users ON articles.author = users.username`;
  if (articleId) queryString += ` WHERE article_id = $1`;
  queryString += ` ORDER BY created_at desc;`;

  const articles = await db.query(queryString, queryValues);
  if (articles.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `No article found for article_id: ${articleId}`,
    });
  }
  return articles.rows;
};
