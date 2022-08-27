const request = require( "supertest" );
const server = require( "../src" );
const dataForQuestions = require( "../dataForQuestions" );

let res;

describe( "Get /actorsWithMultipleCharacters", () => {
    beforeAll( async function() {
        res = await request( server )
            .get( "/actorsWithMultipleCharacters" );
    });
    it( "should return an object", async function() {
        expect( res.statusCode ).toEqual( 200 );
        expect( typeof res.body ).toBe( "object" );
    });
    it( "should only return two actors", function() {
        const actorNames = Object.keys( res.body );
        expect( actorNames ).toHaveLength( 2 );
    });
    it( "should return Chris Evans", function () {
        const actorNames = Object.keys( res.body );
        expect( actorNames.includes( "Chris Evans" ) ).toBe( true );
        expect( Array.isArray( res.body["Chris Evans"] ) ).toBe( true );
        expect( "movieName" in res.body["Chris Evans"][0] ).toBe( true );
        expect( "characterName" in res.body["Chris Evans"][0] ).toBe( true );
    });
    it( "should return Michael B. Jordan", function() {
        const actorNames = Object.keys( res.body );
        expect( actorNames.includes( "Michael B. Jordan" ) ).toBe( true );
    });
    describe( "each Actor", function() {
        it( "should have a valid movie name", () => {
            expect(
                Object.keys( res.body ).every( actorName => {
                    return res.body[actorName].every( movie => {
                        return movie.movieName in dataForQuestions.movies;
                    });
                })
            ).toBe( true );
        });
    });
});
