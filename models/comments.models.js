const db = require("../db/connection.js");
const { checkExists } = require("./utils/check-exists");
const { paginateResults } = require("./utils/paginate.js");

exports.fetchArticleIdComments = async ({ articleId, limit, p }) => {
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

  //paginate results
  const paginatedComments = paginateResults(
    comments.rows,
    "comments",
    limit,
    p
  );
  return paginatedComments;
};

exports.addComment = async (articleId, author, body) => {
  const comment = await db.query(
    `INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3) RETURNING *;`,
    [articleId, author, body]
  );
  return comment.rows[0];
};

exports.deleteCommentId = async (commentId) => {
  const deleteComment = await db.query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
    [commentId]
  );
  if (deleteComment.rows.length === 0)
    return Promise.reject({ status: 404, msg: "comment_id does not exist" });
};

exports.updateCommentIdVotes = async (commentId, votes) => {
  const updateVotes = await db.query(
    `UPDATE comments 
    SET votes = votes + $1 
    WHERE comment_id = $2 RETURNING *;`,
    [votes, commentId]
  );
  return updateVotes.rows[0];
};
