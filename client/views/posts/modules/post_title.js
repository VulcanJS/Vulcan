Template[getTemplate('postTitle')].helpers({
  postLink: function(){
    return !!this.url ? getOutgoingUrl(this.url) : "/posts/"+this._id;
  },
  postTarget: function() {
    return !!this.url ? '_blank' : '';
  },
  formattedTitle: function() {
    return !!this.title ? this.title : getAuthorName(this);
  }
});