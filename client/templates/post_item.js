Template.post_item.events = {
    'click .go-to-comments': function(e){
      e.preventDefault();
      // Session.set('selected_post', this);
      Session.set('state', 'view_post');
      Router.navigate('posts/'+this._id, {trigger: true});
  }

  , 'click .upvote-link': function(){
      Meteor.call('voteForPost', this);
  }

  , 'click .share-link': function(e){
      var $this = $(e.target);
      e.preventDefault();
      $(".share-link").not($this).next().addClass("hidden");
      $this.next().toggleClass("hidden");
      // $(".overlay").toggleClass("hidden");
  }
};


Template.post_item.created = function(){
  if(this.data){
    this.current_distance = (getRank(this.data)-1) * 80;
  }
}

Template.post_item.rendered = function(){
  if(this.data){
    var new_distance=(getRank(this.data)-1)*80;
    var old_distance=this.current_distance;
    var $this=$(this.find(".post"));

    // console.log("rendered: ", this.data.headline, "| old distance: "+old_distance, "| new distance: "+new_distance);

    // at rendering time, move posts to their old place
    $this.css("top", old_distance+"px");
    setTimeout(function() {
      // then a few milliseconds after, move the to their new spot
      $this.css("top", new_distance+"px");
      // we don't want elements to be animated the first ever time they load, so we only set the class "animate" after that
      $this.addClass("animate");
    }, 100);
  }

  if (Meteor.is_client) {     
    if($(window).width()>400){ //do not load social media plugin on mobile
    //   $('.share-replace').sharrre({
    //     share: {
    //       googlePlus: true,
    //       facebook: true,
    //       twitter: true,
    //     },
    //     buttons: {
    //       googlePlus: {size: 'tall'},
    //       facebook: {layout: 'box_count'},
    //       twitter: {count: 'vertical'},
    //     },
    //     enableHover: false,
    //     enableCounter: false,
    //     enableTracking: true
    //   });
    }
  }
};

Template.post_item.preserve({
  '.post': function (node) {console.log("preserving node: ",node); return node.id; }
});

Template.post_item.ago = function(){
    console.log("this::::: ",this);

  var submitted = new Date(this.submitted);
  var timeAgo=jQuery.timeago(submitted);
  return timeAgo;
};

Template.post_item.voted = function(){
  var user = Meteor.user();
  if(!user) return false;
  
  return _.include(this.voters, user._id);
};

var getRank = function(post){
  var filter = {$or: [
    {score: {$gt: post.score}},
    {$and: [{score: post.score}, {submitted: {$lt: post.submitted}}]}
  ]};
  return Posts.find(filter).count()+1;  
}

Template.post_item.rank = function() {
  return getRank(this);
}

Template.post_item.top_distanceXX = function(){
  return (getRank(this)-1) * 80;
}

Template.post_item.domain = function(){
  var a = document.createElement('a');
  a.href = this.url;
  return a.hostname;
};

Template.post_item.is_my_post = function(){
  if(this.user_id && Meteor.user() && Meteor.user()._id==this.user_id){
    return true;
  }
  return false;
};

Template.post_item.author = function(){
  if(this.user_id && Meteor.users.findOne(this.user_id)){
    return Meteor.users.findOne(this.user_id).username
  }
};

Template.post_item.short_score = function(){
  return Math.floor(this.score*1000)/1000;
}

Template.post_item.body_formatted = function(){
  var converter = new Markdown.Converter();
  var html_body=converter.makeHtml(this.body);
  return html_body.autoLink();
}