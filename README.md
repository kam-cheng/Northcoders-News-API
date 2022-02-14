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
