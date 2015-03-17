SSR.compileTemplate("postDomain",Assets.getText("private/views/posts/modules/post-domain.html"));

var url=Npm.require("url");

Template.postDomain.helpers({
  domain:function(){
    var parsedUrl=url.parse(this.url);
    return parsedUrl.hostname;
  }
});
