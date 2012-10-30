Template.settings.events = {
  'click input[type=submit]': function(e){
    e.preventDefault();
    if(!Meteor.user()) throw 'You must be logged in.';

    var settings = {
        requireViewInvite:      !!$('#requireViewInvite').attr('checked')
      , requirePostInvite:      !!$('#requirePostInvite').attr('checked')
      , requirePostsApproval:   !!$('#requirePostsApproval').attr('checked')    
      , title:                  $('#title').val()
      , theme:                  $('#theme').val()
      , footerCode:             $("#footerCode").val()
      , analyticsCode:          $('#analyticsCode').val()
      , mixpanelId:             $('#mixpanelId').val()
      , proxinoKey:             $('#proxinoKey').val()
      , goSquaredId:            $('#goSquaredId').val()
      , intercomId:             $('#intercomId').val()
      , logoUrl:                $('#logoUrl').val()
      , logoHeight:             $('#logoHeight').val()
      , logoWidth:              $('#logoWidth').val()
      , veroAPIKey:             $('#veroAPIKey').val()
      , veroSecret:             $('#veroSecret').val()
      , landingPageText:        $('#landingPageText').val()
      , afterSignupText:        $('#afterSignupText').val()
      , scoreInterval:          $('#scoreInterval').val()
      , notes:                  $('#notes').val()
    }
    var prevSetting=Settings.find().fetch()[0];
    
    if(prevSetting){
      Settings.update(prevSetting._id,{
          $set: settings
      }, function(error){
        if(error)
          console.log(error);
        throwError("Settings have been updated");
      });
    }else{
       var settingId = Settings.insert(settings, function(){
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