Template.post_item.created = function () {
  instance = this;
};

Template.post_item.helpers({
  post: function(){
    // note: when the data context is set by the router, it will be "this.post". When set by a parent template it'll be "this"
    return this.post || this;
  },
  postLink: function(){
    return !!this.url ? getOutgoingUrl(this.url) : "/posts/"+this._id;
  },
  postTarget: function() {
    return !!this.url ? '_blank' : '';
  },
  oneBasedRank: function(){
    if(typeof this.rank != 'undefined')
      return this.rank + 1;
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
  body_formatted: function(){
    var converter = new Markdown.Converter();
    var html_body=converter.makeHtml(this.body);
    return html_body.autoLink();
  },
  ago: function(){
    // if post is approved show submission time, else show creation time. 
    time = this.status == STATUS_APPROVED ? this.submitted : this.createdAt;
    return moment(time).fromNow();
  },
  timestamp: function(){
    time = this.status == STATUS_APPROVED ? this.submitted : this.createdAt;
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
    return this.votes == 1 ? i18n.t('point') : i18n.t('points');
  },
  isApproved: function(){
    return this.status == STATUS_APPROVED;
  }
});

var recalculatePosition = function ($object, pArray) {
  // delta is the difference between the last two positions in the array
  var delta = pArray[pArray.length-2] - pArray[pArray.length-1];

  // if new position is different from previous position
  if(delta != 0){
    // send object back to previous position
    $object.removeClass('animate').css("top", delta + "px");
    // then wait a little and animate it to new one
    setTimeout(function() { 
      $object.addClass('animate').css("top", "0px")
    }, 1);  
  }
}

Template.post_item.rendered = function(){
  // var instance = this,
  //     $instance = $(instance.firstNode.nextSibling),
  //     top = $instance.position().top;

  // // if this is the first render, initialize array, else push current position
  // if(typeof instance.pArray === 'undefined'){
  //   instance.pArray = [top]
  // }else{
  //   instance.pArray.push(top);
  // }

  // // if this is *not* the first render, recalculate positions
  // if(instance.pArray.length>1)
  //   recalculatePosition($instance, instance.pArray);

};

Template.post_item.events({
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
  'click .share-link': function(e){
    var $this = $(e.target).parents('.post-share').find('.share-link');
    var $share = $this.parents('.post-share').find('.share-options');
    e.preventDefault();
    $('.share-link').not($this).removeClass("active");
    $(".share-options").not($share).addClass("hidden");
    $this.toggleClass("active");
    $share.toggleClass("hidden");
    $share.find('.share-replace').sharrre(SharrreOptions);
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