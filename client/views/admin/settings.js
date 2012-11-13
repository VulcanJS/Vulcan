// note: this is some horrible code, I know

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

var ModelForm = function (model, formOptions) {
	this.model = model;
	this.formOptions = formOptions;
	
	this.generate = function () {
		$('#json-form').jsonForm({
		  schema: this.formSchema()
		});
	}
	
	this.formSchema = function() {
		var formSchema = {};
		
		for (var field in model) {
			if (field != '_id') {
				formSchema[field] = {			
					type: this.option(field, 'type') || model[field].constructor.name.toLowerCase(),
					title: this.option(field, 'title') || StringUtils.humanize(field),
					id: field
				}				
				
				if(this.option(field, 'enum')) formSchema[field]['enum'] = this.option(field, 'enum');
			}
		}
		
		return formSchema;
	}	
	
	this.option = function(field, optionName) {
		if (formOptions[field]) return formOptions[field][optionName];
		return null;
	}
}

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
		
		new ModelForm(setting, options).generate();
	})
}

Template.settings.events = {
  'click input[type=submit]': function(e){
    e.preventDefault();
    if(!Meteor.user()) throw 'You must be logged in.';
    var requireViewInvite=!!$('#requireViewInvite').attr('checked');
    var requirePostInvite=!!$('#requirePostInvite').attr('checked');
    var requirePostsApproval=!!$('#requirePostsApproval').attr('checked');
    var title= $('#title').val();
    var theme = $('#theme').val();
    var footerCode=$("#footerCode").val();
    var analyticsCode = $('#analyticsCode').val();
    var tlkioChannel = $('#tlkioChannel').val();
    var mixpanelId= $('#mixpanelId').val();
    var proxinoKey=$('#proxinoKey').val();
    var goSquaredId=$('#goSquaredId').val();
    var logoUrl=$('#logoUrl').val();
    var logoHeight=$('#logoHeight').val();
    var logoWidth=$('#logoWidth').val();
    var veroAPIKey=$('#veroAPIKey').val();
    var veroSecret=$('#veroSecret').val();
    var intercomId=$('#intercomId').val();
    var scoreUpdateInterval=$('#scoreUpdateInterval').val();
    var landingPageText=$('#landingPageText').val();
    var afterSignupText=$('#afterSignupText').val();
    var notes=$('#notes').val();

    var prevSetting=Settings.find().fetch()[0];
    
    if(prevSetting){
      Settings.update(prevSetting._id,{
          $set: {
            requireViewInvite:requireViewInvite,
            requirePostInvite:requirePostInvite,
            requirePostsApproval: requirePostsApproval,        
            title: title,
            theme: theme,
            footerCode: footerCode,
            analyticsCode: analyticsCode,
            tlkioChannel: tlkioChannel,
            mixpanelId: mixpanelId,
            proxinoKey: proxinoKey,
            goSquaredId: goSquaredId,
			veroAPIKey: veroAPIKey,
            veroSecret:veroSecret,
			intercomId: intercomId,
            logoUrl: logoUrl,
            logoHeight: logoHeight,
            logoWidth: logoWidth,
			scoreUpdateInterval: scoreUpdateInterval,
            landingPageText:landingPageText,
            afterSignupText:afterSignupText,
            notes: notes
          }
      }, function(error){
        if(error)
          console.log(error);
        throwError("Settings have been updated");
      });
    }else{
       var settingId = Settings.insert({
          requireViewInvite:requireViewInvite, 
          requirePostInvite:requirePostInvite, 
          requirePostsApproval:requirePostsApproval,      
          title: title,
          theme: theme,
          footerCode: footerCode,
          analyticsCode: analyticsCode,
          tlkioChannel: tlkioChannel,
          mixpanelId: mixpanelId,
          proxinoKey: proxinoKey,
          goSquaredId: goSquaredId,          
	      veroAPIKey: veroAPIKey,
          veroSecret:veroSecret,
		  intercomId: intercomId,
          logoUrl: logoUrl,
          logoHeight: logoHeight,
          logoWidth: logoWidth,
		  scoreUpdateInterval:scoreUpdateInterval,
          landingPageText:landingPageText,
          afterSignupText:afterSignupText,
          notes:notes
    }, function(){
        throwError("Settings have been created");
      });   
    }
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
  return setting;
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