Template[getTemplate('postTitle')].helpers({
  postLink: function(){
    return "/posts/"+this._id;
  },
  postTarget: function() {
    return '';
  }
});

Template[getTemplate('postTitle')].events({
  	'click .post-title': function(url){
  		var url= 'http://wondercount.com/posts/'+this._id;
  		var iframe = '<iframe id="post-modal" src="'+url+'" width="100%" height="100%" scrolling="auto" frameborder="0" seamless></iframe>'
	    $('.post-modal-content').html(iframe);
	    $('.ui.post.modal')
	  		.modal('show');
  	}
});
