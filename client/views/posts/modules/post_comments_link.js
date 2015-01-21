Template[getTemplate('postCommentsLink')].events({
	'click .comments-link': function () {
  		var url= 'http://localhost:3000/posts/'+this._id;
  		var iframe = '<iframe id="post-modal" src="'+url+'" width="100%" height="100%" scrolling="auto" frameborder="0" seamless></iframe>'
	    $('.post-modal-content').html(iframe);
	    $('.ui.post.modal')
	  		.modal('show');
  	}
});