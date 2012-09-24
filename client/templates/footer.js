Template.footer.footer_code = function(){
	return getSetting('footer_code');
}
Template.footer.analytics_code = function(){
	return getSetting('analytics_code');
}
Template.footer.tlkio_channel = function(){
	return getSetting('tlkio_channel');
}
Template.footer.rendered = function(){
	if((mixpanel_id=getSetting("mixpanel_id")) && !window.mixpanel){
		(function (c, a) {
		    window.mixpanel = a;
		    var b, d, h, e;
		    b = c.createElement("script");
		    b.type = "text/javascript";
		    b.async = !0;
		    b.src = ("https:" === c.location.protocol ? "https:" : "http:") + '//cdn.mxpnl.com/libs/mixpanel-2.1.min.js';
		    d = c.getElementsByTagName("script")[0];
		    d.parentNode.insertBefore(b, d);
		    a._i = [];
		    a.init = function (b, c, f) {
		        function d(a, b) {
		            var c = b.split(".");
		            2 == c.length && (a = a[c[0]], b = c[1]);
		            a[b] = function () {
		                a.push([b].concat(Array.prototype.slice.call(arguments, 0)))
		            }
		        }
		        var g = a;
		        "undefined" !== typeof f ? g = a[f] = [] : f = "mixpanel";
		        g.people = g.people || [];
		        h = "disable track track_pageview track_links track_forms register register_once unregister identify name_tag set_config people.identify people.set people.increment".split(" ");
		        for (e = 0; e < h.length; e++) d(g, h[e]);
		        a._i.push([b, c, f])
		    };
		    a.__SV = 1.1
		})(document, window.mixpanel || []);
		mixpanel.init(mixpanel_id);

		if(Meteor.user()){
			var currentUserEmail=getCurrentUserEmail();
			mixpanel.people.identify(currentUserEmail);
			mixpanel.people.set({
			    'username': Meteor.user().username,
			    'createdAt': Meteor.user().createdAt,
			    'email': currentUserEmail
			});
			mixpanel.register({
			    'username': Meteor.user().username,
			    'createdAt': Meteor.user().createdAt,
			    'email': currentUserEmail
			});
		}
	}	
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
		$('body').toggleClass('chat-open');
		$('#tlkio').toggleClass('open');
	}
}