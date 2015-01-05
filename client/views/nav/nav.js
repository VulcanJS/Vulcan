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
    return getThemeSetting('useDropdowns', true) ? 'has-dropdown' : 'no-dropdown';
  },
  getTemplate: function () {
    return getTemplate(this.template);
  },
  site_title: function(){
    return getSetting('title', "Telescope");
  },
  logo_url: function(){
    return getSetting('logoUrl');
  }
});

Template[getTemplate('nav')].events({
  'click .mobile-menu-button': function(e){
    e.preventDefault();
    $('body').toggleClass('mobile-nav-open');
  }
});