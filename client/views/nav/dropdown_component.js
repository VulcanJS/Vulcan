Template[getTemplate('dropdownComponent')].helpers({
  dropdownClass: function () {

    var classes = [this.dropdownName+"-menu"];

    if(!!this.dropdownClass) {
      classes.push(this.dropdownClass)
    }

    if (this.dropdownItems.length > 3) {
      classes.push("long-dropdown");
    }
    if (!!this.dropdownExpanded) {
      classes.push("dropdown-expanded");
    } else {
      classes.push("dropdown-collapsed");
    }
    // enable dropdown if top-nav layout is enabled, if themes supports dropdowns, and if dropdown isn't empty
    if (getSetting('navLayout', 'top-nav') == 'top-nav' && getThemeSetting('useDropdowns', true) && this.dropdownItems.length) {
      classes.push("has-dropdown");
    } else {
      classes.push("no-dropdown");
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
  showMore: function () {
    return getSetting('navLayout', 'top-nav') == 'side-nav' && this.length > 3 && !Template.parentData(1).dropdownExpanded;
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