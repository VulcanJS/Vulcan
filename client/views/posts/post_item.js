var post = {};

Template[getTemplate('post_item')].created = function () {
  post = this.data;
};

Template[getTemplate('post_item')].helpers({
  postModules: function () {
    // sort by position using modulePositions as index
    return _.sortBy(postModules, function(module){return _.indexOf(modulePositions, module.position)});
  },
  templateClass: function () {
    return camelToDash(this.template);
  },
  templateContext: function () {
    // extend post object with post module position and pass it as the module's context
    var context = _.extend(post, {position: this.position});
    return context;
  },
  log: function(a){
    console.log(a);
  },
  postLink: function(){
    return !!this.url ? getOutgoingUrl(this.url) : "/posts/"+this._id;
  },
  sourceLink: function(){
    return !!this.url ? this.url : "/posts/"+this._id;
  },
  postTarget: function() {
    return !!this.url ? '_blank' : '';
  },
  rankClass: function(){
    if(typeof this.rank !== 'undefined')
      return "has-rank post-"+(this.rank + 1);
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
  voted: function(){
    var user = Meteor.user();
    if(!user) return false; 
    return _.include(this.upvoters, user._id);
  },
  userAvatar: function(){
    var author = Meteor.users.findOne(this.userId, {reactive: false});
    if(!!author)
      return getAvatarUrl(author);
  },
  inactiveClass: function(){
    return (isAdmin(Meteor.user()) && this.inactive) ? i18n.t('inactive') : "";
  },
  categoryLink: function(){
    return getCategoryUrl(this.slug);
  },
  commentsDisplayText: function(){
    return this.comments == 1 ? i18n.t('comment') : i18n.t('comments');
  },
  pointsUnitDisplayText: function(){
    return this.upvotes == 1 ? i18n.t('point') : i18n.t('points');
  },
  isApproved: function(){
    return this.status == STATUS_APPROVED;
  },
  viaTwitter: function () {
    return !!getSetting('twitterAccount') ? 'via='+getSetting('twitterAccount') : '';
  }
});

Template[getTemplate('post_item')].events({
  'click .upvote-link': function(e, instance){
    var post = this;
    e.preventDefault();
    if(!Meteor.user()){
      Router.go('/signin');
      throwError(i18n.t("Please log in first"));
    }
    Meteor.call('upvotePost', post, function(error, result){
      trackEvent("post upvoted", {'_id': post._id});
    });
  },
  'click .approve-link': function(e, instance){
    Meteor.call('approvePost', this);
    e.preventDefault();
  },  
  'click .unapprove-link': function(e, instance){
    Meteor.call('unapprovePost', this);
    e.preventDefault();
  }
});