getRoute = function (item) {
  // if route is a Function return its result, else apply Router.path() to it
  return typeof item.route == "function" ? item.route() : Router.path(item.route);
}

Template[getTemplate('dropdownComponent')].helpers({
  dropdownClass: function () {

    var classes = [this.dropdownName+"-menu"];
    var mode = (typeof this.dropdownMode === "undefined") ? "list" : this.dropdownMode;
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
    var currentPath = Router.current().location.get().path ;
    
    if (this.adminOnly) {
      itemClass += " item-admin";
    }
    if (getRoute(this) === currentPath || getRoute(this) === Meteor.absoluteUrl() + currentPath.substr(1)) {
      // substr(1) is to avoid having two "/" in the URL
      itemClass += " item-active";
    }
    if (this.itemClass) {
      itemClass += " "+this.itemClass;
    }

    return itemClass;
  },
  itemLabel: function () {
    // if label is a Function return its result, else return i18n'd version of label
    return typeof this.label == "function" ? this.label() :  i18n.t(this.label);
  },
  itemRoute: function () {
    return getRoute(this);
  }
});

Template[getTemplate('dropdownComponent')].events({
  'click .show-more': function (e, t) {
    e.preventDefault();
    $dropdown = t.$('.dropdown');
    $dropdown.toggleClass('dropdown-open');
  }
});