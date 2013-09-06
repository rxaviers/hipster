var expect = require("chai").expect;
var nock = require("nock");

var Hipster = require("../hipster");
var hipster = new Hipster("https://hipster.sparkart.net/api/v1/resources/");

describe("Error requests", function() {

	it("should throw error on 404", function(done) {
		nock("https://hipster.sparkart.net")
			.get("/api/v1/resources/abcdefg/not-found")
			.reply(404, {});
		hipster.get("abcdefg/not-found", function(error) {
			expect(error.statusCode === 404);
			done();
		});
	});

	it("should throw error on 500", function(done) {
		nock("https://hipster.sparkart.net")
			.get("/api/v1/resources/abcdefg/error")
			.reply(500, {});
		hipster.get("abcdefg/error", function(error) {
			expect(error.statusCode === 500);
			done();
		});
	});
});
