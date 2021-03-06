# Northcoders News API

The Northcoders News API allows for users to access, modify, and post content contained within the Northcoders News Database. Actions users can perform on the database include the following:

- Access to the following resources:
  - articles
  - users
  - topics
- Update votes on articles
- Add comments
- Delete comments

## Link to Hosted Version

---

https://northcoders-news-api.herokuapp.com

## Installation Instructions

---

### Version Support

Northcoders News API was created using node.js v17.3.0 and postgres v14.1 so please ensure you update to at least these versions, or the app may not function correctly.

Clone the Repository by accessing your terminal and inputting the following command:

```
git clone https://github.com/kam-cheng/be-nc-news.git
```

Install all package dependencies by inputting the following command:

```
npm install
```

### Accessing the Development and Test Database

Create the following files in the root directory:

Development Database:

- Create the file `.env.development`
- Inside the file - input `PGDATABASE=nc_news`

Test Database:

- Create the file `.env.test`
- Inside the file - input `PGDATABASE=nc_news_test`

To create the databases, input the following in your command terminal:

```
npm run setup-dbs
```

To seed the development tables, input the following in your command terminal:

```
npm run seed
```

To run the database server, input the following into your command terminal:

```
npm run start
```

Check that you have access to the database by performing a browser request to `http://localhost:9090/api` - if you see the API endpoints then you it works!

## Testing on the Database

---

The test suite uses node packages [jest](https://www.npmjs.com/package/jest), [jest-sorted](https://www.npmjs.com/package/jest-sorted) and [supertest](https://www.npmjs.com/package/supertest) to complete its functionality. To run the tests, you may need to install the packages first using the following commands in your terminal:

```
npm install jest -D
npm install jest-sorted -D
npm install supertest -D
```

Once installed, input the following command in your terminal to run the tests:

```
npm test
```

## API Commands

---

The Northcoders News API can perform the following functionality:

### GET/api

responds with a JSON object describing all the available endpoints.

### GET/api/topics

- returns all topics inside a topics object, with the value being an array of objects including the following properties:
  - slug
  - description
- returns a 404 error if the user input path is incorrect.

### POST/api/topics

- Adds topic to database, and returns a topic object containing an object with the following properties:

  - slug
  - description

- Post request must be input in the following format:
  - `{slug: "name", description :"description"}`
- Example of a valid post:
  - `request(app).post("/api/topics").send({slug: "Jim", description :"Not David"})`
- 400 error if input object format is invalid

### GET /api/users

- returns all usernames inside a users object, with the value being an array of objects including with the following property:
  - username

# GET /api/users/:username

- returns user object containing the following properties:
  - username
  - name
  - avatar_url

### GET /api/articles

- returns the first 10 articles inside an articles object, with the value being an array of objects containing the following properties:

  - author
  - title
  - article_id
  - topic
  - created_at
  - votes
  - comment_count
  - total_count (of articles factoring in any filters set)

- returned articles will by default be sorted by the created_at date, in descending order.

### GET /api/articles? Optional Queries

Accepts the following optional queries which can be used to narrow down or restructure the data returned to the user:

- sort_by : sorts articles by any valid column.
  - Greenlist input values include the following:
    - author
    - title
    - article_id
    - topic
    - created_at (default)
    - votes
    - comment_count
  - 400 error if query is not in the greenlist.
- order : sorts articles by ascending or descending order.
  - Greenlist values include the following:
    - asc (for ascending)
    - desc (for descending - default)
  - 400 error if query is not in the greenlist
- topic: filters articles by the topic value specified in the query.
  - returns an empty array if the topic is valid but there are no related articles found.
  - 404 error if user inputs an invalid topic.
- limit: (default of 10) declares number of articles to return.
  - 400 error if user input is not a number
- p: (default of 1) declares page number of articles to return.
  - 400 error if user input is not a number
  - 404 error if page requested exceeds number of available pages.

**queries can be chained by including `&` in the search string.**

### POST /api/articles

- Adds article to database, and returns an article object containing an object with the following properties:

  - author
  - title
  - article_id
  - topic
  - body
  - created_at
  - votes
  - comment_count

- Post request must be input in the following format:
  - `{author: "username", title :"title", body: "body", topic: "topic"}`
- Example of a valid post:
  - `request(app).post("/api/articles").send({author: "Jim", title :"Title of Article", body: "Body of article", topic: "topic of article"})`
- 400 error if input object format is invalid
- 404 error if username is not in database
- 404 error if topic is not in database

### GET /api/articles/:article_id

- returns the article which matches the article_id specified. The article object will contain the following properties:

  - author (username from user's table)
  - title
  - article_id
  - body
  - topic
  - created_at
  - votes
  - comment_count

- 404 error if the article_id is valid but where no article is found.
- 400 error if the user input of article_id is invalid.

### PATCH /api/articles/:article_id

- Increases or decreases the votes of the article matching the article_id sepcified. Returns an article object containing the following properties:

  - author
  - title
  - article_id
  - topic
  - created_at
  - votes
  - body

- Patch request must be input using the following format:
  - `{inc_votes: votecount}`
- Example of a valid request:
  - `request(app).patch('/api/articles/1').send({inc_votes:20})`
- 400 error if the user input is not a number, or where the object sent is not entitled `inc_votes`.

### DELETE /api/articles/:article_id

- Deletes the article and all related comments matching the article_id specified. Responds with a 204 status and no content.
- 404 error if the article_id does not exist.
- 400 error if the user input is invalid.

### GET /api/articles/:article_id/comments

- returns the first 10 comments inside the object's comments property, with the value being an array of objects including with the following properties:

  - comment_id
  - votes
  - created_at
  - author
  - body

- 200 returns an empty array if the article_id is valid but there are no comments.
- 404 error if the article_id does not exist.
- 400 error if the user input of article_id is invalid.

### GET /api/articles/:article_id/comments? Optional Queries

Accepts the following optional queries which can be used to modify the paginated return data:

- limit: (default of 10) declares number of comments to return.
  - 400 error if user input is not a number
- p: (default of 1) declares page number of comments to return.
  - 400 error if user input is not a number
  - 404 error if page requested exceeds number of available pages.

**queries can be chained by including `&` in the search string.**

### POST /api/articles/:article_id/comments

- Adds a comment matching the article_id specified to the database, and returns the posted comment in an object with the following properties:
  - comment_id
  - body
  - votes
  - author
  - article_id
  - created_at
- Post request must be input with the following format:
  - `{username: username, body: body}`
- example of a valid post:
  - `request(app).post("/api/articles/1/comments").send({username: "Jim", body: "insert comment here"})`
- 400 error if input object format is invalid
- 404 error if username is not in database

### DELETE /api/comments/:comment_id

- Deletes the comment matching the comment_id specified. Responds with a 204 status and no content.
- 404 error if the comment_id does not exist.
- 400 error if the user input is invalid.

### PATCH /api/comments/:comment_id

- Increases or decreases the votes of the article matching the comment_id sepcified. Returns a comment object containing the following properties:

  - comment_id
  - body
  - votes
  - author
  - article_id
  - created_at

- Patch request must be input using the following format:
  - `{inc_votes: votecount}`
- Example of a valid request:
  - `request(app).patch('/api/comments/1').send({inc_votes:20})`
- 400 error if the user input is not a number, or where the object sent is not entitled `inc_votes`.
