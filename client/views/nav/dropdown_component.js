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
  showDropdownItem: function () {
    // if this is an admin item, only show it if current user is admin
    return this.adminOnly ? isAdmin(Meteor.user()) : true;
  },
  showMore: function () {
    return getSetting('navLayout', 'top-nav') == 'side-nav' && this.length > 3;
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

Template[getTemplate('dropdownComponent')].onRendered(function () {
  var $dropdown = this.$('.dropdown');
  var height = $dropdown.height();

  var mySVGsToInject = $dropdown.find('.svg');
  SVGInjector(mySVGsToInject, {}, function () {
    $dropdown.find('.svg').css('visibility', 'visible');
  });
});

Template[getTemplate('dropdownComponent')].events({
  'click .show-more': function (e, t) {
    e.preventDefault();

    $dropdown = t.$('.dropdown');
    console.log($dropdown);
    $dropdown.toggleClass('dropdown-open');
  }
});