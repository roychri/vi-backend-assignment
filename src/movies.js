const axios = require( "./axios" );
const dataForQuestions = require( "../dataForQuestions" );
const cache = {};

async function getActorsWithMultipleCharacters() {
    const response = await getMoviesPerActor();
    return Object.entries( response ).reduce( ( acc, cast ) => {
        const [ actorName, characters ] = cast;
        if ( characters.length > 1 ) {
            acc[actorName] = characters;
        }
        return acc;
    }, {});
}

async function getMoviesPerActor() {
    if ( "getMoviesPerActor" in cache ) {
        return cache["getMoviesPerActor"];
    }
    let combinedCast = [];
    for ( const [ movieName, movieId ] of Object.entries( dataForQuestions.movies ) ) {
        const mainCast = await getMainCastForMovie( movieName, movieId );
        combinedCast = combinedCast.concat( mainCast );
    }
    const moviesPerActor = combinedCast.reduce( ( acc, person ) => {
        const name = person.original_name;
        acc[name] = acc[name] || [];
        if ( !acc[name].includes( person.character ) ) {
            if ( acc[name].length > 0 ) {
                let found = false;
                for ( const each of acc[name] ) {
                    const similar = similarity( person.character, each.characterName );
                    if ( similar ) {
                        found = true;
                    }
                }
                if ( !found ) {
                    acc[name].push({
                        movieName: person.movieName,
                        characterName: person.character
                    });
                }
            } else {
                acc[name].push({
                    movieName: person.movieName,
                    characterName: person.character
                });
            }
        }
        return acc;
    }, {});
    cache["getMoviesPerActor"] = moviesPerActor;
    return moviesPerActor;
}

async function getMainCastForMovie( movieName, movieId ) {
    const url = `/movie/${movieId}/credits`;
    const resp = await axios( url );
    const mainCast = resp.data.cast.filter( person => {
        const name = person.original_name;
        return dataForQuestions.actors.includes( name );
    });
    return mainCast.map( entry => {
        entry.movieName = movieName;
        return entry;
    });
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
    getActorsWithMultipleCharacters,
    getMoviesPerActor,
};
