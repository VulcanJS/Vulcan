Template.posts_digest.helpers({
  posts: function(){
    return digestPosts();
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