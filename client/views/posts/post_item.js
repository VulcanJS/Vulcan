Template.post_item.preserve({
  '.post': function (node) {return node.id; }
});


Template.post_item.helpers({
  rank: function() {
    return this._rank + 1;
  },
  isPostPage: function(){
    return Router.current_page() === 'post_page'
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
    if(Meteor.user() && (Meteor.user().isAdmin || Meteor.userId() === this.userId))
      return true;
    else
      return false;
  },
  authorName: function(){
    return getAuthorName(this);
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
    return moment(this.submitted).fromNow();
  },
  timestamp: function(){
    return moment(this.submitted).format("MMMM Do, h:mm:ss a");
  },
  voted: function(){
    var user = Meteor.user();
    if(!user) return false; 
    return _.include(this.upvoters, user._id);
  },
});

Template.post_item.created = function(){
  if(this.data){
    this.current_distance = this.data._rank * 81;
  }
}

Template.post_item.rendered = function(){
  var self = this;
  var rank = self.data._rank;
  var $this = $(this.find(".post"));

  if(self.data){
    var distanceFromTop= 0;
    for(var i=1; i<=rank; i++){
      distanceFromTop+= $('.post-'+i).height();
    }
    var new_distance = distanceFromTop ;
    var old_distance = self.current_distance ;
    
    // at rendering time, move posts to their old place
    $this.css("top", old_distance+"px");
    
    // then a few milliseconds after, move the to their new spot
    Meteor.setTimeout(function() {
      $this.css("top", new_distance+"px");
      
      // we don't want elements to be animated the first ever time they load, so we only set the class "animate" after that
      self.current_distance=new_distance;
    }, 1);

    Meteor.setTimeout(function(){
      $this.addClass("animate");
    }, 2);
    
  }
};

Template.post_item.events = {
  'click .upvote-link': function(e, instance){
    e.preventDefault();
      if(!Meteor.user()){
        throwError("Please log in first");
        return false;
      }
      Meteor.call('upvotePost', this._id, function(error, result){
        trackEvent("post upvoted", {'postId': instance.postId});
      });
  }

  , 'click .share-link': function(e){
      var $this = $(e.target);
      e.preventDefault();
      $(".share-link").not($this).next().addClass("hidden");
      $this.next().toggleClass("hidden");
      console.log($this);
      $this.next().find('.share-replace').sharrre(SharrreOptions);
      // $(".overlay").toggleClass("hidden");
  }
};