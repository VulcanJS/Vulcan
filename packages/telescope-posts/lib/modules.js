
Telescope.modules.register("postListTop", {
  template: 'postViewsNav',
  order: 99
});

Telescope.modules.register("postComponents", [
  {
    template: 'postRank',
    order: 1
  },
  {
    template: 'postUpvote',
    order: 10
  },
  {
    template: 'postContent',
    order: 20
  },
  {
    template: 'postAvatars',
    order: 30
  },
  {
    template: 'postDiscuss',
    order: 40
  },
  {
    template: 'postActions',
    order: 50
  }
]);

Telescope.modules.register("postHeading", [
  {
    template: 'post_title',
    order: 10
  },
  {
    template: 'postDomain',
    order: 20
  }
]);

Telescope.modules.register("postMeta", [
  {
    template: 'postAuthor',
    order: 10
  },
  {
    template: 'postInfo',
    order: 20
  },
  {
    template: 'postCommentsLink',
    order: 30
  },
  {
    template: 'postAdmin',
    order: 50
  }
]);
