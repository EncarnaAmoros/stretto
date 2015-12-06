// Karma configuration
// Generated on Thu Dec 03 2015 12:16:10 GMT+0100 (Hora estándar romance)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
		
		// list of files / patterns to load in the browser
    files: [
			'bower_components/angular/angular.js',
			'bower_components/jquery/dist/jquery.js',
			'bower_components/jquery-ui/jquery-ui.js',
			'bower_components/bootstrap/dist/js/bootstrap.js',
			'public/js/ui-bootstrap-tpls-0.14.3.min.js',
			'bower_components/angular-route/angular-route.js',
			'bower_components/angular-ui/build/angular-ui.js',
			'bower_components/angular-mocks/angular-mocks.js',
		
			{pattern: 'public/js/strettoService.js', watched: true, included: true, served: true},
			{pattern: 'public/test/strettoServicesSpec.js', watched: true, included: true, served: true},
			
			{pattern: 'public/js/app.js', watched: true, included: true, served: true},
			
			{pattern: 'public/js/controllers.js', watched: true, included: true, served: true},			
			{pattern: 'public/test/strettoControllersSpec.js', watched: true, included: true, served: true}
    ],

		preprocessors: {
    	'public/test/*.js': [ 'browserify' ] //Mention path as per your test js folder
 		},
		
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'browserify'],
		
		singleRun: true,
		
		plugins : [			
        'karma-browserify',
        'karma-chrome-launcher',
        'karma-jasmine'
 		],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
