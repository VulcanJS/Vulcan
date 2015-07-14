Posts.fastRenderRoutes = [
  {
    path: "/",
    view: Settings.get('defaultView', 'top')
  },
  {
    path: "/top/:limit?",
    view: "top"
  },
  {
    path: "/new/:limit?",
    view: "new"
  },
  {
    path: "/best/:limit?",
    view: "best"
  },
  {
    path: "/pending/:limit?",
    view: "pending"
  },
  {
    path: "/scheduled/:limit?",
    view: "scheduled"
  }
];

Posts.fastRenderSubscribe = function (view, params) {
  var subscriptionTerms = {
    view: view,
    limit: params.limit || Settings.get('postsPerPage', 10)
  };
  console.log('////////////// fastrender ////////////////')
  console.log(subscriptionTerms)
  this.subscribe('postsList', subscriptionTerms);
  this.subscribe('postsListUsers', subscriptionTerms);
  console.log('//////////////////////////////////////////')
};

Meteor.startup(function () {
  Posts.fastRenderRoutes.forEach(function (route) {
    FastRender.route(route.path, _.partial(Posts.fastRenderSubscribe, route.view));
  });
});