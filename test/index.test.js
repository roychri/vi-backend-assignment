const request = require( "supertest" );
const server = require( "../src" );

afterAll( async () => {
    await server.close();
});

describe( "Get /", () => {
    beforeEach( async function() {
        this.res = await request( server )
            .get( "/" );
    });
    it( "should succeed", async function () {
        expect( this.res.statusCode ).toEqual( 200 );
    });
});

describe( "Get /moviesPerActor", () => {
    beforeEach( async function() {
        this.res = await request( server )
            .get( "/moviesPerActor" );
    });
    it( "should succeed", async function () {
        expect( this.res.statusCode ).toEqual( 200 );
    });
    it( "should return an object", async function () {
        expect( typeof this.res.body ).toBe( "object" );
    });
    describe( "Each Actor", function() {
        it( "should be an array of strings", async function () {
            const keys = Object.keys( this.res.body );
            expect( Array.isArray( this.res.body[keys[0]] ) ).toBe( true );
        });
    });
});

describe( "Get /actorsWithMultipleCharacters", () => {
    beforeEach( async function() {
        this.res = await request( server )
            .get( "/actorsWithMultipleCharacters" );
    });
    it( "should return an object", async function() {
        expect( this.res.statusCode ).toEqual( 200 );
        expect( typeof this.res.body ).toBe( "object" );
    });
    it( "should only return two actors", function() {
        const actorNames = Object.keys( this.res.body );
        expect( actorNames ).toHaveLength( 2 );
    });
    it( "should return Chris Evans", function () {
        const actorNames = Object.keys( this.res.body );
        expect( actorNames.includes( "Chris Evans" ) ).toBe( true );
    });
    it( "should return Michael B. Jordan", function() {
        const actorNames = Object.keys( this.res.body );
        expect( actorNames.includes( "Michael B. Jordan" ) ).toBe( true );
    });
});
