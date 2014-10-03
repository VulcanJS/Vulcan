Template[getTemplate('postTitle')].helpers({
  postLink: function(){
    if (!!this.url) {
      return getOutgoingUrl(this.url);
    } else {
      return getPostPageUrl(this);
    }
  },
  postTarget: function() {
    return !!this.url ? '_blank' : '';
  }
});