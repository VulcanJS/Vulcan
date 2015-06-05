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
  template: Match.Optional(String) // template used to display the field
  // editableBy: Match.Optional(String)
});

// ------------------------------ Dynamic Templates ------------------------------ //

templates = {}

// note: not used anymore, but keep for backwards compatibility
getTemplate = function (name) {
  // for now, always point back to the original template
  var originalTemplate = (_.invert(templates))[name];
  return !!originalTemplate ? originalTemplate : name;

  // if template has been overwritten, return this; else return template name
  // return !!templates[name] ? templates[name] : name;
};


// ------------------------------- Vote Power -------------------------------- //

// The equation to determine voting power
// Default to returning 1 for everybody

getVotePower = function (user) {
  return 1;
};
