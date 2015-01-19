Template[getTemplate('poll_avatars')].helpers({
  pollVoters: function () {
    // remove post author ID from commenters to avoid showing author's avatar again
    // limit to 4 commenters in case there's more
    // TODO: show a "..." sign or something
    return _.first(this.data.voters, 5);
  }
});