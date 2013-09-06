module.exports = function(grunt) {

	"use strict";

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		jshint: {
			source: {
				src: ["hipster.js"],
				options: {
					jshintrc: ".jshintrc"
				}
			},
			grunt: {
				src: ["Gruntfile.js"],
				options: {
					jshintrc: ".jshintrc"
				}
			},
			test: {
				src: ["test/**/*.js"],
				options: {
					jshintrc: "test/.jshintrc"
				}
			}
		},
		mochaTest: {
			all: {
				options: {
					reporter: "spec"
				},
				src: ["test/**/*.js"]
			}
		}
	});

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.registerTask("test", ["mochaTest"]);
	grunt.registerTask("default", ["jshint", "test"]);

};

