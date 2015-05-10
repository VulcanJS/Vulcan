Template.post_title.helpers({
  postLink: function(){
    return !!this.url ? Posts.getOutgoingUrl(this.url) : "/posts/"+this._id;
  },
  postTarget: function() {
    return !!this.url ? '_blank' : '';
  }
});
