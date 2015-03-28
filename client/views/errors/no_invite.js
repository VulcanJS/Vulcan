Template[getTemplate('no_invite')].helpers({
  afterSignupText: function(){
    return Settings.get("afterSignupText");
  }
});
