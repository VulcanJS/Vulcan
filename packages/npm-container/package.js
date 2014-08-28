  var path = Npm.require('path');                                                        // 86
  var fs = Npm.require('fs');                                                            // 87
                                                                                         // 88
  Package.describe({                                                                     // 89
    summary: 'Contains all your npm dependencies',                                       // 90
    version: '1.0.0',                                                                    // 91
    name: 'npm-container'                                                                // 92
  });                                                                                    // 93
                                                                                         // 94
  var packagesJsonFile = path.resolve('./packages.json');                                // 95
  try {                                                                                  // 96
    var fileContent = fs.readFileSync(packagesJsonFile);                                 // 97
    var packages = JSON.parse(fileContent.toString());                                   // 98
    Npm.depends(packages);                                                               // 99
  } catch(ex) {                                                                          // 100
    console.error('ERROR: packages.json parsing error [ ' + ex.message + ' ]');          // 101
  }                                                                                      // 102
                                                                                         // 103
  Package.onUse(function(api) {                                                          // 104
    api.add_files(['index.js', '../../packages.json'], 'server');                        // 105
  });                                                                                    // 106