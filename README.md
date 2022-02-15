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

# GET /api/users

- returns array of objects containing the username property

# GET /api/articles

- returns array of article obtains containing the following properties :

  - author (username from user's table)
  - title
  - article_id
  - topic
  - created_at
  - votes

- articles will be sorted by date in descending order.

# GET /api/articles? Optional Queries

- accepts the following optional queries:
  - sort_by : sorts articles by any valid colum (default to date)
  - order : set to ascending(asc) or descending(desc) (defaults to descending)
  - topic: filters articles by topic value specified in query

# GET /api/articles/:article_id

- returns article object article with matching article_id.
- article object will contain the following properties:

  - author (username from user's table)
  - title
  - article_id
  - body
  - topic
  - created_at
  - votes

- 404 error if article_id is valid no article is found
- 400 error if user input of article_id is invalid
