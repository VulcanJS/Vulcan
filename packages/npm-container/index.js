  Meteor.npmRequire = function(moduleName) {                                             // 74
    var module = Npm.require(moduleName);                                                // 75
    return module;                                                                       // 76
  };                                                                                     // 77
                                                                                         // 78
  Meteor.require = function(moduleName) {                                                // 79
    console.warn('Meteor.require is deprecated. Please use Meteor.npmRequire instead!'); // 80
    return Meteor.npmRequire(moduleName);                                                // 81
  };                                                                                     // 82