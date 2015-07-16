Template.css.helpers({
  elementColors: function () {
    var css = "";

    // first loop over each of the four color
    _.each(Telescope.colorElements.colorTable, function (elements, color) {
      if (typeof Settings.get(color) !== "undefined") {
        var properties = {};

        // for each color, loop over the items to build the selector
        _.each(elements, function (element) {
          var elementSelector = element.selector;
          var elementProperty = !!element.property ? element.property : "color"; // default to color property
          properties[elementProperty] += ", "+elementSelector;
        });

        // loop over all properties, and add the relevant selectors
        _.each(properties, function (selector, property) {
          css += selector + "{\n  " + property + ": " + Settings.get(color) + ";\n}\n";
        });
      }
    });
    return css;
  },
  fontFamily: function () {
    return Settings.get('fontFamily', false);
  },
  fontUrl: function () {
    return Settings.get('fontUrl', false);
  },
  backgroundCSS: function () {
    return Settings.get('backgroundCSS', false);
  },
  buttonColor: function () {
    return Settings.get('buttonColor', false);
  },
  logoHeight: function () {
    return Settings.get('logoHeight', false);
  },
  logoWidth: function () {
    return Settings.get('logoWidth', false);
  },
  headerTextColorHalfOpacity: function () {
    return tinycolor(Settings.get("headerTextColor")).setAlpha(0.5);
  },
  buttonColorHalfOpacity: function () {
    return tinycolor(Settings.get("buttonColor")).setAlpha(0.5);
  },
  hideAuthClass: function () {

    var authClass = '';
    var authMethods = Settings.get('authMethods', ["email"]);
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

  },
  extraCSS: function () {
    return Settings.get("extraCSS");
  }
});
