const request = require( "supertest" );
const server = require( "../src" );

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
    describe( "Each Actor", function() {
        it( "should be an array of strings", async function () {
            const keys = Object.keys( res.body );
            expect( Array.isArray( res.body[keys[0]] ) ).toBe( true );
        });
    });
});

