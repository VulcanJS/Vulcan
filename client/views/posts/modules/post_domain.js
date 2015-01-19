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
  }
});