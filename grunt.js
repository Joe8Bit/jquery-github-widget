/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: 'package.json',
		meta: {
			banner: '/*! jQuery Github Widget - v1.1 *\n' +
				'* https://github.com/JoePettersson/jquery-github-widget *\n' +
				'* Copyright (c) 2012 Joe Pettersson *\n' +
				'* Licensed under the MIT License */'
		},
		min: {
			dist: {
				src: ['<banner:meta.banner>', 'src/jquery.github.js'],
				dest: 'dist/jquery.github.min.js'
			}
		},
		uglify: {
			 mangle: {toplevel: true}
		}
	});

	// Default task.
	grunt.registerTask('default', 'min');

};

