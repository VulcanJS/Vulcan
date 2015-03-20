Template[getTemplate('dropdownComponent')].helpers({
  dropdownClass: function () {
    var dropdownClass = this.dropdownName;
    // only use dropdowns for top nav
    if (this.length > 3) {
      dropdownClass += " long-dropdown";
    }
    if (getSetting('navLayout', 'top-nav') == 'top-nav' && getThemeSetting('useDropdowns', true)) {
      dropdownClass += " has-dropdown";
    } else {
      dropdownClass += " no-dropdown";
    }
    return dropdownClass;
  },
  dropdownLabel: function () {
    // if label is defined, use this. Else default to dropdown name
    return !!this.dropdownLabel ? this.dropdownLabel : i18n.t(this.dropdownName);
  },
  hasMoreThanThreeItems: function () {
    return this.length > 3;
  },
  itemLabel: function () {
    var dropdown = Template.parentData(2);
    // case 1: if a dropdown label function is provided, use it
    if (!!dropdown.dropdownItemLabel) {
      return dropdown.dropdownItemLabel(this);
    }
    // case 2: if label is a String, return it
    if (typeof this.label == "string") {
      return i18n.t(this.label);
    }
    // case 3: if label is a Function return its result
    if (typeof this.label == "function") {
      return this.label()
    } 
  },
  itemPath: function () {
    var dropdown = Template.parentData(2);
    // case 1: if a dropdown path function is provided, use it
    if (!!dropdown.dropdownItemPath) {
      return dropdown.dropdownItemPath(this);
    }
    // case 2: if route is a String, apply Router.path() to it
    if (typeof this.route == "string") {
      return Router.path(this.route);
    }
    // case 3: if route is a Function return its result
    if (typeof this.route == "string") {
      return this.route()
    }
  }
});