Template[getTemplate('dropdownComponent')].helpers({
  dropdownClass: function () {

    var classes = [this.dropdownName+"-menu"];
    var mode = this.dropdownMode == "undefined" ? "list" : this.dropdownMode;
    var count = this.dropdownItems.length;

    classes.push("dropdown-"+mode);

    if(!!this.dropdownClass) {
      classes.push(this.dropdownClass)
    }

    // enable dropdown if top-nav layout is enabled, if themes supports dropdowns, and if dropdown isn't empty
    if (count) {
      classes.push("dropdown-has-items");
      if (count > 3) {
        classes.push("dropdown-long");
      }
    } else {
      classes.push("dropdown-no-items");
    }

    return classes.join(" ");
  },
  dropdownLabel: function () {
    // if label is defined, use this. Else default to dropdown name
    return !!this.dropdownLabel ? this.dropdownLabel : i18n.t(this.dropdownName);
  },
  showDropdownItem: function () {
    // if this is an admin item, only show it if current user is admin
    return this.adminOnly ? isAdmin(Meteor.user()) : true;
  },
  hasTemplate: function () {
    return !!this.template;
  },
  itemClass: function () {
    var itemClass = "";
    if (this.adminOnly) {
      itemClass += " admin-item";
    }
    return itemClass;
  },
  itemLabel: function () {
    // if label is a Function return its result, else return i18n'd version of label
    return typeof this.label == "function" ? this.label() :  i18n.t(this.label);
  },
  itemRoute: function () {
    // if route is a Function return its result, else apply Router.path() to it
    return typeof this.route == "function" ? this.route() : Router.path(this.route);
  }
});

Template[getTemplate('dropdownComponent')].events({
  'click .show-more': function (e, t) {
    e.preventDefault();
    $dropdown = t.$('.dropdown');
    $dropdown.toggleClass('dropdown-open');
  }
});