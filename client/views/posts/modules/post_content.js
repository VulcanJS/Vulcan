Template[getTemplate('postContent')].helpers({
  postLink: function(){
    return !!this.url ? getOutgoingUrl(this.url) : "/posts/"+this._id;
  },
  sourceLink: function(){
    return !!this.url ? this.url : "/posts/"+this._id;
  },
  postTarget: function() {
    return !!this.url ? '_blank' : '';
  },
  domain: function(){
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
  current_domain: function(){
    return "http://"+document.domain;
  },
  can_edit: function(){
    return canEdit(Meteor.user(), this);
  },
  authorName: function(){
    return getAuthorName(this);
  },
  profileUrl: function(){
    // note: we don't want the post to be re-rendered every time user properties change
    var user = Meteor.users.findOne(this.userId, {reactive: false});
    if(user)
      return getProfileUrl(user);
  },
  short_score: function(){
    return Math.floor(this.score*1000)/1000;
  },
  ago: function(){
    // if post is approved show submission time, else show creation time. 
    time = this.status == STATUS_APPROVED ? this.postedAt : this.createdAt;
    return moment(time).fromNow();
  },
  timestamp: function(){
    time = this.status == STATUS_APPROVED ? this.postedAt : this.createdAt;
    return moment(time).format("MMMM Do, h:mm:ss a");
  },
  userAvatar: function(){
    var author = Meteor.users.findOne(this.userId, {reactive: false});
    if(!!author)
      return getAvatarUrl(author);
  },
  inactiveClass: function(){
    return (isAdmin(Meteor.user()) && this.inactive) ? i18n.t('inactive') : "";
  },
  commentsDisplayText: function(){
    return this.comments == 1 ? i18n.t('comment') : i18n.t('comments');
  },
  pointsUnitDisplayText: function(){
    return this.upvotes == 1 ? i18n.t('point') : i18n.t('points');
  },
  postsMustBeApproved: function () {
    return !!getSetting('requirePostsApproval');
  },
  isApproved: function(){
    return this.status == STATUS_APPROVED;
  },
  viaTwitter: function () {
    return !!getSetting('twitterAccount') ? 'via='+getSetting('twitterAccount') : '';
  }
});

Template[getTemplate('postContent')].events({
  'click .approve-link': function(e, instance){
    Meteor.call('approvePost', this);
    e.preventDefault();
  },  
  'click .unapprove-link': function(e, instance){
    Meteor.call('unapprovePost', this);
    e.preventDefault();
  }
});