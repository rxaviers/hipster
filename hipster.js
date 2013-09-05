// Native
var querystring = require("querystring");

// Third Party
var hyperquest = require("hyperquest");
var lru = require("lru-cache");

var HipsterDefaults = {
	cache: {
		max: 50, // max items cache
		length: function() {
			return 1;
		},
		maxAge: 1000 * 60 // max cache age = 60 seconds
	},
	encoding: "UTF8",
	timeout: 3500
};

var cache, Hipster;

function getCacheKey(url, options) {
	// FIXME
}

function request(method, url, data, callback) {
	var options = {
		json: true,
		timeout: Hipster.defaults.timeout
	};

	// Remove url"s leading slash `/`
	url = url.replace(/^\/+/, "");

	// Augment it with baseUrl
	url = [this.baseUrl, url].join("/");

	if (data) {
		if (method == "get") {
			url += (/\?/.test(url) ? "&" : "?") + querystring.encode(data);
		} else {
			// TODO Implement.
			// Need to set options.headers accordingly.
			// potential reference: https://github.com/mikeal/request/blob/adc2cb6721e5980e8ed667a3f558cce8c89ee6c2/request.js#L972
			throw new Error("{data: <data>} not implemented yet for " + method + " requests");
		}
	}

	var cacheKey = getCacheKey(url, options);
	var cachedResource = cache.get(cacheKey);
	if (cachedResource) {
		return callback(null, cachedResource);
	}

	hyperquest[method](url, options, function(error, response) {
		if (error) {
			return callback(error, null);
		}
		var data = "";
		response.on("data", function(chunk) {
			data += chunk;
		});
		response.on("end", function() {
			try {
				data = data.toString(Hipster.defaults.encoding);
				data = JSON.parse(data);
			} catch(error) {
				return callback(error, null);
			}
			cache.set(cacheKey, data);
			return callback(null, data);
		});
	});
}

Hipster = function(baseUrl) {
  // Remove url"s trailing slash `/`
  this.baseUrl = baseUrl.replace(/\/+$/, "");
};

Hipster.defaults = HipsterDefaults;

cache = lru(Hipster.defaults.cache);

Hipster.prototype = {};
["get", "post", "put", "delete"].forEach(function(method) {
	Hipster.prototype[method] = function(url, data, callback) {
		if (!callback) {
			callback = data;
			data = undefined;
		}
		request.call(this, method, url, data, callback);
	};
});

module.exports = Hipster;
