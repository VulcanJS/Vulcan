// note: this is some horrible code, I know

var settingsForm;

Template.settings.generate_settings_form = function (setting) {
	Meteor.defer(function() {
		settingsForm = new ModelForm();
		settingsForm.generateFor(setting, '#json-form');
	})	
}

Template.settings.events = {
	'click input[type=submit]': function(e){
		e.preventDefault();
		if(!Meteor.user()) throw 'You must be logged in.';

		settingsForm.submit(
			function(){
			   	throwError("Settings have been created");
			},
			function(error) {
				if(error) console.log(error);
			      	throwError("Settings have been updated");
			}
		);
	}
};

Template.settings.no_settings = function(){
	if (Settings.findOne()) {
		return false;
	}
	return true;
}

Template.settings.setting = function(){
	var setting = Settings.find().fetch()[0];
	return new Setting(setting) || new Setting();
};

Template.settings.is_theme = function(theme){
	if(theme==this.setting.theme){
		return true;
	}
	return false;
};

Template.settings.is_ascndr = function() { return this.theme=="ascndr" ? true : false; }
Template.settings.is_telescope = function() { return this.theme=="telescope" ? true : false; }
Template.settings.is_default = function() { return this.theme=="default" ? true : false; }