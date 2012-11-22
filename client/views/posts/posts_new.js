Template.posts_new.posts = function() {
  return newPosts();
};

Template.posts_new.helpers({
  allPostsLoaded: function(){
    return newPosts().length < Session.get('newPageLimit');
  }
});

Template.posts_new.rendered = function(){
    var distanceFromTop = 0;
    $('.post').each(function(){
      distanceFromTop += $(this).height();
    });
    $('body').css('min-height',distanceFromTop+160);
    $('.more-button').css('top', distanceFromTop+"px");
}

Template.posts_new.events({
  'click .more-link': function(e) {
    e.preventDefault();
    Session.set('currentScroll',$('body').scrollTop());
    Session.set('newPageLimit', Session.get('newPageLimit') + NEW_PAGE_PER_PAGE)
  }
});
