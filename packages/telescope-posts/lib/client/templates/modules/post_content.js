Template.post_content.helpers({
  sourceLink: function(){
    return !!this.url ? this.url : "/posts/"+this._id;
  },
  current_domain: function(){
    return "http://"+document.domain;
  },
  timestamp: function(){
    var time = this.status === Posts.config.STATUS_APPROVED ? this.postedAt : this.createdAt;
    return moment(time).format("MMMM Do, h:mm:ss a");
  },
  inactiveClass: function(){
    return (Users.is.admin(Meteor.user()) && this.inactive) ? i18n.t('inactive') : "";
  },
  commentsDisplayText: function(){
    return this.comments === 1 ? i18n.t('comment') : i18n.t('comments');
  }
});
