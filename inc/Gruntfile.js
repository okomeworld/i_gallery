module.exports = function(grunt) {

	grunt.initConfig({
		sass: {
			options: {
				style: 'compressed',
				sourcemap: true,
				noCache: true
			},
			styles: {
				src: 'scss/inc_sc.scss',
				dest: 'css/inc_sc.css'
			}
		},
		uglify: {
			js: {
				src: "js/import.js",
				dest: "js/import.min.js"
			}
		},
		concat : {
			js : {
				src : [
				'js/app.js',
				'js/app.namespace.js',
				'js/app.databind.js',
				'js/app.gallery.js'
				],
				dest : 'js/import.js'
			}
		},
		watch: {
			sass: {
				files: ["scss/*.scss"],
				tasks: ['sass']
			},
			js: {
				files: ["js/*.js"],
				tasks: ['concat','uglify']
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

};