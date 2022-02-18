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

```
placeholder for hosted version
```

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

Create the following files in the root directory:

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

The test suite uses node packages [jest](https://www.npmjs.com/package/jest), [jest-sorted](https://www.npmjs.com/package/jest-sorted) and [supertest](https://www.npmjs.com/package/supertest) to complete its functionality. To run the tests, install the packages first using the following commands in your terminal:

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

### GET /api/users

- returns all usernames inside a users object, with the value being an array of objects including with the following property:
  - username

### GET /api/articles

- returns all articles inside an articles object, with the value being an array of objects including with the following properties:

  - author
  - title
  - article_id
  - topic
  - created_at
  - votes
  - comment_count

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

**queries can be chained by including `&` in the search string.**

### GET /api/articles/:article_id

- returns the article which matches the article_id. The article object will contain the following properties:

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

- Returns an article object with the matching article_id and the updated vote count.
- Patch request must be input using the following format:
  - `{inc_votes: votecount}`
- Example of a valid request:
  - `request(app).patch('/api/articles/1').send({inc_votes:20})`
- 400 error if the user input is not a number, or where the object sent is not entitled `inc_votes`.

### GET /api/articles/:article_id/comments

- Returns all comments matching the article_id inside of a comments object, with the value being an array of objects containing the following properties:

  - comment_id
  - votes
  - created_at
  - author
  - body

- 200 returns an empty array if the article_id is valid but there are no comments.
- 404 error if the article_id does not exist.
- 400 error if the user input of article_id is invalid.

### DELETE /api/comments/:comment_id

- Deletes the comment matching the comment_id specified. Responds with a 204 status and no content.
- 404 error if the comment_id does not exist.
- 400 error if the user input is invalid.
