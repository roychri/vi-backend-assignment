const express = require( "express" );
const app = express();
const port = process.env.PORT || 3000;
const { moviesPerActor, actorsWithMultipleCharacters } = require( "./controllers" );

app.get( "/", ( req, res ) => {
    res.send( "Hello World!" );
});

app.get( "/moviesPerActor", async ( req, res ) => {
    try {
        const response = await moviesPerActor();
        res.json( response );
    } catch ( err ) {
        console.log( err );
        res.status( 500 ).json({ err });
    }
});

app.get( "/actorsWithMultipleCharacters", async ( req, res ) => {
    try {
        const response = await actorsWithMultipleCharacters();
        res.json( response );
    } catch ( err ) {
        console.log( err );
        res.status( 500 ).json({ err });
    }
});

if ( process.env.NODE_ENV !== "test" ) {
    app.listen( port, () => {
        console.log( `Example app listening on port ${port}` );
    });
}
module.exports = app;
