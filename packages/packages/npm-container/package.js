  var path = Npm.require('path');                                                        // 97
  var fs = Npm.require('fs');                                                            // 98
                                                                                         // 99
  Package.describe({                                                                     // 100
    summary: 'Contains all your npm dependencies',                                       // 101
    version: '1.0.0',                                                                    // 102
    name: 'npm-container'                                                                // 103
  });                                                                                    // 104
                                                                                         // 105
  var packagesJsonFile = path.resolve('./packages.json');                                // 106
  try {                                                                                  // 107
    var fileContent = fs.readFileSync(packagesJsonFile);                                 // 108
    var packages = JSON.parse(fileContent.toString());                                   // 109
    Npm.depends(packages);                                                               // 110
  } catch(ex) {                                                                          // 111
    console.error('ERROR: packages.json parsing error [ ' + ex.message + ' ]');          // 112
  }                                                                                      // 113
                                                                                         // 114
  Package.onUse(function(api) {                                                          // 115
    api.add_files(['index.js', '../../packages.json'], 'server');                        // 116
  });                                                                                    // 117