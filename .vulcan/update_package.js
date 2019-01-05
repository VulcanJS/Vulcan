#!/usr/bin/env node


var fs = require('fs');
var mergePackages = require('@userfrosting/merge-package-dependencies');
var jsdiff = require('diff');
require('colors');

function diffPartReducer(accumulator, part) {
  // green for additions, red for deletions
  // grey for common parts
  var color = part.added ? 'green' : (part.removed ? 'red' : 'grey');

  return {
    text: (accumulator.text || '') + part.value[color],
    count: (accumulator.count || 0) + (part.added || part.removed ? 1 : 0),
  };
}

// copied from sort-object-keys package
function sortObjectByKeyNameList(object, sortWith) {
  var keys;
  var sortFn;

  if (typeof sortWith === 'function') {
    sortFn = sortWith;
  } else {
    keys = sortWith;
  }
  return (keys || []).concat(Object.keys(object).sort(sortFn)).reduce(function(total, key) {
    total[key] = object[key];
    return total;
  }, Object.create({}));
}


var appDirPath = './';
var vulcanDirPath = './.vulcan/';

if (!fs.existsSync(vulcanDirPath + 'package.json')) {
  console.log('Could not find \'' + vulcanDirPath + 'package.json\'');
} else if (!fs.existsSync(appDirPath + 'package.json')) {
  console.log('Could not find \'' + appDirPath + 'package.json\'');
} else {
  var appPackageFile = fs.readFileSync(appDirPath + '/package.json');
  var appPackageJson = JSON.parse(appPackageFile);
  var vulcanPackageFile = fs.readFileSync(vulcanDirPath + 'package.json');
  var vulcanPackageJson = JSON.parse(vulcanPackageFile);

  if (appPackageJson.vulcanVersion) {
    console.log(appPackageJson.name + '@' + appPackageJson.version +
      ' \'package.json\' will be updated from Vulcan@' + appPackageJson.vulcanVersion +
      ' to Vulcan@' + vulcanPackageJson.version +
      ' dependencies.');
  } else {
    console.log(appPackageJson.name + '@' + appPackageJson.version +
      ' \'package.json\' will be updated with Vulcan@' + vulcanPackageJson.version +
      ' dependencies.');
  }

  var backupDirPath = vulcanDirPath + 'bkp/';
  if (!fs.existsSync(backupDirPath)) {
    fs.mkdirSync(backupDirPath);
  }
  var backupFilePath = backupDirPath + 'package-' + Date.now() + '.json';
  console.log('Saving a backup of \'' + appDirPath + 'package.json\' in \'' + backupFilePath + '\'');
  fs.writeFileSync(backupFilePath, appPackageFile);

  var updatedAppPackageJson = mergePackages.npm(
    // IMPORTANT: parse again because mergePackages.npm mutates json
    JSON.parse(appPackageFile),
    [vulcanDirPath]
  );

  updatedAppPackageJson.vulcanVersion = vulcanPackageJson.version;

  [
    'dependencies',
    'devDependencies',
    'peerDependencies'
  ].forEach(function(key) {
    if (updatedAppPackageJson[key]) {
      updatedAppPackageJson[key] = sortObjectByKeyNameList(updatedAppPackageJson[key]);
    }

    const diff = jsdiff.diffJson(
      sortObjectByKeyNameList(appPackageJson[key] || {}),
      updatedAppPackageJson[key] || {}
    ).reduce(diffPartReducer, {});
    if (diff.count) {
      console.log('Changes in "' + key + '":');
      console.log(diff.text);
    } else {
      console.log('No changes in "' + key + '".');
    }
  });

  fs.writeFileSync(appDirPath + 'package.json', JSON.stringify(updatedAppPackageJson, null, '  '));
}
