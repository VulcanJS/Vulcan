compareVersions = function (v1, v2) { // return true if v2 is newer than v1
  var v1Array = v1.split('.');
  var v2Array = v2.split('.');
  var isGreater = false;
  // go through each segment of v2 and stop if we find one that's higher
  // than the equivalent segment of v1; else return false
  v2Array.some( function (value, index) {
    if (parseInt(value) > parseInt(v1Array[index])) {
      // v2 segment > v1 segment
      isGreater = true;
      return true; // stop comparison
    } else if (parseInt(value) < parseInt(v1Array[index])) {
      // v2 segment < v1 segment
      isGreater = false;
      return true; // stop comparison
    }
    return false; // continue comparison as long as both values are equal
  });
  return isGreater;
};

Meteor.startup(function () {
  Session.set('updateVersion', null);

  Meteor.call('phoneHome', function (error, result) {
    // console.log(error)
    // console.log(result)
    if(result){
      var currentVersion = Telescope.VERSION;
      var newVersion = result.content;
      if (compareVersions(currentVersion, newVersion)){
        Session.set('updateVersion', newVersion);
      }
    }
  });
});

Telescope.modules.add("hero", {
  template: 'update_banner'
});
