Template.post.events = {
  'click .discuss-link': function(){
    Session.set('selected_post', this);
    Session.set('state', 'view_post');
  }
};

Template.post.ago = function(){
  var submitted = new Date(this.submitted);
  return submitted.toString();
};
