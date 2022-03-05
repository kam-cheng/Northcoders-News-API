const db = require("../db/connection.js");
const { checkExists } = require("./utils/check-exists");

exports.fetchArticles = async (paramObject) => {
  let sortBy = "created_at";
  if (paramObject.sortBy !== undefined) sortBy = paramObject.sortBy;
  let order = "desc";
  if (paramObject.order !== undefined) order = paramObject.order;

  const articleId = paramObject.articleId;
  const topic = paramObject.topic;

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
  queryString += ` GROUP BY articles.article_id, users.username 
  ORDER BY ${sortBy} ${order};`;

  const articles = await db.query(queryString, queryValues);

  //testing for 404 errors
  if (articles.rows.length === 0) {
    if (articleId) await checkExists("articles", "article_id", articleId);
    if (topic) await checkExists("topics", "slug", topic);
  }

  //returns first item if using getArticleById
  if (articleId) return articles.rows[0];
  //for all other instances, return rows
  //paginate rows first

  let limit = 10;
  if (paramObject.limit !== undefined) limit = Number(paramObject.limit);
  let p = 1;
  if (paramObject.p !== undefined) p = Number(paramObject.p);

  //test for invalid values input
  if (isNaN(p) || isNaN(limit)) {
    return Promise.reject({
      status: 400,
      msg: `Invalid syntax input`,
    });
  }
  const startIndex = (p - 1) * limit;
  const endIndex = p * limit;
  //test for page limit
  if (startIndex > articles.rows.length) {
    return Promise.reject({
      status: 404,
      msg: `Maximum Page(s) = ${Math.ceil(articles.rows.length / limit)}`,
    });
  }
  //include total_count property
  const paginatedArticles = {};
  paginatedArticles.total_count = articles.rows.length;
  paginatedArticles.articles = articles.rows.slice(startIndex, endIndex);

  return paginatedArticles;
};

exports.createArticle = async (author, title, body, topic) => {
  const article = await db.query(
    `INSERT INTO articles 
    (author, title, body, topic) 
    VALUES 
    ($1, $2, $3, $4)
    RETURNING article_id`,
    [author, title, body, topic]
  );
  //runs fetchArticles function with articleId to include comment_count
  return this.fetchArticles({ articleId: article.rows[0].article_id });
};

exports.deleteArticleId = async (articleId) => {
  //delete comments linked to articles first
  await db.query(
    `DELETE FROM comments 
  WHERE article_id = $1 RETURNING *;`,
    [articleId]
  );
  //delete articles
  const deletedArticle = await db.query(
    `DELETE FROM articles 
    WHERE article_id = $1 RETURNING *;`,
    [articleId]
  );
  if (deletedArticle.rows.length === 0)
    return Promise.reject({ status: 404, msg: "article_id does not exist" });
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
