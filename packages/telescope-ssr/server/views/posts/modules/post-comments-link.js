SSR.compileTemplate("postCommentsLink",Assets.getText("private/views/posts/modules/post-comments-link.html"));

Template.postCommentsLink.helpers({
  _:function(key){
    return i18n.t(key);
  }
});
