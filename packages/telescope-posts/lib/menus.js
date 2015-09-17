Posts.getRoute = function () {
  FlowRouter.watchPathChange()
  var viewName = this.label;
  var currentQuery = _.clone(FlowRouter.current().queryParams);
  var newQuery = _.extend(currentQuery, {view: viewName});
  return FlowRouter.path("postsDefault", FlowRouter.current().params, newQuery);
};

// array containing items in the views menu
Telescope.menuItems.add("viewsMenu", [
  {
    route: Posts.getRoute,
    label: 'top',
    description: 'most_popular_posts'
  },
  {
    route: Posts.getRoute,
    label: 'new',
    description: 'newest_posts'
  },
  {
    route: Posts.getRoute,
    label: 'best',
    description: 'highest_ranked_posts_ever'
  },
  {
    route: Posts.getRoute,
    label: 'pending',
    description: 'posts_awaiting_moderation',
    adminOnly: true
  },
  {
    route: Posts.getRoute,
    label: 'rejected',
    description: 'rejected_posts',
    adminOnly: true
  },
  {
    route: Posts.getRoute,
    label: 'scheduled',
    description: 'future_scheduled_posts',
    adminOnly: true
  },
]);