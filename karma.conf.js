module.exports = function(config) {
    config.set({
  
      basePath: '.',
  
      files: [
        'node_modules/angular/angular.js',
        'node_modules/angular-route/angular-route.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'public/*.js',
        'public/app/*.js',
        'public/app/**/*.js',
        'test/*.js',
        'test/mock/*.js'
      ],
  
      port: 3333,

      autoWatch: true,
  
      frameworks: ['jasmine', 'browserify'],
  
      browsers: ['Chrome'],
  
      plugins: [
        'karma-browserify',
        'karma-chrome-launcher',
        'karma-firefox-launcher',
        'karma-jasmine',
        'karma-junit-reporter'
      ],

      preprocessors: {
        'test/*.js': [ 'browserify' ]
      },
  
      junitReporter: {
        outputFile: 'test/unit.xml',
        suite: 'unit'
      }
  
    });
  };