const axios = require( "axios" ).default;

const instance = axios.create({
    baseURL: process.env.MOVIEDB_URL || "https://api.themoviedb.org/3",
    timeout: 1000,
    params: {
        api_key: process.env.MOVIEDB_API_KEY
    }
});

module.exports = instance;
