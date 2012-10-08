throwError = function(message, type){
	type = (typeof type === 'undefined') ? 'error': type;
	Errors.insert({message:message, type:type, seen: false, show:true});
	// Session.set("error", message);
}
clearSeenErrors = function(){
	Errors.update({seen:true}, {$set: {show:false}}, {multi:true});
}