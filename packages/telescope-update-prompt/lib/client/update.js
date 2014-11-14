compareVersions = function (v1, v2) { // return true if v2 is newer than v1
  var v1Array = v1.split('.');
  var v2Array = v2.split('.');
  // go through each segment of v2 and stop if we find one that's higher
  // than the equivalent segment of v1; else return false
  return v2Array.some( function (value, index) {
    return value > v1Array[index];
  });
  return false;
}

Meteor.startup(function () {
  Session.set('updateVersion', null);

  Meteor.call('phoneHome', function (error, result) {
    // console.log(error)
    // console.log(result)
    if(result){
      var currentVersion = telescopeVersion;
      var newVersion = result.content;
      var message = "";
      if (compareVersions(currentVersion, newVersion)){
        Session.set('updateVersion', newVersion);
      }
    }
  });
});

heroModules.push({
  template: 'updateBanner'
});