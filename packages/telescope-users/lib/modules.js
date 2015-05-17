
Telescope.modules.add("profileDisplay", [
  {
    template: 'user_info',
    order: 1
  },
  {
    template: 'user_posts',
    order: 2
  },
  {
    template: 'user_upvoted_posts',
    order: 3
  },
  {
    template: 'user_downvoted_posts',
    order: 5
  },
  {
    template: 'user_comments',
    order: 5
  }
]);

Telescope.modules.add("profileEdit", [
  {
    template: 'user_account',
    order: 1
  }
]);