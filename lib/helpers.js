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

addNotification = function(event, properties, userToNotify, userDoingAction){
	console.log('adding new notification for:'+getDisplayName(userToNotify)+', for event:'+event);
	console.log(userToNotify);
	console.log(userDoingAction);
	console.log(properties);
	if(userToNotify._id!=userDoingAction._id){
		// make sure we don't notify people of their own actions
		Meteor.users.update(
			{_id: userToNotify._id},
			{$push: 
				{
					'profile.notifications': {
						timestamp: new Date().getTime(),
						event: event,
						properties: properties,
						read: false
					}
				}
			},
			function(error, result){
				if(error){
					console.log(error);
				}	
			}
		);
	}
}
clearNotifications = function(user){
	Meteor.users.update(
		{_id: user._id},
		{$pull: 
			{
				'profile.notifications': {}
			}
		},
		function(error, result){
			if(error){
				console.log(error);
				console.log(userId);
				console.log(message);
				console.log(link);
			}	
		}
	);	
}

sessionSetObject=function(name, value){
	Session.set(name, JSON.stringify(value));
}

sessionGetObject=function(name){
	return JSON.parse(Session.get(name));
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

// sortJsonArrayByProperty= function(objArray, prop, direction){
// 	// http://stackoverflow.com/questions/4222690/sorting-a-json-object-in-javascript
//     var direct = arguments.length>2 ? arguments[2] : 1; //Default to ascending
//     if (objArray && objArray.constructor===Array){
//         var propPath = (prop.constructor===Array) ? prop : prop.split(".");
//         objArray.sort(function(a,b){
//             for (var p in propPath){
//                 if (a[propPath[p]] && b[propPath[p]]){
//                     a = a[propPath[p]];
//                     b = b[propPath[p]];
//                 }
//             }
//             // convert numeric strings to integers
//             a = a.match(/^\d+$/) ? +a : a;
//             b = b.match(/^\d+$/) ? +b : b;
//             return ( (a < b) ? -1*direct : ((a > b) ? 1*direct : 0) );
//         });
//     }
// }
