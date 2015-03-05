Template[getTemplate('postContent')].helpers({
  postThumbnail: function () {
    return postThumbnail;
  },
  postHeading: function () {
    return postHeading;
  },
  postMeta: function () {
    return postMeta;
  },
  getTemplate: function () {
    return getTemplate(this.template);
  },
  sourceLink: function(){
    return !!this.url ? this.url : "/posts/"+this._id;
  },
  current_domain: function(){
    return "http://"+document.domain;
  },
  timestamp: function(){
    time = this.status == STATUS_APPROVED ? this.postedAt : this.createdAt;
    return moment(time).format("MMMM Do, h:mm:ss a");
  },
  userAvatar: function(){
    // THIS FUNCTION IS DEPRECATED -- package bengott:avatar is used instead.
    var author = Meteor.users.findOne(this.userId, {reactive: false});
    if(!!author)
      return getAvatarUrl(author); // ALSO DEPRECATED
  },
  inactiveClass: function(){
    return (isAdmin(Meteor.user()) && this.inactive) ? i18n.t('inactive') : "";
  },
  commentsDisplayText: function(){
    return this.comments == 1 ? i18n.t('comment') : i18n.t('comments');
  }
});