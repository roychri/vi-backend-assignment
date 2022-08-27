const request = require( "supertest" );
const server = require( "../src" );
const dataForQuestions = require( "../dataForQuestions" );

//afterAll( async () => {
//    await server.close();
//});

let res;

describe( "Get /moviesPerActor", () => {
    beforeAll( async function() {
        res = await request( server )
            .get( "/moviesPerActor" );
    });
    it( "should succeed", async function () {
        expect( res.statusCode ).toEqual( 200 );
    });
    it( "should return an object", async function () {
        expect( typeof res.body ).toBe( "object" );
    });
    it( "should have all actor names as keys", function() {
        const keys = Object.keys( res.body );
        expect( keys.every( name => dataForQuestions.actors.includes( name ) ) ).toBe( true );
    });
    describe( "Each Actor", function() {
        it( "should be an array of strings", async function () {
            const keys = Object.keys( res.body );
            expect( Array.isArray( res.body[keys[0]] ) ).toBe( true );
        });
        it( "should have a movie name in the array of string", function() {
            const keys = Object.keys( res.body );
            expect(
                keys.every( actorName => {
                    return res.body[actorName].every( movieName => {
                        return movieName in dataForQuestions.movies;
                    });
                })
            ).toBe( true );
        });
    });
});

