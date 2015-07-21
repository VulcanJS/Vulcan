
Telescope.modules.add("postsListTop", {
  template: 'posts_views_nav',
  order: 99
});

Telescope.modules.add("postComponents", [
  {
    template: 'post_rank',
    order: 1
  },
  {
    template: 'post_vote',
    order: 10
  },
  {
    template: 'post_content',
    order: 20
  },
  {
    template: 'post_avatars',
    order: 30
  },
  {
    template: 'post_discuss',
    order: 40
  },
  {
    template: 'post_actions',
    order: 50
  }
]);

Telescope.modules.add("postHeading", [
  {
    template: 'post_title',
    order: 10
  },
  {
    template: 'post_domain',
    order: 20
  }
]);

Telescope.modules.add("postMeta", [
  {
    template: 'post_author',
    order: 10
  },
  {
    template: 'post_info',
    order: 20
  },
  {
    template: 'post_comments_link',
    order: 30
  },
  {
    template: 'post_admin',
    order: 50
  }
]);
