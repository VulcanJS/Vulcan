Template.comment.events = {
  'click .comment-reply': function(event){
    event.preventDefault();
    Session.set('selected_comment', this);
    Session.set('state', 'reply');
  }
};

Template.comment.ago = function(){
  var submitted = new Date(this.submitted);
  return submitted.toString();
};
