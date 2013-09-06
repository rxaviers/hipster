var async = require("async");
var expect = require("chai").expect;
var nock = require("nock");

var Hipster = require("../hipster");
var hipster = new Hipster("https://hipster.sparkart.net/api/v1/resources/");
var testData = { test: true };

describe("GET requests", function() {

	it("should make a request", function(done) {
		nock("https://hipster.sparkart.net")
			.get("/api/v1/resources/abcdefg/my-resource")
			.reply(200, {});
		hipster.get("abcdefg/my-resource", function(error) {
			if(error) {
				throw error;
			}
			done();
		});
	});

	it("should encode data as url querystring", function(done) {
		async.parallel([
			function(callback) {
				nock("https://hipster.sparkart.net")
					.get("/api/v1/resources/abcdefg/my-resource?foo=bar")
					.reply(200, {});
				hipster.get("abcdefg/my-resource", {foo: "bar"}, function(error) {
					callback(error);
				});
			},
			function(callback) {
				nock("https://hipster.sparkart.net")
					.get("/api/v1/resources/abcdefg/my-resource?foo=bar&baz=qux")
					.reply(200, {});
				hipster.get("abcdefg/my-resource?foo=bar", {baz: "qux"}, function(error) {
					callback(error);
				});
			}
		], function(error) {
			if(error) {
				throw error;
			}
			done();
		});
	});

	it("should parse and return JSON data when successful", function(done) {
		nock("https://hipster.sparkart.net")
			.get("/api/v1/resources/hijklmn/my-resource")
			.reply(200, testData);
		hipster.get("hijklmn/my-resource", function(error, data) {
			expect(data).to.eql(testData);
			done();
		});
	});
});
