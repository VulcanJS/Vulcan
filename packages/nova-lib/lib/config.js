/**
 * Kick off the global namespace for Telescope.
 * @namespace Telescope
 */

Telescope = {};

Telescope.VERSION = '0.25.7';

// ------------------------------------- Config -------------------------------- //

/**
 * Telescope configuration namespace
 * @namespace Telescope.config
 */
Telescope.config = {};

// ------------------------------------- Schemas -------------------------------- //

SimpleSchema.extendOptions({
  private: Match.Optional(Boolean),
  editable: Match.Optional(Boolean),  // editable: true means the field can be edited by the document's owner
  hidden: Match.Optional(Boolean),     // hidden: true means the field is never shown in a form no matter what
  editableBy: Match.Optional([String]),
  publishedTo: Match.Optional([String]),
  required: Match.Optional(Boolean), // required: true means the field is required to have a complete profile
  public: Match.Optional(Boolean), // public: true means the field is published freely
  profile: Match.Optional(Boolean), // profile: true means the field is shown on user profiles
  template: Match.Optional(String), // template used to display the field
  autoform: Match.Optional(Object) // autoform placeholder
  // editableBy: Match.Optional(String)
});

// ------------------------------------- Components -------------------------------- //

Telescope.components = {};

Telescope.registerComponent = (name, component) => {
  Telescope.components[name] = component;
};

Telescope.getComponent = (name) => {
  return Telescope.components[name];
};

// ------------------------------------- Subscriptions -------------------------------- //

 /**
 * Subscriptions namespace
 * @namespace Telescope.subscriptions
 */
Telescope.subscriptions = [];

/**
 * Add a subscription to be preloaded
 * @param {string} subscription - The name of the subscription
 */
Telescope.subscriptions.preload = function (subscription, args) {
  Telescope.subscriptions.push({name: subscription, arguments: args});
};

// ------------------------------------- Autolink -------------------------------- //

// https://github.com/bryanwoods/autolink-js
// find URLs in a string of text and hyperlink them
(function(){var a,b=[].slice;a=function(){var j,i,d,f,e,c,g,h;c=1<=arguments.length?b.call(arguments,0):[];g=/(^|\s)(\b(https?):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z0-9+&@#\/%=~_|]\b)/ig;if(c.length>0){e=c[0];i=e.callback;if((i!=null)&&typeof i==="function"){j=i;delete e.callback;}f="";for(d in e){h=e[d];f+=" "+d+"='"+h+"'";}return this.replace(g,function(l,o,k){var n,m;m=j&&j(k);n=m||("<a href='"+k+"'"+f+">"+k+"</a>");return""+o+n;});}else{return this.replace(g,"$1<a href='$2'>$2</a>");}};String.prototype.autoLink=a;}).call(this);


