Template[getTemplate('nav')].helpers({
  primaryNav: function () {
    return _.sortBy(primaryNav, 'order');
  },
  hasPrimaryNav: function () {
    return !!primaryNav.length;
  },
  secondaryNav: function () {
    return _.sortBy(secondaryNav, 'order');
  },
  hasSecondaryNav: function () {
    return !!secondaryNav.length;
  },
  dropdownClass: function () {
    var dropdownClass = "";
    // only use dropdowns for top nav
    if (this.length > 3) {
      dropdownClass += "long-dropdown";
    }
    if (getSetting('navLayout', 'top-nav') == 'top-nav' && getThemeSetting('useDropdowns', true)) {
      dropdownClass += "has-dropdown";
    } else {
      dropdownClass += "no-dropdown";
    }
    return dropdownClass;
  },
  hasMoreThanThreeItems: function () {
    console.log(this)
    return this.length > 3;
  },
  logoTemplate: function () {
    return getTemplate('logo');
  },
  navZoneTemplate: function () {
    return getTemplate('navZone');
  },
  getTemplate: function () {
    return getTemplate(this.template);
  },
  headerClass: function () {
    var color = getSetting('headerColor');
    return (color == 'white' || color == '#fff' || color == '#ffffff') ? "white-background" : '';
  }
});

Template[getTemplate('nav')].events({
  'click .mobile-menu-button': function(e){
    e.preventDefault();
    e.stopPropagation(); // Make sure we don't immediately close the mobile nav again. See layout.js event handler.
    $('body').toggleClass('mobile-nav-open');
  }
});