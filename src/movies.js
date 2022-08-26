const axios = require( "axios" ).default;

const instance = axios.create({
    baseURL: process.env.MOVIEDB_URL || "https://api.themoviedb.org/3",
    timeout: 1000,
    params: {
        api_key: process.env.MOVIEDB_API_KEY
    }
});
const dataForQuestions = require( "../dataForQuestions" );

const cache = {};

async function getMoviesPerActor() {
    if ( "getMoviesPerActor" in cache ) {
        return cache["getMoviesPerActor"];
    }
    let combinedCast = [];
    for ( const [ , movieId ] of Object.entries( dataForQuestions.movies ) ) {
        const mainCast = await getMainCastForMovie( movieId );
        combinedCast = combinedCast.concat( mainCast );
    }
    const moviesPerActor = combinedCast.reduce( ( acc, person ) => {
        const name = person.original_name;
        acc[name] = acc[name] || [];
        if ( !acc[name].includes( person.character ) ) {
            if ( acc[name].length > 0 ) {
                let found = false;
                for ( const eachName of acc[name] ) {
                    const similar = similarity( person.character, eachName );
                    if ( similar ) {
                        found = true;
                    }
                }
                if ( !found ) {
                    acc[name].push( person.character );
                }
            } else {
                acc[name].push( person.character );
            }
        }
        return acc;
    }, {});
    cache["getMoviesPerActor"] = moviesPerActor;
    return moviesPerActor;
}

async function getMainCastForMovie( movieId ) {
    const url = `/movie/${movieId}/credits`;
    const resp = await instance( url );
    const mainCast = resp.data.cast.filter( person => {
        const name = person.original_name;
        return dataForQuestions.actors.includes( name );
    });
    return mainCast;
}

function similarity( s1, s2 ) {
    const ss1 = s1.replace( /( \([^()]*uncredited[^()]*\)|[^a-zA-Z0-9/ ]+)/g, "" );
    const ss2 = s2.replace( /( \([^()]*uncredited[^()]*\)|[^a-zA-Z0-9/ ]+)/g, "" );
    const names1 = ss1.split( " / " );
    const names2 = ss2.split( " / " );
    let similar = false;
    for ( const name1 of names1 ) {
        for ( const name2 of names2 ) {
            const name1Match = name1.match( new RegExp( name2 ) );
            const name2Match = name2.match( new RegExp( name1 ) );
            if ( name1Match || name2Match ) {
                similar = true;
            }
        }
    }
    return similar;
}

module.exports = {
    getMoviesPerActor,
};
