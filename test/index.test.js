const request = require( "supertest" );
const server = require( "../src" );

describe( "Get /", () => {
    beforeEach( async function() {
        this.res = await request( server )
            .get( "/" );
    });
    it( "should succeed", async function () {
        expect( this.res.statusCode ).toEqual( 200 );
    });
});

