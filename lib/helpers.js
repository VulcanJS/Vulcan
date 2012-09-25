t=function(message){
	var d=new Date();
	console.log("### "+message+" rendered at "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
}

nl2br= function(str) {   
var breakTag = '<br />';    
return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

currentUserIsAdmin = function(){
	return Session.get('currentUserIsAdmin');
}

getSetting = function(setting){
	var settings=Settings.find().fetch()[0];
	if(settings){
		return settings[setting];
	}
	return '';
}

getCurrentUserEmail = function(){
	return Meteor.user() ? Meteor.user().emails[0].email : '';
}

trackEvent = function(event, properties){
	var properties= (typeof properties === 'undefined') ? {} : properties;
	if(typeof mixpanel != 'undefined'){
		mixpanel.track(event, properties);
	}
}

sessionSetObject=function(name, value){
	Session.set(name, JSON.stringify(value));
}

sessionGetObject=function(name){
	return JSON.parse(Session.get(name));
}