# Northcoders News API

The Northcoders News API allows for users to access, modify, and post content contained within the Northcoders News Database. Actions users can perform on the database include the following:

- Access to the following resources:
  - articles
  - users
  - topics
- Update votes on articles
- Add comments
- Delete comments

## Installation Instructions

---

Clone the Repository by accessing your terminal and inputting the following command:

```
git clone https://github.com/kam-cheng/be-nc-news.git
```

Install all dependencies by inputting the following command:

```
npm install
```

### Accessing the Development and Test Database

Create the following files in the root directory

Development Database:

- Create the file `env-development`
- Inside the file - input `PGDATABASE=nc_news`

Test Database:

- Create the file `.env-test`
- Inside the file - input `PGDATABASE=nc_news-test`

To create the databases, input the following in your command terminal:

```
npm run setup-dbs
```

To seed the development tables, input the following in your command terminal:

```
npm run seed
```

## Testing on the Database

---

The test suite uses node packages `jest` and `jest-sorted` to complete its functionality. To run the tests, install the packages using the following commands in your terminal:

```
npm install jest -D
npm install jest-sorted -D
npm install supertest -D
```

Once installed, input the following commands in your terminal to run the tests:

```
npm test
```

## API Commands

---

### GET/api

- responds with JSON describing all available endpoints.

### GET/api/topics

- returns array of objects containg the slug and description
- returns 404 error if path is incorrect

### GET /api/users

- returns array of objects containing the username property

### GET /api/articles

- returns array of article obtains containing the following properties :

  - author (username from user's table)
  - title
  - article_id
  - topic
  - created_at
  - votes

- articles will be sorted by date in descending order.

### GET /api/articles? Optional Queries

- accepts the following optional queries:
  - sort_by : sorts articles by any valid colum (default to date)
    - 400 error if query not in greenlist
  - order : set to ascending(asc) or descending(desc) (defaults to descending)
    - 400 error if query not in greenlist
  - topic: filters articles by topic value specified in query
    - returns empty array if topic valid but no related articles found
    - 404 error if invalid topic is input

### GET /api/articles/:article_id

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

### PATCH /api/articles/:article_id

- returns article object with matching article_id and the updated vote count
- request must be input using the following format {inc_votes: votecount}
- example request - request(app).patch('/api/articles/1').send({inc_votes:20})
- 400 error if value is not a number, or where object sent is not entitled 'inc_votes'

### GET /api/articles/:article_id/comments

- returns array of comments for given article_id
- each comment contains the following properties:

  - comment_id
  - votes
  - created_at
  - author (username from users table)
  - body

- 200 returns empty array if article_id is valid but there are no comments
- 404 error if article_id does not exist
- 400 error if user input of article_id is invalid

### DELETE /api/comments/:comment_id

- deletes comment based on comment_id
- responds with 204 status and no content

- 404 if comment_id does not exist
- 400 if user input is invalid
