// array containing items in the views menu
Telescope.menuItems.add("viewsMenu", [
  {
    route: 'posts_top',
    label: 'top',
    description: 'most_popular_posts'
  },
  {
    route: 'posts_new',
    label: 'new',
    description: 'newest_posts'
  },
  {
    route: 'posts_best',
    label: 'best',
    description: 'highest_ranked_posts_ever'
  },
  {
    route: 'posts_pending',
    label: 'pending',
    description: 'posts_awaiting_moderation',
    adminOnly: true
  },
  {
    route: 'posts_scheduled',
    label: 'scheduled',
    description: 'future_scheduled_posts',
    adminOnly: true
  },
]);