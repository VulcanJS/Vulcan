Posts.getRoute = function () {
  FlowRouter.watchPathChange()
  var viewName = this.name;
  var currentQuery = _.clone(FlowRouter.current().queryParams);
  var newQuery = _.extend(currentQuery, {view: viewName});
  return FlowRouter.path("postsDefault", FlowRouter.current().params, newQuery);
};

// array containing items in the views menu
Telescope.menuItems.add("viewsMenu", [
  {
    route: Posts.getRoute,
    name: 'top',
    label: function (){ return i18n.t('top'); },
    description: 'most_popular_posts'
  },
  {
    route: Posts.getRoute,
    name: 'new',
    label: function (){ return i18n.t('new'); },
    description: 'newest_posts'
  },
  {
    route: Posts.getRoute,
    name: 'best',
    label: function (){ return i18n.t('best'); },
    description: 'highest_ranked_posts_ever'
  },
  {
    route: Posts.getRoute,
    name: 'pending',
    label: function (){ return i18n.t('pending'); },
    description: 'posts_awaiting_moderation',
    adminOnly: true
  },
  {
    route: Posts.getRoute,
    name: 'rejected',
    label: function (){ return i18n.t('rejected'); },
    description: 'rejected_posts',
    adminOnly: true
  },
  {
    route: Posts.getRoute,
    name: 'scheduled',
    label: function (){ return i18n.t('scheduled'); },
    description: 'future_scheduled_posts',
    adminOnly: true
  },
]);