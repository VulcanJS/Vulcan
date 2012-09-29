Template.settings.events = {
  'click input[type=submit]': function(e){
    e.preventDefault();
    if(!Meteor.user()) throw 'You must be logged in.';
    var title= $('#title').val();
    var theme = $('#theme').val();
    var footerCode=$("#footer_code").val();
    var analyticsCode = $('#analytics_code').val();
    var tlkioChannel = $('#tlkio_channel').val();
    var mixpanelId= $('#mixpanel_id').val();
    var proxinoKey=$('#proxino_key').val();
    var logoUrl=$('#logo_url').val();
    var logoHeight=$('#logo_height').val();
    var logoWidth=$('#logo_width').val();
    var prevSetting=Settings.find().fetch()[0];
    
    if(prevSetting){
      Settings.update(prevSetting._id,{
          $set: {
            title: title,
            theme: theme,
            footerCode: footerCode,
            analyticsCode: analyticsCode,
            tlkioChannel: tlkioChannel,
            mixpanelId: mixpanelId,
            proxinoKey: proxinoKey,
            logoUrl: logoUrl,
            logoHeight: logoHeight,
            logoWidth: logoWidth
          }
      }, function(){
        throwError("Settings have been updated");
      });
    }else{
       var settingId = Settings.insert({
          title: title,
          theme: theme,
          footerCode: footerCode,
          analyticsCode: analyticsCode,
          tlkioChannel: tlkioChannel,
          mixpanelId: mixpanelId,
          proxinoKey: proxinoKey,
          logoUrl: logoUrl,
          logoHeight: logoHeight,
          logoWidth: logoWidth
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