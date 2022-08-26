const request = require( "supertest" );
const server = require( "../src" );


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
    });
    it( "should return Michael B. Jordan", function() {
        const actorNames = Object.keys( res.body );
        expect( actorNames.includes( "Michael B. Jordan" ) ).toBe( true );
    });
});
