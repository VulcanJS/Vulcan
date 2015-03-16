SSR.compileTemplate("css",Assets.getText("private/views/common/css.html"));

Template.css.helpers({
  getSetting:function(key){
    return getSetting(key);
  }
});
