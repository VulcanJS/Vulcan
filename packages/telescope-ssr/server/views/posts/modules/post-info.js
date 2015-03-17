SSR.compileTemplate("postInfo",Assets.getText("private/views/posts/modules/post-info.html"));

Template.postInfo.helpers({
  pointsUnitDisplayText: function(){
    return this.upvotes == 1 ? i18n.t("point") : i18n.t("points");
  },
  timeAgo:function(datetime){
    return moment(datetime).fromNow();
  }
});
