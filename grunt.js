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
		cssmin: {
			dist: {
				src: ['<banner:meta.banner>', 'src/github.css'],
				dest: 'dist/github.min.css'
			}
		},
		jasmine: {
			all: {
				src:['specs/*.html'],
				errorReporting: true,
				timeout: 20000
			}
		},
		lint: {
			files: ['src/**/*.js']
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true
			},
			globals: {
				jQuery: true
			}
		},
		uglify: {
			 mangle: {toplevel: true}
		}
	});

	// Default task.
	grunt.registerTask('default', 'lint jasmine min cssmin');
	grunt.loadNpmTasks('grunt-jasmine-task');
	grunt.loadNpmTasks('grunt-css');
};

