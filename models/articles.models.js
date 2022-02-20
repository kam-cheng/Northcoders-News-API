const db = require("../db/connection.js");
const { checkExists } = require("./utils/check-exists");

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
    ![
      "article_id",
      "author",
      "created_at",
      "title",
      "topic",
      "votes",
      "comment_count",
    ].includes(sortBy)
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
  let queryString = `SELECT articles.article_id, users.username AS author, articles.created_at, title, topic, articles.votes, COUNT(comments.article_id) AS comment_count`;
  //add body column if articleId exists
  if (articleId) {
    queryValues.push(articleId);
    queryString += `, articles.body`;
  }
  queryString += ` FROM articles 
    LEFT JOIN users ON articles.author = users.username 
    LEFT JOIN comments ON comments.article_id = articles.article_id`;
  if (articleId) queryString += ` WHERE articles.article_id = $1`;
  if (topic) {
    queryValues.push(topic);
    queryString += ` WHERE topic = $1`;
  }
  queryString += ` GROUP BY articles.article_id, users.username ORDER BY ${sortBy} ${order};`;

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

exports.updateVotes = async (articleId, votes) => {
  const updatedVotes = await db.query(
    `UPDATE articles 
    SET votes = votes + $1 
    WHERE article_id = $2 RETURNING *;`,
    [votes, articleId]
  );
  return updatedVotes.rows[0];
};
