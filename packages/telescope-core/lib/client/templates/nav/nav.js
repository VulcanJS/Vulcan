Template.nav.helpers({
  headerClass: function () {
    var headerClass = "";
    var bgBrightness = tinycolor(Settings.get('headerColor')).getBrightness();
    if (bgBrightness < 50) {
      headerClass += " dark-bg";
    } else if (bgBrightness < 130) {
      headerClass += " medium-dark-bg";
    } else if (bgBrightness < 220) {
      headerClass += " medium-light-bg";
    } else if (bgBrightness < 255) {
      headerClass += " light-bg";
    } else {
      headerClass += " white-bg";
    }
    return headerClass;
  },
  hasPrimaryNav: function () {
    return !!Telescope.modules.get("primaryNav").length;
  },
  hasSecondaryNav: function () {
    return !!Telescope.modules.get("secondaryNav").length;
  },
  dropdownClass: function () {
    var dropdownClass = "";
    // only use dropdowns for top nav
    if (this.length > 3) {
      dropdownClass += "long-dropdown";
    }
    if (Settings.get('navLayout', 'top-nav') === 'top-nav' && getThemeSetting('useDropdowns', true)) {
      dropdownClass += "has-dropdown";
    } else {
      dropdownClass += "no-dropdown";
    }
    return dropdownClass;
  },
  hasMoreThanThreeItems: function () {
    console.log(this);
    return this.length > 3;
  },
});

Template.nav.events({
  'click .mobile-menu-button': function(e){
    e.preventDefault();
    e.stopPropagation(); // Make sure we don't immediately close the mobile nav again. See layout.js event handler.
    $('body').toggleClass('mobile-nav-open');
  }
});
