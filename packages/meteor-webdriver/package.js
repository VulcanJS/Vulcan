(function () {

  'use strict';

  Package.describe({
    name: 'xolvio:webdriver',
    summary: 'Webdriver.io for Meteor',
    version: '0.2.1',
    git: 'git@github.com:xolvio/meteor-webdriver.git',
    debugOnly: true
  });

  Npm.depends({
    'webdriverio': '2.4.2',
    'phantomjs': '1.9.12',
    'fs-extra': '0.12.0'

    // TODO add support for these
    //'chai': '1.9.0'
    //'selenium-standalone': '2.43.1-5',

    //'selenium-webdriver': '2.43.5',
    //'wd': '0.3.9',
  });

  Package.onUse(function (api) {
    api.use('underscore@1.0.2', 'server');
    api.use('coffeescript@1.0.4', 'server');
    api.use('practicalmeteor:loglevel@1.1.0_2', 'server');

    api.addFiles([
      'lib/meteor/files.js',
      'lib/LongRunningChildProcess.coffee',
      'server.js'
    ], 'server');
    api.addFiles(['lib/spawner.js'], 'server', {isAsset: true});

    api.export('wdio', 'server');
  });

})();
