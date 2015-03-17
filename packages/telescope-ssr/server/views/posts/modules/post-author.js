SSR.compileTemplate("postAuthor",Assets.getText("private/views/posts/modules/post-author.html"));

Template.postAuthor.helpers({
  profileUrl:function(userId){
    return getProfileUrlBySlugOrId(userId);
  },
  displayName:function(userId){
    return getDisplayNameById(userId);
  }
});
