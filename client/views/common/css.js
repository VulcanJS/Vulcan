Template[getTemplate('css')].helpers({
  hideAuthClass: function () {
    
    var authClass = '';
    var authMethods = getSetting('authMethods', ["email"]);
    var selectors = [
      {name: 'email', selector: ".at-pwd-form"},
      {name: 'twitter', selector: "#at-twitter"},
      {name: 'facebook', selector: "#at-facebook"}
    ];
    selectors.forEach(function (method) {
      // if current method is not one of the enabled auth methods, hide it
      if (authMethods.indexOf(method.name) == -1) {
        authClass += method.selector + ", ";
      }
    });

    // unless we're showing at least one of twitter and facebook AND the password form,
    // hide separator
    if (authMethods.indexOf('email') == -1 || (authMethods.indexOf('facebook') == -1 && authMethods.indexOf('twitter') == -1)) {
      authClass += ".at-sep, ";
    }

    return authClass.slice(0, - 2) + "{display:none !important}";

  }
});