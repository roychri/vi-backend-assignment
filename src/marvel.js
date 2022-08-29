const themoviedb = require( "./themoviedb" );
const dataForQuestions = require( "../dataForQuestions" );

const cache = {};

/**
 * Used to return list of interested movies and the credits for each movies.
 */
class MarvelMovie {
    constructor( movieId, movieName ) {
        this.movieId = movieId;
        this.movieName = movieName;
    }
    /**
     * Returns list of movies we are interested in.
     */
    static list() {
        const movies = [];
        for ( const movieName in dataForQuestions.movies ) {
            const movieId = dataForQuestions.movies[movieName];
            movies.push( new MarvelMovie( movieId, movieName ) );
        }
        return movies;
    }
    /**
     * Used to know which actors played in the movie.
     */
    async credits() {
        const cacheKey = `MarvelMovie_${this.movieId}`;
        if ( cacheKey in cache ) {
            return cache[cacheKey];
        }
        const url = `/movie/${this.movieId}/credits`;
        const resp = await themoviedb( url );
        cache["cacheKey"] = resp;
        return resp.data.cast;
    }
}

/**
 * The meat of this app, handling a list of actors and their
 * role/characters in marvel movies.
 */
class LeadingMarvelActorRoles {
    constructor() {
        this.marvelRoles = [];
    }

    /**
     * Indicate if the actor is one we care about.
     */
    static isLeadingActor( actorName ) {
        const actors = this.list();
        return actors.includes( actorName );
    }

    /**
     * Returns list of actors we are interested in.
     */
    static list() {
        return dataForQuestions.actors;
    }

    /**
     * Retain only the cast/actors we are interested in.
     */
    async addFromCredits( movieName, credits ) {
        const mainCast = credits.filter( person => {
            const name = person.original_name;
            return LeadingMarvelActorRoles.isLeadingActor( name );
        });
        for ( const actor of mainCast ) {
            const marvelActor = new MarvelRole(
                movieName,
                actor.character,
                actor.original_name,
            );
            this.marvelRoles.push( marvelActor );
        }
    }

    /**
     * Returns the list of movies per actor, with actorName as key.
     *
     * Example: { "ActorName: ["Movie Name"] }
     */
    getMoviesPerActor() {
        const response = {};
        for ( const role of this.marvelRoles ) {
            response[role.actorName] = response[role.actorName] || [];
            response[role.actorName].push( role.movieName );
        }
        return response;
    }

    /**
     * Return list of movie role per actor.
     *
     * Example: { "Actor Name": [ MarvelRole ] }
     */
    getRolesByActor() {
        const response = {};
        for ( const role of this.marvelRoles ) {
            response[role.actorName] = response[role.actorName] || [];
            response[role.actorName].push( role );
        }
        return response;
    }

    /**
     * Return list of roles for one specific actor.
     */
    getRolesForActor( actorName ) {
        const roles = this.getRolesByActor();
        return roles[ actorName ];
    }

    /**
     * Only return actors that have more than one distinct role
     */
    getActorsWithMultipleCharacters() {
        const actors = {};
        for ( const actorName in this.getRolesByActor() ) {
            const roles = this.getRolesForActor( actorName );
            const distinctRoles = roles.reduce( ( acc, role ) => {
                if ( !acc.some( r => role.isSimilar( r ) ) ) {
                    acc.push( role );
                }
                return acc;
            }, [] );
            if ( distinctRoles.length > 1 ) {
                actors[actorName] = distinctRoles.map( r => {
                    return { movieName: r.movieName, characterName: r.character };
                });
            }
        }
        return actors;
    }
}

class MarvelRole {
    constructor( movieName, character, actorName ) {
        this.movieName = movieName;
        this.character = character;
        this.actorName = actorName;
    }
    /**
     * Indicate if a given role is similar to another one.
     *
     * This is to detect same role even if they are written differently.
     * Example:
     * "James 'Rhodey' Rhodes / Iron Patriot" vs
     * "Lieutenant James 'Rhodey' Rhodes / War Machine"
     */
    isSimilar( role ) {
        const s1 = role.character;
        const s2 = this.character;
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
}

module.exports = {
    MarvelMovie,
    LeadingMarvelActorRoles,
};
