Template.item.events = {
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

Template.item.rendered = function(){
  console.log('post rendered');
  if (Meteor.is_client) {     
    if($(window).width()>400){ //do not load social media plugin on mobile
      console.log($('.share-replace'));
      $('.share-replace').sharrre({
        share: {
          googlePlus: true,
          facebook: true,
          twitter: true,
        },
        buttons: {
          googlePlus: {size: 'tall'},
          facebook: {layout: 'box_count'},
          twitter: {count: 'vertical'},
        },
        enableHover: false,
        enableCounter: false,
        enableTracking: true
      });
    }
  }
};

Template.item.rank = function(){
  return 1;
};

Template.item.ago = function(){
  var submitted = new Date(this.submitted);
  var timeAgo=jQuery.timeago(submitted);
  return timeAgo;
};

Template.item.voted = function(){
  var user = Meteor.user();
  if(!user) return false;
  var myvote = MyVotes.findOne({post: this._id, user: user._id});
  return !!myvote;
};

Template.item.domain = function(){
  var a = document.createElement('a');
  a.href = this.url;
  return a.hostname;
};

Template.item.is_my_post = function(){
  if(this.user_id && Meteor.user() && Meteor.user()._id==this.user_id){
    return true;
  }
  return false;
};

Template.item.author = function(){
  if(this.user_id){
    return Meteor.users.findOne(this.user_id).username
  }
};