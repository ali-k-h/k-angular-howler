// Karma configuration
// Generated on 2016-11-02

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: ['jasmine'],
    preprocessors: {
      '**/*.html': ['ng-html2js']
    },

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/angular/angular.js',

     // 'bower_components/howler.js/dist/howler.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      'app/scripts/**/*.js',
      'app/**/*.html',
     // 'test/mock/**/*.js',
      'test/**/*.js'
    ],


    ngHtml2JsPreprocessor: {
      //cacheIdFromPath: function (filepath) {
      //   console.log('.........' + filepath);
      //   //The suggested filepath.strip would through an error
      //   var cacheId = filepath.replace('app/', '');
      //   return cacheId;
      // },
      moduleName: 'templates'
    },


    // list of files / patterns to exclude
    exclude: [
      'app/scripts/player.service.js',
    ],

    // web server port
    port: 18080,
  //  plugins : ['karma-jasmine', 'karma-phantomjs-launcher'],
    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    // Which plugins to enable
    //browsers: ['PhantomJS'],
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
   // singleRun: false,
    colors: true,
    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
     singleRun: false,
    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
