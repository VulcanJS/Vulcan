
/**
 * Copied from Meteor tools/files.js.
 *
 * Includes:
 * - Helper to find the app root path
 */

var path = Npm.require('path');
var fs = Npm.require('fs');

// given a predicate function and a starting path, traverse upwards
// from the path until we find a path that satisfies the predicate.
//
// returns either the path to the lowest level directory that passed
// the test or null for none found. if starting path isn't given, use
// cwd.
var xFindUpwards = function (predicate, startPath) {
  var testDir = startPath || process.cwd();
  while (testDir) {
    if (predicate(testDir)) {
      break;
    }
    var newDir = path.dirname(testDir);
    if (newDir === testDir) {
      testDir = null;
    } else {
      testDir = newDir;
    }
  }
  if (!testDir)
    return null;

  return testDir;
};

// Determine if 'filepath' (a path, or omit for cwd) is within an app
// directory. If so, return the top-level app directory.
xFindAppDir = function (filepath) {
  var isAppDir = function (filepath) {
    // XXX once we are done with the transition to engine, this should
    // change to: `return fs.existsSync(path.join(filepath, '.meteor',
    // 'release'))`

    // .meteor/packages can be a directory, if .meteor is a warehouse
    // directory.  since installing meteor initializes a warehouse at
    // $HOME/.meteor, we want to make sure your home directory (and all
    // subdirectories therein) don't count as being within a meteor app.
    try { // use try/catch to avoid the additional syscall to fs.existsSync
      return fs.statSync(path.join(filepath, '.meteor', 'packages')).isFile();
    } catch (e) {
      return false;
    }
  };

  return xFindUpwards(isAppDir, filepath);
};