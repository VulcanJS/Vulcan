Template.posts_top.topPostsHandle = function() { 
  return topPostsHandle;
}
Template.posts_new.newPostsHandle = function() { 
  return newPostsHandle;
}
Template.posts_best.bestPostsHandle = function() { 
  return bestPostsHandle;
}
Template.posts_pending.pendingPostsHandle = function() { 
  return pendingPostsHandle;
}

Template.posts_digest.helpers({
  digestHandle: function(){
    return digestHandle;
  },
  hasPosts: function(){
    var handle = digestHandle
    return handle && handle.ready();
  },
  currentDate: function(){
    var currentDate=moment(Session.get('currentDate'));
    var today=moment(new Date());
    var diff=today.diff(currentDate, 'days');
    if(diff === 1)
      return "Today";
    if(diff === 2)
      return "Yesterday";
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
  var today=moment(new Date()).startOf('day');
  $(document).bind('keyup', 'left', function(){
    Meteor.Router.to($('.prev-link').attr('href'));
  });
  $(document).bind('keyup', 'right', function(){
    if(isAdmin(Meteor.user()) || today.diff(currentDate, 'days') > 0)
      Meteor.Router.to($('.next-link').attr('href'));      
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

Template.posts_list.helpers({
  posts: function() {
    return this.fetch();
  },
  postsReady: function() {
    console.log('checking postsReady', this.ready(), this);
    return this.ready();
  },
  allPostsLoaded: function(){
    allPostsLoaded = this.fetch().length < this.loaded();
    Session.set('allPostsLoaded', allPostsLoaded);
    return allPostsLoaded;  
  }
});

Template.posts_list.rendered = function(){
  var distanceFromTop = 0;
  $('.post').each(function(){
    distanceFromTop += $(this).height();
  });
  Session.set('distanceFromTop', distanceFromTop);
  $('body').css('min-height',distanceFromTop+160);
}

Template.posts_list.events({
  'click .more-link': function(e) {
    e.preventDefault();
    Session.set('currentScroll',$('body').scrollTop());
    this.loadNextPage();
  }
});

