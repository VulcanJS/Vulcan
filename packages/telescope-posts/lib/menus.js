Posts.getRoute = function () {
  FlowRouter.watchPathChange()
  var viewName = this.name;
  var currentQuery = _.clone(FlowRouter.current().queryParams);
  var defaultView = Settings.get("defaultView", "top");
  var newQuery;

  if (viewName === defaultView) {
    // for the default view, just remove the "view" parameter altogether
    delete currentQuery.view;
    newQuery = currentQuery;
  } else {
    newQuery = _.extend(currentQuery, {view: viewName});
  }
  
  return FlowRouter.path("postsDefault", FlowRouter.current().params, newQuery);
};

// array containing items in the views menu
var viewsMenuItems = [
  {
    route: Posts.getRoute,
    name: 'top',
    label: 'top',
    description: 'most_popular_posts'
  },
  {
    route: Posts.getRoute,
    name: 'new',
    label: 'new',
    description: 'newest_posts'
  },
  {
    route: Posts.getRoute,
    name: 'best',
    label: 'best',
    description: 'highest_ranked_posts_ever'
  },
  {
    route: Posts.getRoute,
    name: 'pending',
    label: 'pending',
    description: 'posts_awaiting_moderation',
    adminOnly: true
  },
  {
    route: Posts.getRoute,
    name: 'rejected',
    label: 'rejected',
    description: 'rejected_posts',
    adminOnly: true
  },
  {
    route: Posts.getRoute,
    name: 'scheduled',
    label: 'scheduled',
    description: 'future_scheduled_posts',
    adminOnly: true
  },
];

Telescope.menuItems.add("viewsMenu", viewsMenuItems);