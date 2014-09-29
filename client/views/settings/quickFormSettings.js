function findAtts() {
  var c, n = 0;
  do {
    c = UI._parentData(n++);
  } while (c && !c.atts);
  return c && c.atts;
}

Template[getTemplate('quickForm_settings')].helpers({
  afFieldsets: function () {
    var schema = this._af.ss._schema;
    var groups = _.compact(_.uniq(_.pluckDeep(schema, 'autoform.group')));
    groups = groups.map(function (group) {
      return capitalise(group);
    });
    return groups;
  },
  fieldsForFieldset: function () {
    var fieldset = this.toLowerCase();
    var schema = AutoForm.find().ss._schema;

    // decorate schema with key names
    schema = _.map(schema, function (field, key) {
      field.name = key;
      return field;
    });

    // get names of fields whose group match the current fieldset
    var fields = _.pluck(_.filter(schema, function (field, key) {
      return field.autoform && field.autoform.group == fieldset;
    }), 'name');

    return fields;
  },
  inputClass: function inputClassHelper() {
    var atts = findAtts();
    if (atts) {
      return atts["input-col-class"];
    }
  },
  labelClass: function inputClassHelper() {
    var atts = findAtts();
    if (atts) {
      return atts["label-class"];
    }
  },
  submitButtonAtts: function bsQuickFormSubmitButtonAtts() {
    var qfAtts = this.atts;
    var atts = {type: "submit"};
    if (typeof qfAtts.buttonClasses === "string") {
      atts['class'] = qfAtts.buttonClasses;
    } else {
      atts['class'] = 'btn btn-primary';
    }
    return atts;
  },
  qfAutoFormContext: function () {
    var ctx = _.clone(this.qfAutoFormContext || {});
    if (typeof ctx["class"] === "string") {
      ctx["class"] += " form-horizontal";
    } else {
      ctx["class"] = "form-horizontal";
    }
    if (ctx["input-col-class"])
      delete ctx["input-col-class"];
    if (ctx["label-class"])
      delete ctx["label-class"];
    return ctx;
  }
});

Template["afFormGroup_settings"].afFieldInputAtts = function () {
  var atts = _.clone(this.afFieldInputAtts || {});
  if ('input-col-class' in atts) {
    delete atts['input-col-class'];
  }
  atts.template = "bootstrap3";
  return atts;
};

Template["afFormGroup_settings"].afFieldLabelAtts = function () {
  var atts = _.clone(this.afFieldLabelAtts || {});
  atts.template = "bootstrap3";
  return atts;
};

Template["afFormGroup_settings"].afEmptyFieldLabelAtts = function () {
  var atts = _.clone(this.afFieldLabelAtts || {});
  var labelAtts = _.omit(atts, 'name', 'autoform', 'template');
  // Add bootstrap class if necessary
  if (typeof labelAtts['class'] === "string") {
    labelAtts['class'] += " control-label"; //might be added twice but that shouldn't hurt anything
  } else {
    labelAtts['class'] = "control-label";
  }
  return labelAtts;
};

Template["afFormGroup_settings"].rightColumnClass = function () {
  var atts = this.afFieldInputAtts || {};
  return atts['input-col-class'] || "";
};

Template["afFormGroup_settings"].afFieldInstructions = function () {
  return this.afFieldInputAtts.instructions;
};

Template["afObjectField_settings"].rightColumnClass = function () {
  var atts = this.atts || {};
  return atts['input-col-class'] || "";
};

Template["afObjectField_settings"].afFieldLabelAtts = function () {
  var atts = this.atts;
  return {
    template: "bootstrap3",
    "class": atts["label-class"],
    "name": atts.name
  };
};

Template["afArrayField_settings"].rightColumnClass = function () {
  var atts = this.atts || {};
  return atts['input-col-class'] || "";
};

Template["afArrayField_settings"].afFieldLabelAtts = function () {
  var atts = this.atts || {};
  return {
    template: "bootstrap3",
    "class": atts["label-class"],
    "name": atts.name
  };
};