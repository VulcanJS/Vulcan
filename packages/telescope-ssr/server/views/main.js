SSR.compileTemplate("main",Assets.getText("private/views/main.html"));

Template.main.helpers({
  doctype:function(){
    return "<!DOCTYPE html>";
  },
  faviconUrl:function(){
    return getSetting("faviconUrl", "/img/favicon.ico");
  }
});
