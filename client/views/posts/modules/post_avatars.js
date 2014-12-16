Template[getTemplate('postAvatars')].helpers({
  commenters: function () {
    // remove post author ID from commenters to avoid showing author's avatar again
    return _.without(this.commenters, this.userId);
  }
});