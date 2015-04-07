var findAtts = function () {
  var c, n = 0;
  do {
    c = UI._parentData(n++);
  } while (c && !c.atts);
  return c && c.atts;
}

var canEditField = function (field) {
  // show field only if user is admin or it's marked as editable 
  return isAdmin(Meteor.user()) || (!!field.atts && !!field.atts.editable) || (!!field.afFieldInputAtts && !!field.afFieldInputAtts.editable)
}

Template[getTemplate('quickForm_telescope')].helpers({
  fieldsWithNoFieldset: function () {
    // get names of fields who don't have an autoform attribute or don't have a group, but are not omitted
    // note: we need to _.map() first to assign the field key to the "name" property to preserve it. 
    var fields = _.pluck(_.filter(_.map(AutoForm.getFormSchema()._schema, function (field, key) {
      field.name = key;
      return field;
    }), function (field) {
      if (field.name.indexOf('$') !== -1) // filter out fields with "$" in their name
        return false
      if (field.autoform && field.autoform.omit) // filter out fields with omit = true
        return false
      if (field.autoform && field.autoform.group) // filter out fields with a group
        return false
      return true // return remaining fields
    }), "name");

    return fields;
  },  
  afFieldsets: function () {
    var groups = _.compact(_.uniq(_.pluckDeep(AutoForm.getFormSchema()._schema, 'autoform.group')));
    
    // if user is not admin, exclude "admin" group from fieldsets
    if (!isAdmin(Meteor.user()))
      groups = _.without(groups, 'admin')
    
    return groups;
  },
  fieldsetName: function () {
    return capitalise(i18n.t(this));
  },
  fieldsForFieldset: function () {
    var fieldset = this.toLowerCase();
    // get names of fields whose group match the current fieldset
    var fields = _.pluck(_.filter(AutoForm.getFormSchema()._schema, function (field, key) {
      return (field.name.indexOf('$') === -1) && field.autoform && field.autoform.group == fieldset;
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

Template["afFormGroup_telescope"].helpers({
  afFieldInputAtts: function () {
    var atts = _.clone(this.afFieldInputAtts || {});
    if ('input-col-class' in atts) {
      delete atts['input-col-class'];
    }
    atts.template = "bootstrap3";
    return atts;
  },
  afFieldLabelAtts: function () {
    var atts = _.clone(this.afFieldLabelAtts || {});
    atts.template = "bootstrap3";
    return atts;
  },
  afEmptyFieldLabelAtts: function () {
    var atts = _.clone(this.afFieldLabelAtts || {});
    var labelAtts = _.omit(atts, 'name', 'autoform', 'template');
    // Add bootstrap class if necessary
    if (typeof labelAtts['class'] === "string") {
      labelAtts['class'] += " control-label"; //might be added twice but that shouldn't hurt anything
    } else {
      labelAtts['class'] = "control-label";
    }
    return labelAtts;
  },
  fieldIsPrivate: function () {
    return !!this.afFieldInputAtts.private;
  },
  rightColumnClass: function () {
    var atts = this.afFieldInputAtts || {};
    return atts['input-col-class'] || "";
  },
  showField: function () {
    return canEditField(this);
  },
  afFieldInstructions: function () {
    return this.afFieldInputAtts.instructions;
  },
  label: function () {
    var fieldName = this.name;
    var fieldSchema = AutoForm.getFormSchema().schema(fieldName);

    // if a label has been explicitely specified, use it; else default to capitalization of i18n of the field name
    var label = !!fieldSchema.label ? fieldSchema.label: capitalise(i18n.t(fieldName));

    return label;
  }
});

Template["afObjectField_telescope"].helpers({
  rightColumnClass: function () {
    var atts = this.atts || {};
    return atts['input-col-class'] || "";
  },
  afFieldLabelAtts: function () {
    var atts = this.atts;
    return {
      template: "bootstrap3",
      "class": atts["label-class"],
      "name": atts.name
    }
  },
  showField: function () {
    return canEditField(this);
  },
});

Template["afArrayField_telescope"].helpers({
  rightColumnClass: function () {
    var atts = this.atts || {};
    return atts['input-col-class'] || "";
  },
  afFieldLabelAtts: function () {
    var atts = this.atts || {};
    return {
      template: "bootstrap3",
      "class": atts["label-class"],
      "name": atts.name
    };
  },
  showField: function () {
    return canEditField(this);
  },
});