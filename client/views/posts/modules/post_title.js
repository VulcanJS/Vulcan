function getHostName() {
	return window.location.host;
}
function getPathname() {
  return window.location.pathname;
}

Template[getTemplate('postTitle')].helpers({
  postLink: function(){
    return "/posts/"+this._id;
  },
  postTarget: function() {
    return '';
  },
  postPage: function () {
    var pathname = getPathname();
    return pathname.indexOf('/posts/') !== -1;
  }
});

Template[getTemplate('postTitle')].events({
  	'click .post-title': function(url){
      var pathname = getPathname();
      if (pathname.indexOf('/posts/') !== -1) {
        return;
      }
  		var url= 'http://'+getHostName()+'/posts/'+this._id;
  		var iframe = '<iframe id="post-modal" src="'+url+'" width="100%" height="100%" scrolling="auto" frameborder="0" seamless></iframe>'
	    $('.post-modal-content').html(iframe);
	    $('.ui.post.modal')
	  		.modal('show');
  	},
    'click .post-title-list': function(){

    },
    'mouseenter .post-title-list': function(e) {
      $(e.target).parent().parent().find('.post-domain').addClass('ui button');
    },
    'mouseleave .post-title-list': function(e) {
      setTimeout(
        function() 
        {
          $(e.target).parent().parent().find('.post-domain').removeClass('ui button');
        }, 5000);
    }
});

Template[getTemplate('postTitle')].rendered = function () {
  if (! localStorage.noFirstVisit) {
    var pathname = getPathname();
    if (pathname.indexOf('/posts/') === -1) {
      $('.post-title-list').popup({
          inline: true
        });
    }
    localStorage.noFirstVisit = "1";
  }

};

