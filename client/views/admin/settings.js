// note: this is some horrible code, I know

var Setting = function (options) {
	this._id = null;
	this.requireViewInvite = false;
    this.requirePostInvite = false;
    this.requirePostsApproval = false;
    this.title = '';
    this.theme = '';
    this.footerCode = '';
    this.analyticsCode = '';
    this.tlkioChannel = '';
    this.mixpanelId = '';
    this.proxinoKey = '';
    this.goSquaredId = '';
	this.veroAPIKey = '';
	this.veroSecret = '';
	this.intercomId = '';
	this.logoUrl = '';
	this.logoHeight = '';
	this.logoWidth = '';
	this.scoreUpdateInterval = '';
	this.landingPageText = '';
	this.afterSignupText = '';
	this.notes = '';
	
	for (field in this) {
		if (options && options[field]) this[field] = options[field];
	}
}

var StringUtils = {
	humanize: function(string) {
		return this.capitalize(this.convertCamelToSpaces(string));
	},
	
	capitalize: function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},
	
	convertCamelToSpaces: function(string) {
		return string.replace(/([A-Z])/g, function(match) {
			return ' ' + match;
		});
	}
}

var ModelForm = function (modelClass, model, formOptions) {
	this.modelClass = modelClass;
	this.model = model;
	this.formOptions = formOptions;
	
	this.generate = function () {
		$('#json-form').jsonForm({
		  schema: this.formSchema()
		});
	}
	
	this.formSchema = function() {
		var formSchema = {};
		
		for (var field in this.schema(model)) {
			formSchema[field] = {			
				type: this.option(field, 'type') || model[field].constructor.name.toLowerCase(),
				title: this.option(field, 'title') || StringUtils.humanize(field),
				id: field,
				default: model[field]
			}				

			if(this.option(field, 'enum')) formSchema[field]['enum'] = this.option(field, 'enum');
		}
		
		return formSchema;
	}	
	
	this.option = function(field, optionName) {
		if (formOptions[field]) return formOptions[field][optionName];
		return null;
	}
	
	this.submit = function (createHandler, updateHandler) {
		for (field in this.schema(model)) {
			var regexExpression = ':regex(id, jsonform.*' + field + ')';
			var htmlElement = $(regexExpression);
			if (model[field].constructor == Boolean) model[field] = !!htmlElement.attr('checked');
			else model[field] = htmlElement.val();
		}
		
		if (model._id) {
			modelClass.update(model._id, {$set: this.schema(model)}, updateHandler);
	    } else {
	       model._id = modelClass.insert(this.schema(model), createHandler);   
	    }
	}
	
	this.schema = function (model) {
		schema = {};
		for (field in model) {
			if (field != '_id') schema[field] = model[field];
		}
		return schema;
	}
}

var settingsForm;

Template.settings.generate_settings_form = function (setting) {
	Meteor.defer(function() {
		var options = {
			'requireViewInvite': {
				title: 'Require Invite to view?'
			},
			'requirePostInvite': {
				title: 'Require Invite to post?'
			},
			'requirePostsApproval': {
				title: 'Posts must be approved by admin?'
			},
			'title': {
				title: 'Site Title'
			},
			'theme': {
				'enum': [
					'Default',
					'Ascndr',
					'Telescope'
				]
			},
			'footerCode': {
				type: 'textarea'
			},
			'analyticsCode': {
				type: 'textarea'
			},
			'tlkioChannel': {
				title: '<a href="http://tlk.io/">Tlk.io</a> Channel'
			},
			'mixpanelId': {
				title: '<a href="http://mixpanel.com/">Mixpanel</a> ID'
			},
			'proxinoKey': {
				title: '<a href="http://proxino.com/">Proxino</a> key'
			},
			'goSquaredId': {
				title: '<a href="http://gosquared.com/">GoSquared</a> ID'
			},
			'intercomId': {
				title: '<a href="http://intercom.io/">Intercom</a> ID'
			},
			'veroAPIKey': {
				title: '<a href="http://getvero.com/">Vero</a> API key'
			},
			'veroSecret': {
				title: '<a href="http://getvero.com/">Vero</a> secret'
			},
			'logoUrl': {
				title: 'Logo URL'
			},
			'landingPageText': {
				type: 'textarea'
			},
			'afterSignupText': {
				type: 'textarea'
			},
			'notes': {
				type: 'textarea'
			}
		};
		
		settingsForm = new ModelForm(Settings, setting, options);
		settingsForm.generate();
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
		});
  }
};

Template.settings.no_settings = function(){
  if(Settings.find().fetch()[0]){
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

Template.settings.is_ascndr = function(){return this.theme=="ascndr" ? true : false;}
Template.settings.is_telescope = function(){return this.theme=="telescope" ? true : false;}
Template.settings.is_default = function(){return this.theme=="default" ? true : false;}