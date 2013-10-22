'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      files: [ '**/*.js', '!node_modules/**/*.js', '!public/**/*.js' ],
      options: {
        jshintrc: 'jshint.json'
      }
    },

    mochaTest: {
      test: {
        options: {
          bail: true,
          reporter: 'spec',
          ui: 'tdd'
        },
        src: ['test/**/*.js']
      }
    },

    watch: {
      options: {
        files: [ '**/*.js', '!node_modules/**/*.js' ],
        tasks: [ 'default' ],
        interrupt: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', [ 'jshint', 'mochaTest' ]);
};
