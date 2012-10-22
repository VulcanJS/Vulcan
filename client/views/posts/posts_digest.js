Template.posts_digest.helpers({
  posts: function(){
    return digestPosts();
  },
  hasPosts: function(){
    return !!digestPosts().length;
  },
  currentDate: function(){
    return moment(sessionGetObject('currentDate')).format("dddd, MMMM Do YYYY");
  },
  previousDateURL: function(){
    var currentDate=moment(sessionGetObject('currentDate'));
    var newDate=currentDate.subtract('days', 1);
    return getDigestURL(newDate);
  },
  showPreviousDate: function(){
    // TODO
    return true;
  },
  nextDateURL: function(){
    var currentDate=moment(sessionGetObject('currentDate'));
    var newDate=currentDate.add('days', 1);
    return getDigestURL(newDate);
  },
  showNextDate: function(){
    var currentDate=moment(sessionGetObject('currentDate'));
    var nextDate=currentDate.add('days', 1); 
    var today=moment(new Date());
    return today.diff(nextDate, 'days') > 0
  }
});

Template.posts_digest.rendered = function(){
  var currentDate=moment(sessionGetObject('currentDate'));
  $(document).bind('keydown', 'left', function(){
    Router.navigate(getDigestURL(currentDate.subtract('days', 1)), {trigger: true});    
  });
  $(document).bind('keydown', 'right', function(){
    Router.navigate(getDigestURL(currentDate.add('days', 1)), {trigger: true});      
  });  
};