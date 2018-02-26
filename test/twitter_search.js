var chakram = require("chakram");
    chakramExpect = chakram.expect;
var chaiExpect = require('chai').expect

describe("Test Twitter Search API", function() {

    var apiResponse;
    var apiResponseBody;

    before("Call Twitter search API and set response values", function () { 
        
        var search_params = require("../data_files/twitter_search_data.json");

        var options = {
            oauth: {
                consumer_key: process.env.TWITTER_CONSUMER_KEY,
                consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                token: process.env.TWITTER_TOKEN,
                token_secret: process.env.TWITTER_TOKEN_SECRET,
            },
        }
        // all recent Tweets in Portuguese, near Maracanã soccer stadium in Rio de Janeiro
        apiResponse = chakram.get(`https://api.twitter.com/1.1/search/tweets.json?q=&geocode=${search_params['latitude']},${search_params['longitude']},1km&lang=${search_params['language']}&result_type=${search_params['type']}&count=${search_params['count']}`, options)
        apiResponse.then(function (response){
            apiResponseBody = response.body
        })
    });

    it("should allow checking maximum response time", function () {
        return chakramExpect(apiResponse).to.have.responsetime(1000);
    });

    it("should provide HTTP status of 200", function () {
        return chakramExpect(apiResponse).to.have.status(200);
    });

    it("should provide HTTP specific assertions header", function () {
        return chakramExpect(apiResponse).to.have.header("content-type");
    });

    it("should not detect gzip compression", function () {
        return chakramExpect(apiResponse).not.to.be.encoded.with.gzip;
    });

    it("should make sure no more than 5 statuses are returned", function () {
        return chaiExpect(apiResponseBody.statuses).to.have.lengthOf.at.most(5);
    });

    it("should make sure id in the first status is the correct object type", function () {
        return chaiExpect(apiResponseBody.statuses[0].id).to.be.a('number');
    });

    it("should make sure id string in the first status is the correct object type", function () {
        return chaiExpect(apiResponseBody.statuses[0].id_str).to.be.a('string');
    });

    it("should make sure text in the first status is the correct object type", function () {
        return chaiExpect(apiResponseBody.statuses[0].text).to.be.a('string');
    });

    it("should make sure the correct language is listed in the first status", function () {
        return chaiExpect(apiResponseBody.statuses[0].lang).to.equal('pt');
    });

    it("should make sure place id value in place of the first status is correct", function () {
        return chaiExpect(apiResponseBody.statuses[0].place.id).to.equal('97bcdfca1a2dca59');
    });

    it("should make sure place type value in place of the first status is correct", function () {
        return chaiExpect(apiResponseBody.statuses[0].place.place_type).to.equal('city');
    });

    it("should make sure place name value in place of the first status is correct", function () {
        return chaiExpect(apiResponseBody.statuses[0].place.name).to.equal('Rio de Janeiro');
    });

    it("should make sure full name value in place of the first status is correct", function () {
        return chaiExpect(apiResponseBody.statuses[0].place.full_name).to.equal('Rio de Janeiro, Brazil');
    });

    it("should make sure country code value in place of the first status is correct", function () {
         return chaiExpect(apiResponseBody.statuses[0].place.country_code).to.equal('BR');
    });

    it("should make sure country value in place of the first status is correct", function () {
         return chaiExpect(apiResponseBody.statuses[0].place.country).to.equal('Brazil');
    });
});