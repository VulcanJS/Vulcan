Template.post_avatars.helpers({
  commenters: function () {
    // remove post author ID from commenters to avoid showing author's avatar again
    // limit to 4 commenters in case there's more
    // TODO: show a "..." sign or something
    return _.first(_.without(this.commenters, this.userId), 4);
  }
});