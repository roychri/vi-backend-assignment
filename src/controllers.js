const { LeadingMarvelActorRoles, MarvelMovie } = require( "./marvel.js" );

async function actorsWithMultipleCharacters() {
    const leadingActors = new LeadingMarvelActorRoles();
    const movies = MarvelMovie.list();
    for ( const movie of movies ) {
        leadingActors.addFromCredits( movie.movieName, await movie.credits() );
    }
    const actors = leadingActors.getActorsWithMultipleCharacters();
    return actors;
}

async function moviesPerActor() {
    const leadingActors = new LeadingMarvelActorRoles();
    const movies = MarvelMovie.list();
    for ( const movie of movies ) {
        leadingActors.addFromCredits( movie.movieName, await movie.credits() );
    }
    const moviesPerActor = leadingActors.getMoviesPerActor();
    return moviesPerActor;
}

module.exports = {
    actorsWithMultipleCharacters,
    moviesPerActor,
};
