Template.posts_digest.helpers({
  hasPosts: function(){
    return !!this.posts.count();  
  },
  currentDate: function(){
    var currentDate=moment(Session.get('currentDate'));
    var today=moment(new Date());
    var diff=today.diff(currentDate, 'days');
    if(diff === 1)
      return i18n.t("Today");
    if(diff === 2)
      return i18n.t("Yesterday");
    return currentDate.format("dddd, MMMM Do YYYY");
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
    return isAdmin(Meteor.user()) || (today.diff(currentDate, 'days') > 0)
  }
});

Template.posts_digest.created = function(){
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

Template.posts_digest.rendered = function(){
  var distanceFromTop = 0;
  $('.post').each(function(){
    distanceFromTop += $(this).height();
  });
  distanceFromTop+=55;
  Session.set('distanceFromTop', distanceFromTop);
  $('body').css('min-height',distanceFromTop+160);
  $('.more-button').css('top', distanceFromTop+"px");  
}
