'use strict';

const roboter = require('roboter');

roboter.
  workOn('server').
  equipWith(task => {
    task('universal/analyze', {
      src: [ '**/*.js', '!node_modules/**/*.js', '!coverage/**/*.js' ]
    });

    task('universal/test-units', {
      src: 'test/**/*Tests.js'
    });

    task('universal/coverage', {
      src: 'lib/**/*.js',
      test: 'test/**/*Tests.js'
    });
  }).
  start();
