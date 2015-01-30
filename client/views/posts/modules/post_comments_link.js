function getHostName() {
	return window.location.host;
}
function getPathname() {
	return window.location.pathname;
}
Template[getTemplate('postCommentsLink')].helpers({
	hasComment: function (count) {
		// console.log(count.hash.count);
		return this.commentCount > 0;
	},
	singleComment: function () {
		return this.commentCount === 1;
	},
	postPage: function () {
		var pathname = getPathname();
		return pathname.indexOf('/posts/') !== -1;
	}
});

Template[getTemplate('postCommentsLink')].events({
	'click .comments-link': function () {
		var pathname = getPathname();
		if (pathname.indexOf('/posts/') !== -1) {
			return;
		}
  		var url= 'http://'+getHostName()+'/posts/'+this._id;
  		var iframe = '<iframe id="post-modal" src="'+url+'" max-width="991px" height="100%" scrolling="auto" frameborder="0" seamless></iframe>'
	    $('.standard-post-modal-content').html(iframe);
	    $('.ui.post.modal')
	  		.modal('show');
  	}
});