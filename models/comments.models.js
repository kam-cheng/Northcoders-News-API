const db = require("../db/connection.js");
const { checkExists } = require("./utils/check-exists");

exports.fetchArticleIdComments = async (paramObject) => {
  const { articleId } = paramObject;
  let limit = 10;
  if (paramObject.limit !== undefined) limit = paramObject.limit;
  let p = 1;
  if (paramObject.p !== undefined) p = paramObject.p;
  p = (p - 1) * limit;

  const comments = await db.query(
    `SELECT comment_id, votes, created_at, users.username AS author, body
      FROM comments 
      JOIN users ON users.username = comments.author 
      WHERE article_id = $1 
      LIMIT $2 OFFSET $3;`,
    [articleId, limit, p]
  );
  //testing if articleId input matches an article
  if (comments.rows.length === 0) {
    await checkExists("articles", "article_id", articleId);
  }

  if (p > comments.rows.length)
    return Promise.reject({
      status: 404,
      msg: `Page request exceeds available pages`,
    });

  //paginate results
  return comments.rows;
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
