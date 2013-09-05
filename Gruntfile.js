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
			}
		}
	});

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.registerTask("default", ["jshint"]);

};

