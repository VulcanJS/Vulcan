
Telescope.modules.add("postListTop", {
  template: 'postViewsNav',
  order: 99
});

Telescope.modules.add("postComponents", [
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

Telescope.modules.add("postHeading", [
  {
    template: 'post_title',
    order: 10
  },
  {
    template: 'postDomain',
    order: 20
  }
]);

Telescope.modules.add("postMeta", [
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
