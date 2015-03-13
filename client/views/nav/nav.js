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
    // only use dropdowns for top nav
    return getSetting('navLayout', 'top-nav') == 'top-nav' && getThemeSetting('useDropdowns', true) ? 'has-dropdown' : 'no-dropdown';
  },
  logoTemplate: function () {
    return getTemplate('logo');
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