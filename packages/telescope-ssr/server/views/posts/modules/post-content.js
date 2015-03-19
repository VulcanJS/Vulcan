SSR.compileTemplate("postContent",Assets.getText("private/views/posts/modules/post-content.html"));

Template.postContent.helpers({
  postLink:function(){
    return this.url ? getOutgoingUrl(this.url) : Router.routes.post_page.url(this);
  }
});
