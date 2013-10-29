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
    if(author=Meteor.users.findOne(this.userId), {reactive: false})
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
  },
  lastRender: function(){
    return Session.get('postItemLastRender');
  }
});

var recalculatePosition = function ($object) {
  console.log('recalculatePosition for '+$object)
  var positionsArray = $object.data('positionsArray');

  if(typeof positionsArray !== 'undefined'){
    
    var positionsLength = positionsArray.length,
        top = $object.position().top

    // if current position is different from the last position in the array, add current position
    if(top != positionsArray[positionsLength-1]){
      positionsArray.push(top);
      $object.data('positionsArray', positionsArray);
    }

    console.log(positionsArray)

    // delta is the difference between the last two positions in the array
    var delta = positionsArray[positionsLength-2] - positionsArray[positionsLength-1]

    // if new position is different from previous position
    if(delta != 0){

      // console.log('previousPosition: '+previousPosition)
      // console.log('newPosition: '+newPosition)
      // console.log('delta: '+delta)

      // send object back to previous position
      $object.css("top", delta + "px").addClass('animate');

      // then wait a little and animate it to new one
      setTimeout(function() { 
        $object.css("top", "0px")
      }, 1);
    
    }
  }
}

Template.post_item.rendered = function(){
  // when one post re-renders, force all of them to recalculate their position
  $('.post').each(function(index, item){
    recalculatePosition($(item));
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
  'click .post-title': function(e){
    Meteor.call('clickedPost', this, function(error, result){
      if(error)
        console.log(error);
    });
  }
};