function getHostName() {
	return window.location.host;
}

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
  		var url= 'http://'+getHostName()+'/posts/'+this._id;
  		var iframe = '<iframe id="post-modal" src="'+url+'" width="100%" height="100%" scrolling="auto" frameborder="0" seamless></iframe>'
	    $('.post-modal-content').html(iframe);
	    $('.ui.post.modal')
	  		.modal('show');
  	}
});

 


// Template[getTemplate('postTitle')].events({
//   	'click .post-title': function(url){
//   		var url= 'http://'+getHostName()+'/posts/'+this._id;
//   		var iframe = '<iframe id="post-modal" src="'+url+'" width="100%" height="100%" scrolling="auto" frameborder="0" seamless></iframe>'
// 		var html = ['<div class="ui post modal">',
// 				    '<i class="close icon"></i>',
// 				    iframe,
// 				    '<div class="post-modal-content">',
// 				    '</div>',
// 				  '</div>'].join("");

// 	    $('.modal-overlay').html(html);
// 	    $('.ui.post.modal')
// 	  		.modal('show');
//   	}
// });


