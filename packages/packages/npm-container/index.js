  Meteor.npmRequire = function(moduleName) {                                             // 85
    var module = Npm.require(moduleName);                                                // 86
    return module;                                                                       // 87
  };                                                                                     // 88
                                                                                         // 89
  Meteor.require = function(moduleName) {                                                // 90
    console.warn('Meteor.require is deprecated. Please use Meteor.npmRequire instead!'); // 91
    return Meteor.npmRequire(moduleName);                                                // 92
  };                                                                                     // 93