# Vi Coding Assignment 

Provides two endpoints in order to determine which actors played more than a single leading role in marvel movies.

* GET /moviesPerActor
* GET /actorsWithMultipleCharacters

## Tools
- Jest and supertest for testing
- Eslint for clean code
- Express for exposing the API endpoints
- Axios to query themoviedb api

## Getting Started

### Install dependencies

Before starting to code, don't forget to install all dependencies.

```shell
yarn
```

### Running tests

Run all tests once:

```shell
npm test
```

### How to use

Start the server and specify the secret API key value:

```shell
MOVIEDB_API_KEY=abc123......789yxz node src
```

On a separate terminal, you can query the endpoints like:

```
curl localhost:3000/moviesPerActor
curl localhost:3000/actorsWithMultiple
```

This way you will see which actors plays more than one leading role.

