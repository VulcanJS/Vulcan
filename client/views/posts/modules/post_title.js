Template[getTemplate('postTitle')].helpers({
  postLink: function(){
    return "/posts/"+this._id;
  },
  postTarget: function() {
    return '';
  }
});