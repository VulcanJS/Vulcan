function toggleVideo(state) {
    // if state == 'hide', hide. Else: show video
    var div = document.getElementsByClassName("embed")[0];
    var iframe = div.getElementsByTagName("iframe")[0].contentWindow;
    div.style.display = state == 'hide' ? 'none' : '';
    func = state == 'hide' ? 'pauseVideo' : 'playVideo';
    iframe.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
}

Template[getTemplate('postDomain')].helpers({
  domain: function(){
    var a = document.createElement('a');
    a.href = this.url;
    if (a.hostname.indexOf('www.') !== -1) {
    	return a.hostname.slice(4);
    } 
    if (a.hostname.indexOf('localhost') !== -1 || a.hostname.indexOf('127.0.0.1') !== -1 ) {
      return false;
    }
    return a.hostname;
  },
  postLink: function(){
    return !!this.url ? getOutgoingUrl(this.url) : "/posts/"+this._id;
  },
  postTarget: function() {
    return !!this.url ? '_blank' : '';
  },
  iframeableLink: function (url) {
    if (url.indexOf('stackoverflow.com') > -1 ) {
      return false;
    }
    return true;
  }
});

Template[getTemplate('postDomain')].events({
    'click .post-read-overlay': function(url){
      var url= this.url;

      if (url.indexOf('youtube.com/watch') > -1 || url.indexOf('youtu.be/i_') > -1) {
        var youtubeVid = url.slice(-11);
        var youtube = '<div class="ui video video-play-overlay" data-source="youtube" data-id="'+youtubeVid+'""></div>'
        $('.basic-post-modal-content').html(youtube);
        $('.ui.video').video();
        $('.ui.basic.modal').modal('show',{
          onHide: toggleVideo('hide'),
          onVisible: toggleVideo('none')
        });
      } else {
        var iframe = '<iframe id="post-modal" src="'+url+'" width="100%" height="100%" scrolling="auto" frameborder="0" seamless></iframe>'
        $('.fullscreen-post-modal-content').html(iframe);
        $('.ui.fullscreen.modal').modal('show');
      }
    }
});

Template[getTemplate('postDomain')].rendered = function () {
  
};


