SSR.compileTemplate("nav",Assets.getText("private/views/nav/nav.html"));

Template.nav.helpers({
  logoUrl:function(){
    return getSetting("logoUrl");
  },
  siteTitle:function(){
    return getSetting("title", "Telescope");
  },
  headerClass: function () {
    var color = getSetting("headerColor");
    return (color == "white" || color == "#fff" || color == "#ffffff") ? "white-background" : "";
  }
});
