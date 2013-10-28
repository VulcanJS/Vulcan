Template.post_item.created = function () {
  instance = this;
};

Template.post_item.helpers({
  post: function(){
    // note: when the data context is set by the router, it will be "this.post". When set by a parent template it'll be "this"
    return this.post || this;
  },
  postLink: function(){
    return !!this.url ? this.url : "/posts/"+this._id;
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
    var user = Meteor.users.findOne(this.userId);
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
    if(author=Meteor.users.findOne(this.userId))
      return getAvatarUrl(author);
  },
  inactiveClass: function(){
    return (isAdmin(Meteor.user()) && this.inactive) ? "inactive" : "";
  },
  categoryLink: function(){
    return getCategoryUrl(this.slug);
  },
  commentsDisplayText: function(){
    return this.comments == 1 ? 'comment' : 'comments';
  },
  pointsUnitDisplayText: function(){
    return this.votes == 1 ? 'point' : 'points';
  }
});

Template.post_item.rendered = function(){
  // animate post from previous position to new position
  console.log(this)
  var instance = this;
  var $instance = $(instance.firstNode.nextSibling);
  var rank = instance.data.rank; // use jQuery instead of decorating the data object
  // var rank = $instance.index();

  var previousPosition = 0;
  var newPosition = $instance.position().top;

  console.log('-----------------------')
  console.log('headline: '+this.data.headline)
  console.log('new rank: '+(rank+1))
  console.log('newPosition: '+newPosition)

  // if element has a currentPosition (i.e. it's not the first ever render)
  if(previousPosition = instance.currentPosition){
    // calculate difference between old position and new position and send element here
    var delta = previousPosition - newPosition;
    $instance.css("top", delta + "px");
  }

  Meteor.defer(function() {
    instance.currentPosition = newPosition;
    // bring element back to its new original position
    $instance.addClass('animate').css("top",  "0px");
  }); 
};

Template.post_item.events = {
  'click .upvote-link': function(e, instance){
    var post = this;
    e.preventDefault();
      if(!Meteor.user()){
        Router.go('/signin');
        throwError("Please log in first");
      }
      Meteor.call('upvotePost', post._id, function(error, result){
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
  'click .post-title': function(e){
    Meteor.call('clickedPost', this, function(error, result){
      if(error)
        console.log(error);
    });
  }
};