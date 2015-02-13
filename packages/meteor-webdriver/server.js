/*jshint -W117, -W030, -W016 */
/* global
 DEBUG:true,
 sanjo3:true
 */

log = loglevel.createPackageLogger('[xolvio:webdriver]', process.env.WEBDRIVER_LOG_LEVEL || 'info');

wdio = {};

DEBUG = !!process.env.VELOCITY_DEBUG;

(function () {
  'use strict';

  if (process.env.NODE_ENV !== 'development' || process.env.VELOCITY === '0') {
    return;
  }

  var phantom = Npm.require('phantomjs');

  var defaultOptions = {
    desiredCapabilities: {browserName: 'PhantomJs'},
    port: 4444,
    logLevel: 'silent'
  };

  wdio.instance = Npm.require('webdriverio');

  wdio.getGhostDriver = function (options, callback) {

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options = _.defaults(options, defaultOptions);

    DEBUG && console.log('[xolvio:webdriver]', 'getGhostDriver called');
    _startPhantom(options.port, function () {
      callback(wdio.instance.remote(options));
    });
  };


  function _startPhantom (port, next) {

    var phantomChild = new sanjo3.LongRunningChildProcess('webdriver-phantom');
    if (phantomChild.isRunning()) {
      DEBUG && console.log('[xolvio:webdriver] Phantom is already running, not starting a new one');
      next();
      return;
    }

    phantomChild.spawn({
      command: phantom.path,
      args: ['--ignore-ssl-errors', 'yes', '--webdriver', '' + port],
      options: {
        silent: true,
        detached: true,
        cwd: process.env.PWD
      }
    });

    DEBUG && console.log('[xolvio:webdriver] Starting Phantom.');
    var onPhantomData = Meteor.bindEnvironment(function (data) {
      var stdout = data.toString();
      DEBUG && console.log('[xolvio:webdriver][phantom output]', stdout);
      if (stdout.match(/running/i)) {
        // always show this message
        console.log('[xolvio:webdriver] PhantomJS started.');
        phantomChild.getChild().stdout.removeListener('data', onPhantomData);
        next();
      }
      else if (stdout.match(/Error/)) {
        console.error('[xolvio:webdriver] Error starting PhantomJS');
        next(new Error(data));
      }
    });
    phantomChild.getChild().stdout.on('data', onPhantomData);
  }

})();