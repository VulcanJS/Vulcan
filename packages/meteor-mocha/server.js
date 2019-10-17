/* global Package */
/* eslint-disable no-console */
import { mochaInstance } from 'meteor/meteortesting:mocha-core';
import { startBrowser } from 'meteor/meteortesting:browser-tests';

import fs from 'fs';

import setArgs from './runtimeArgs';
import handleCoverage from './server.handleCoverage';

if (Package['browser-policy-common'] && Package['browser-policy-content']) {
  const { BrowserPolicy } = Package['browser-policy-common'];

  // Allow the remote mocha.css file to be inserted, in case any CSP stuff
  // exists for the domain.
  BrowserPolicy.content.allowInlineStyles();
  BrowserPolicy.content.allowStyleOrigin('https://cdn.rawgit.com');
}

const { mochaOptions, runnerOptions, coverageOptions } = setArgs();
const { grep, invert, reporter, serverReporter, serverOutput, clientOutput } = mochaOptions || {};

// Since intermingling client and server log lines would be confusing,
// the idea here is to buffer all client logs until server tests have
// finished running and then dump the buffer to the screen and continue
// logging in real time after that if client tests are still running.

let serverTestsDone = false;
const clientLines = [];
function clientLogBuffer(line) {
  if (serverTestsDone) {
    // printing and removing the extra new-line character. The first was added by the client log, the second here.
    console.log(line.replace(/\n$/, ''));
  } else {
    clientLines.push(line);
  }
}

function printHeader(type) {
  const lines = [
    '\n--------------------------------',
    Meteor.isAppTest ? `--- RUNNING APP ${type} TESTS ---` : `----- RUNNING ${type} TESTS -----`,
    '--------------------------------\n',
  ];
  lines.forEach((line) => {
    if (type === 'CLIENT') {
      clientLogBuffer(line);
    } else {
      console.log(line);
    }
  });
}

let callCount = 0;
let clientFailures = 0;
let serverFailures = 0;
function exitIfDone(type, failures) {
  callCount++;
  if (type === 'client') {
    clientFailures = failures;
  } else {
    serverFailures = failures;
    serverTestsDone = true;
    clientLines.forEach((line) => {
      // printing and removing the extra new-line character. The first was added by the client log, the second here.
      console.log(line.replace(/\n$/, ''));
    });
  }

  if (callCount === 2) {
    // We only need to show this final summary if we ran both kinds of tests in the same console
    if (runnerOptions.runServer && runnerOptions.runClient && runnerOptions.browserDriver) {
      console.log('All tests finished!\n');
      console.log('--------------------------------');
      console.log(`${Meteor.isAppTest ? 'APP ' : ''}SERVER FAILURES: ${serverFailures}`);
      console.log(`${Meteor.isAppTest ? 'APP ' : ''}CLIENT FAILURES: ${clientFailures}`);
      console.log('--------------------------------');
    }

    handleCoverage(coverageOptions).then(() => {
      // if no env for TEST_WATCH, tests should exit when done
      if (!runnerOptions.testWatch) {
        if (clientFailures + serverFailures > 0) {
          process.exit(1); // exit with non-zero status if there were failures
        } else {
          process.exit(0);
        }
      }
    });
  }
}

function serverTests(cb) {
  if (!runnerOptions.runServer) {
    console.log('SKIPPING SERVER TESTS BECAUSE TEST_SERVER=0');
    exitIfDone('server', 0);
    if (cb) cb();
    return;
  }

  printHeader('SERVER');

  if (grep) mochaInstance.grep(grep);
  if (invert) mochaInstance.options.invert = invert;
  mochaInstance.options.useColors = true;

  // We need to set the reporter when the tests actually run to ensure no conflicts with
  // other test driver packages that may be added to the app but are not actually being
  // used on this run.
  mochaInstance.reporter(serverReporter || reporter || 'spec', {
    output: serverOutput,
  });

  mochaInstance.run((failureCount) => {
    if (typeof failureCount !== 'number') {
      console.log('Mocha did not return a failure count for server tests as expected');
      exitIfDone('server', 1);
    } else {
      exitIfDone('server', failureCount);
    }
    if (cb) cb();
  });
}

function clientTests() {
  if (!runnerOptions.runClient) {
    console.log('SKIPPING CLIENT TESTS BECAUSE TEST_CLIENT=0');
    exitIfDone('client', 0);
    return;
  }

  if (!runnerOptions.browserDriver) {
    console.log('Load the app in a browser to run client tests, or set the TEST_BROWSER_DRIVER environment variable. '
      + 'See https://github.com/meteortesting/meteor-mocha/blob/master/README.md#run-app-tests');
    exitIfDone('client', 0);
    return;
  }

  printHeader('CLIENT');

  startBrowser({
    stdout(data) {
      if (clientOutput) {
        fs.appendFileSync(clientOutput, data.toString());
      } else {
        clientLogBuffer(data.toString());
      }
    },
    writebuffer(data) {
      if (clientOutput) {
        fs.appendFileSync(clientOutput, data.toString());
      } else {
        clientLogBuffer(data.toString());
      }
    },
    stderr(data) {
      if (clientOutput) {
        fs.appendFileSync(clientOutput, data.toString());
      } else {
        clientLogBuffer(data.toString());
      }
    },
    done(failureCount) {
      if (typeof failureCount !== 'number') {
        console.log('The browser driver package did not return a failure count for server tests as expected');
        exitIfDone('client', 1);
      } else {
        exitIfDone('client', failureCount);
      }
    },
  });
}

// Before Meteor calls the `start` function, app tests will be parsed and loaded by Mocha
function start() {
  // Run in PARALLEL or SERIES
  // Running in series is a better default since it avoids db and state conflicts for newbs.
  // If you want parallel you will know these risks.
  if (runnerOptions.runParallel) {
    console.log('Warning: Running in parallel can cause side-effects from state/db sharing');

    serverTests();
    clientTests();
  } else {
    serverTests(() => {
      clientTests();
    });
  }
}

export { start };
