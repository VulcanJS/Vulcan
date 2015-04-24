
Telescope.modules.register("profileDisplay", [
  {
    template: 'userInfo',
    order: 1
  },
  {
    template: 'userPosts',
    order: 2
  },
  {
    template: 'userUpvotedPosts',
    order: 3
  },
  {
    template: 'userDownvotedPosts',
    order: 5
  },
  {
    template: 'userComments',
    order: 5
  }
]);

Telescope.modules.register("profileEdit", [
  {
    template: 'userAccount',
    order: 1
  }
]);