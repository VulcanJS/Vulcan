(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope-blank/package-i18n.js                                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
TAPi18n.packages["telescope-blank"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"}; // 1
                                                                                                                  // 2
// define package's translation function (proxy to the i18next)                                                   // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                  // 4
// define the package's templates registrar                                                                       // 5
registerI18nTemplate = TAPi18n._getRegisterHelpersProxy("telescope-blank");                                       // 6
registerTemplate = registerI18nTemplate; // XXX OBSOLETE, kept for backward compatibility will be removed in the future
                                                                                                                  // 8
// Record the list of templates prior to package load                                                             // 9
var _ = Package.underscore._;                                                                                     // 10
non_package_templates = _.keys(Template);                                                                         // 11
                                                                                                                  // 12
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope-blank/lib/both.js                                                                           //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
// Custom Post Property                                                                                           // 1
                                                                                                                  // 2
var customProperty = {                                                                                            // 3
  propertyName: 'customProperty',                                                                                 // 4
  propertySchema: {                                                                                               // 5
    type: String,                           // property type                                                      // 6
    label: 'customLabel',                   // key string used for internationalization                           // 7
    optional: true,                         // make this property optional                                        // 8
    autoform: {                                                                                                   // 9
      editable: true,                       // make this property editable by users                               // 10
      type: "bootstrap-datetimepicker"      // assign a custom input type                                         // 11
    }                                                                                                             // 12
  }                                                                                                               // 13
}                                                                                                                 // 14
addToPostSchema.push(customProperty);                                                                             // 15
                                                                                                                  // 16
// Custom Setting                                                                                                 // 17
                                                                                                                  // 18
var customSetting = {                                                                                             // 19
  propertyName: 'customSetting',                                                                                  // 20
  propertySchema: {                                                                                               // 21
    type: String,                                                                                                 // 22
    optional: true,                                                                                               // 23
    autoform: {                                                                                                   // 24
      group: 'customGroup',                 // assign custom group (fieldset) in Settings form                    // 25
      private: true                         // mark as private (not published to client)                          // 26
    }                                                                                                             // 27
  }                                                                                                               // 28
}                                                                                                                 // 29
addToSettingsSchema.push(customSetting);                                                                          // 30
                                                                                                                  // 31
// Global Function                                                                                                // 32
                                                                                                                  // 33
myFunction = function (a, b) {                                                                                    // 34
  return a + b;                                                                                                   // 35
}                                                                                                                 // 36
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope-blank/lib/routes.js                                                                         //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Meteor.startup(function () {                                                                                      // 1
                                                                                                                  // 2
  Router.route('/custom-path', {                                                                                  // 3
    name: 'customRoute',                                                                                          // 4
    template: getTemplate('customTemplate')                                                                       // 5
  });                                                                                                             // 6
                                                                                                                  // 7
});                                                                                                               // 8
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope-blank/lib/client/templates/template.template.js                                             //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
                                                                                                                  // 1
Template.__checkName("customTemplate");                                                                           // 2
Template["customTemplate"] = new Template("Template.customTemplate", (function() {                                // 3
  var view = this;                                                                                                // 4
  return [ "Hi there, ", Blaze.View(function() {                                                                  // 5
    return Spacebars.mustache(view.lookup("name"));                                                               // 6
  }), "!" ];                                                                                                      // 7
}));                                                                                                              // 8
                                                                                                                  // 9
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope-blank/lib/client/templates/template.js                                                      //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Meteor.startup(function () {                                                                                      // 1
                                                                                                                  // 2
  Template[getTemplate('customTemplate')].helpers({                                                               // 3
    name: function () {                                                                                           // 4
      return "Bruce Willis";                                                                                      // 5
    }                                                                                                             // 6
  });                                                                                                             // 7
                                                                                                                  // 8
});                                                                                                               // 9
                                                                                                                  // 10
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope-blank/Users/sacha/Dev/Telescope/packages/telescope-blank/i18n/de.i18n.js                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope-blank",                                                                             // 2
    namespace = "telescope-blank";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
var package_templates = _.difference(_.keys(Template), non_package_templates);                                    // 8
                                                                                                                  // 9
for (var i = 0; i < package_templates.length; i++) {                                                              // 10
  var package_template = package_templates[i];                                                                    // 11
                                                                                                                  // 12
  registerI18nTemplate(package_template);                                                                         // 13
}                                                                                                                 // 14
                                                                                                                  // 15
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope-blank/Users/sacha/Dev/Telescope/packages/telescope-blank/i18n/en.i18n.js                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope-blank",                                                                             // 2
    namespace = "telescope-blank";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
// integrate the fallback language translations                                                                   // 8
TAPi18n.addResourceBundle("en", namespace, {"translation_key":"translation string"});                             // 9
                                                                                                                  // 10
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope-blank/Users/sacha/Dev/Telescope/packages/telescope-blank/i18n/es.i18n.js                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope-blank",                                                                             // 2
    namespace = "telescope-blank";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
                                                                                                                  // 8
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope-blank/Users/sacha/Dev/Telescope/packages/telescope-blank/i18n/fr.i18n.js                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope-blank",                                                                             // 2
    namespace = "telescope-blank";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
                                                                                                                  // 8
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope-blank/Users/sacha/Dev/Telescope/packages/telescope-blank/i18n/it.i18n.js                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope-blank",                                                                             // 2
    namespace = "telescope-blank";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
                                                                                                                  // 8
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope-blank/Users/sacha/Dev/Telescope/packages/telescope-blank/i18n/zh-CN.i18n.js                 //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope-blank",                                                                             // 2
    namespace = "telescope-blank";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
                                                                                                                  // 8
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
