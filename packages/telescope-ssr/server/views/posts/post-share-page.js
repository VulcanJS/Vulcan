SSR.compileTemplate("postSharePage",Assets.getText("private/views/posts/post-share-page.html"));

Template.postSharePage.helpers({
  siteTitle:function(){
    return getSetting("title");
  }
});
