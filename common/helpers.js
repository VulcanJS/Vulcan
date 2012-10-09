t=function(message){
	var d=new Date();
	console.log("### "+message+" rendered at "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
}
nl2br= function(str) {   
var breakTag = '<br />';    
return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}
getSetting = function(setting){
	var settings=Settings.find().fetch()[0];
	if(settings){
		return settings[setting];
	}
	return '';
}
trackEvent = function(event, properties){
	console.log('trackevent: ', event, properties);
	var properties= (typeof properties === 'undefined') ? {} : properties;
	if(typeof mixpanel.track != 'undefined'){
		mixpanel.track(event, properties);
	}
}
getAuthorName = function(item){
	// keep both variables for transition period
	var id=item.userId || item.user_id;
	// if item is linked to a user, get that user's display name. Else, return the author field.
	return (id && (user=Meteor.users.findOne(id))) ? getDisplayName(user) : this.author;
}
scrollPageTo = function(selector){
	$('body').scrollTop($(selector).offset().top);	
}
