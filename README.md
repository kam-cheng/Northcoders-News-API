# Northcoders News API

# How to access the two databases locally

- Create the file ".env-development".
- Inside the file - input "PGDATABASE=nc_news"

- Create the file ".env-test"
- Inside the file - input "PGDATABASE=nc_news-test"

- In command, input npm run setup-dbs to create both databases

# GET/api/topics

- returns array of objects containg the slug and description
- returns 404 error if path is incorrect

# GET /api/articles

- returns array of article obtains containing the following properties :

  - author (username from user's table)
  - title
  - article_id
  - topic
  - created_at
  - votes

- articles will be sorted by date in descending order.
