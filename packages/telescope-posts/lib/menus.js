Posts.getRoute = function () {
  FlowRouter.watchPathChange()
  var viewName = this.name;
  var currentQuery = _.clone(FlowRouter.current().queryParams);
  var newQuery = _.extend(currentQuery, {view: viewName});
  return FlowRouter.path("postsDefault", FlowRouter.current().params, newQuery);
};

// array containing items in the views menu
var viewsMenuItems = [
  {
    route: Posts.getRoute,
    name: 'top',
    description: 'most_popular_posts'
  },
  {
    route: Posts.getRoute,
    name: 'new',
    description: 'newest_posts'
  },
  {
    route: Posts.getRoute,
    name: 'best',
    description: 'highest_ranked_posts_ever'
  },
  {
    route: Posts.getRoute,
    name: 'pending',
    description: 'posts_awaiting_moderation',
    adminOnly: true
  },
  {
    route: Posts.getRoute,
    name: 'rejected',
    description: 'rejected_posts',
    adminOnly: true
  },
  {
    route: Posts.getRoute,
    name: 'scheduled',
    description: 'future_scheduled_posts',
    adminOnly: true
  },
];

// add label & description i18n functions
viewsMenuItems = viewsMenuItems.map(function (item) {
  item.label = _.partial(i18n.t, item.name);
  item.description = _.partial(i18n.t, item.description);
  return item;
});

Telescope.menuItems.add("viewsMenu", viewsMenuItems);