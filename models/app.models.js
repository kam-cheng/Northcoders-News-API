const db = require("../db/connection.js");
const format = require("pg-format");

exports.fetchTopics = async () => {
  const topics = await db.query("SELECT * FROM topics");
  return topics.rows;
};

exports.fetchUsers = async () => {
  const users = await db.query("SELECT username FROM users");
  return users.rows;
};

exports.fetchArticles = async (paramObject) => {
  let sortBy = "created_at";
  if (paramObject.sortBy !== undefined) sortBy = paramObject.sortBy;
  let order = "desc";
  if (paramObject.order !== undefined) order = paramObject.order;
  let articleId;
  if (paramObject.articleId !== undefined) articleId = paramObject.articleId;
  let topic;
  if (paramObject.topic !== undefined) topic = paramObject.topic;

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

  //queryString builder for db.query
  let queryString = `SELECT article_id, users.username AS author, created_at, title, topic, votes`;
  //add body column if articleId exists
  if (articleId) {
    queryValues.push(articleId);
    queryString += `, body`;
  }
  queryString += ` FROM articles 
  LEFT JOIN users ON articles.author = users.username`;
  if (articleId) queryString += ` WHERE article_id = $1`;
  if (topic) {
    queryValues.push(topic);
    queryString += ` WHERE topic = $1`;
  }
  queryString += ` ORDER BY ${sortBy} ${order};`;

  const articles = await db.query(queryString, queryValues);

  //testing for 404 errors
  if (articles.rows.length === 0) {
    if (articleId) await checkExists("articles", "article_id", articleId);
    if (topic) await checkExists("topics", "slug", topic);
  }

  //returns first item if using getArticleById
  if (articleId) return articles.rows[0];
  //for all other instances, return rows
  return articles.rows;
};

exports.fetchArticleIdComments = async (articleId) => {
  const comments = await db.query(
    `SELECT comment_id, votes, created_at, users.username AS author, body 
    FROM comments 
    JOIN users ON users.username = comments.author 
    WHERE article_id = $1`,
    [articleId]
  );
  //testing if articleId input matches an article
  if (comments.rows.length === 0)
    await checkExists("articles", "article_id", articleId);
  return comments.rows;
};

//testing for empty values
const checkExists = async (table, column, value) => {
  const queryString = format(`SELECT * FROM %I WHERE %I = $1;`, table, column);
  const dbOutput = await db.query(queryString, [value]);
  if (dbOutput.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `user input ${value} not found`,
    });
  }
};

exports.updateVotes = async (articleId, votes) => {
  const updatedVotes = await db.query(
    `UPDATE articles 
  SET votes = votes + $1 
  WHERE article_id = $2 RETURNING *;`,
    [votes, articleId]
  );
  return updatedVotes.rows[0];
};
