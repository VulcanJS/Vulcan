Template.posts_digest.helpers({
  posts: function(){
    return postsForSub.digestPosts();
  },
  hasPosts: function(){
    return !!postsForSub.digestPosts().length;
  },
  currentDate: function(){
    return moment(Session.get('currentDate')).format("dddd, MMMM Do YYYY");
  },
  previousDateURL: function(){
    var currentDate=moment(Session.get('currentDate'));
    var newDate=currentDate.subtract('days', 1);
    return getDigestURL(newDate);
  },
  showPreviousDate: function(){
    // TODO
    return true;
  },
  nextDateURL: function(){
    var currentDate=moment(Session.get('currentDate'));
    var newDate=currentDate.add('days', 1);
    return getDigestURL(newDate);
  },
  showNextDate: function(){
    var currentDate=moment(Session.get('currentDate')).startOf('day');
    var today=moment(new Date()).startOf('day');
    return today.diff(currentDate, 'days') > 0
  }
});

Template.posts_digest.created = function(){
  var currentDate=moment(Session.get('currentDate')).startOf('day');
  var today=moment(new Date()).startOf('day');
  $(document).bind('keydown', 'left', function(){
    Meteor.Router.to(getDigestURL(currentDate.subtract('days', 1)));
  });
  $(document).bind('keydown', 'right', function(){
    if(today.diff(currentDate, 'days') > 0)
      Meteor.Router.to(getDigestURL(currentDate.add('days', 1)));      
  });  
};