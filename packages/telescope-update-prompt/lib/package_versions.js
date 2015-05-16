Meteor.methods({
  getPackageVersions: function () {
    if (Meteor.isServer) {
      var url = "https://atmospherejs.com/a/packages/findByNames";
      var packageNames = _.filter(_.keys(Package), function (packageName){
        return packageName.indexOf("telescope") !== -1;
      });
      this.unblock;
      try {
        var result = HTTP.get(url, {
          headers: {
            "Accept": "application/json"
          },
          params: {
            names: packageNames
          }
        });
        // console.log(result);
        var packageData = JSON.parse(result.content);
        var versionData = packageData.map(function (package){
          return {
            name: package.name,
            latestVersion: package.latestVersion.version,
            currentVersion: MeteorFilesHelpers.getPackageVersion(package.name)
          };
        });
        console.log(versionData);
        return versionData;
      } catch (e) {
        console.log(e)
        return e;
      }
    }
  }
});
