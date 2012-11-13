// note: this is some horrible code, I know

Template.settings.generate_settings_form = function () {
	Meteor.defer(function() {
		$('#json-form').jsonForm({
		  schema: {
		    name: {
		      type: 'string',
		      title: 'Name',
		      required: true
		    },
		    age: {
		      type: 'number',
		      title: 'Age'
		    }
		  },
		  onSubmit: function (errors, values) {
		    
		  }
		});
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
    var scoreInterval=$('#scoreInterval').val();
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
            intercomId: intercomId,
            logoUrl: logoUrl,
            logoHeight: logoHeight,
            logoWidth: logoWidth,
            veroAPIKey: veroAPIKey,
            veroSecret:veroSecret,
            landingPageText:landingPageText,
            afterSignupText:afterSignupText,
            scoreInterval: scoreInterval,
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
          intercomId: intercomId,          
          logoUrl: logoUrl,
          logoHeight: logoHeight,
          logoWidth: logoWidth,
          veroAPIKey: veroAPIKey,
          veroSecret:veroSecret,
          landingPageText:landingPageText,
          afterSignupText:afterSignupText,
          scoreInterval:scoreInterval,
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