Meteor.startup(function () {

  Router.map(function() {

    this.route('posts_recently_commented', {
      path: '/recently-commented',
      controller: PostsListController
    });

  });

});

viewNav.push(
  {
    route: 'posts_recently_commented',
    label: 'Recently Commented'
  }  
);