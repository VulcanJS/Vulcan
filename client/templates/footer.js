Template.footer.analytics_code = function(){
	return getSetting('analytics_code');
}
Template.footer.tlkio_channel = function(){
	return getSetting('tlkio_channel');
}
Template.footer.rendered = function(){
	console.log(document.getElementById('tlkio'));

}
Template.footer.events = {
	'click .open-chat': function(e){
		e.preventDefault();
		if(!window.chat_loaded){
			if(getSetting('tlkio_channel')){
			    var target_element  = document.getElementById('tlkio'),
			        channel_name    = target_element.getAttribute('data-channel'),
			        custom_css_path = target_element.getAttribute('data-theme'),
			        iframe          = document.createElement('iframe');

			    var iframe_src = 'http://embed.tlk.io/' + channel_name;

			    if (custom_css_path && custom_css_path.length > 0) {
			      iframe_src += ('?custom_css_path=' + custom_css_path);
			    }

			    iframe.setAttribute('src', iframe_src);
			    iframe.setAttribute('width', '100%');
			    iframe.setAttribute('height', '100%');
			    iframe.setAttribute('frameborder', '0');

			    target_element.appendChild(iframe);
		    }
		    window.chat_loaded=true;
		}
		$('#tlkio').toggleClass('open');
	}
}