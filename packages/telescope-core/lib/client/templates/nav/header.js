Template.header.helpers({
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
    return this.length > 3;
  }
});

Template.header.onRendered(function () {
  if (Settings.get('navLayout', 'top-nav') === 'top-nav') {
    var $logo = Template.instance().$('.logo');
    var offsetX = $logo.outerWidth() * -0.5;
    var offsetY = $logo.outerHeight() * -0.5;
    $logo.css("margin-left", offsetX);
    $logo.css("margin-top", offsetY);

    var $primaryNav = Template.instance().$('.primary-nav');
    offsetY = $primaryNav.outerHeight() * -0.5;
    $primaryNav.css("margin-top", offsetY);

    var $secondaryNav = Template.instance().$('.secondary-nav');
    offsetY = $secondaryNav.outerHeight() * -0.5;
    $secondaryNav.css("margin-top", offsetY);
  }
});

Template.header.events({
  'click .mobile-menu-button': function(e){
    e.preventDefault();
    e.stopPropagation(); // Make sure we don't immediately close the mobile nav again. See layout.js event handler.
    $('body').toggleClass('mobile-nav-open');
  }
});
