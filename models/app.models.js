const fs = require("fs/promises");

exports.fetchEndpoints = async () => {
  const endpoint = await fs.readFile("./endpoints.json", "utf-8");
  return JSON.parse(endpoint);
};
