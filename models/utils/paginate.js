exports.paginateResults = (results, name, limit, p) => {
  if (limit !== undefined) limit = Number(limit);
  else limit = 10;
  if (p !== undefined) p = Number(p);
  else p = 1;
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
  if (startIndex > results.length) {
    return Promise.reject({
      status: 404,
      msg: `Maximum Page(s) = ${Math.ceil(results.length / limit)}`,
    });
  }
  //include total_count property
  const paginatedResults = {};
  paginatedResults.total_count = results.length;
  paginatedResults[name] = results.slice(startIndex, endIndex);
  return paginatedResults;
};
