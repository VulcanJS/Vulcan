SSR.compileTemplate("css",Assets.getText("private/views/common/css.html"));

var fs=Npm.require("fs");
var fsReadFileSync=Meteor.wrapAsync(fs.readFile,fs);

Template.css.helpers({
  getSetting:function(key){
    return getSetting(key);
  },
  css:function(){
    var cssName = _.find(_.keys(WebAppInternals.staticFiles), function (fileName) {
      return /.css$/.test(fileName);
    });
    var cssPath = WebAppInternals.staticFiles[cssName].absolutePath;
    var css = fsReadFileSync(cssPath,{
      encoding: "utf8"
    });
    return css;
  }
});
