Template.post.events = {
  'click .discuss-link': function(){
    this.top_level_comments = Comments.find({post: this._id, parent: null});
    Session.set('selected_post', this);
    Session.set('state', 'view_post');
  }
};

Template.post.ago = function(){
  var submitted = new Date(this.submitted);
  return submitted.toString();
};
