var settingsForm;

Template.settings.helpers({
	generateSettingsForm: function (setting) {
		Meteor.defer(function() {
			settingsForm = new DatabaseForm();
			settingsForm.generateFor(setting, '#json-form');
		})	
	},
	
	noSettings: function(){
		if (Settings.findOne()) {
			return false;
		}
		return true;
	},
	
	setting: function(){
		var setting = Settings.find().fetch()[0];
		return new Setting(setting) || new Setting();
	},

});

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