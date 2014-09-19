Template[getTemplate('posts_digest')].created = function(){
  $(document).unbind('keyup'); //remove any potential existing bindings to avoid duplicates
  var currentDate=moment(Session.get('currentDate')).startOf('day');
  var today=moment(new Date()).startOf('daysy');
  $(document).bind('keyup', 'left', function(){
    Router.go($('.prev-link').attr('href'));
  });
  $(document).bind('keyup', 'right', function(){
    if(isAdmin(Meteor.user()) || today.diff(currentDate, 'days') > 0)
      Router.go($('.next-link').attr('href'));      
  });  
};

Template[getTemplate('posts_digest')].helpers({
  post_item: function () {
    return getTemplate('post_item');
  },
  postsListIncoming: function () {
    return getTemplate('postsListIncoming');
  },
  hasPosts: function(){
    if(this.posts) // XXX
      return !!this.posts.count();  
  },
  currentDate: function(){
    var currentDate=moment(Session.get('currentDate'));
    var today=moment(new Date());
    var diff=today.diff(currentDate, 'days');
    if(diff === 0)
      return i18n.t("Today");
    if(diff === 1)
      return i18n.t("Yesterday");
    return currentDate.format("dddd, MMMM Do YYYY");
  },
  previousDateURL: function(){
    var currentDate=moment(Session.get('currentDate'));
    var newDate=currentDate.subtract(1, 'days');
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
    return isAdmin(Meteor.user()) || (today.diff(currentDate, 'days') > 0)
  }
});

Template[getTemplate('posts_digest')].rendered = function(){
  var distanceFromTop = 0;
  $('.post').each(function(){
    distanceFromTop += $(this).height();
  });
  distanceFromTop+=55;
  Session.set('distanceFromTop', distanceFromTop);
  $('body').css('min-height',distanceFromTop+160);
  $('.more-button').css('top', distanceFromTop+"px");  
}

Template[getTemplate('posts_digest')].created = function() {
  Session.set('listPopulatedAt', new Date());
};