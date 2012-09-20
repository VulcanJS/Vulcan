Template.footer.analytics_code = function(){
	var setting=Settings.find().fetch()[0];
	if(setting){
		return setting.analytics_code;
	}
}