'use strict';

describe('test nav template', function() {
  var $div;
  // Setting layoutTemplate to null to avoid stubbing the template completely.
  // Must happen here, because it will have otherwise run by the time beforeEach runs.
  Router.configure({
    layoutTemplate: null
  });

  beforeEach(function () {
    $div = $('<div>');
  });

  var render = function () {
    Blaze.render(Template.nav, $div.get(0));
  };

  it('should render mobile menu button', function () {
    render();

    var mobileMenuButton = $div.find('a.mobile-only.mobile-menu-button');
    expect(mobileMenuButton.length).toEqual(1);
    expect(mobileMenuButton.attr('href')).toEqual('#menu');

    expect(mobileMenuButton.find('svg').length).toEqual(1);
  });

  it('should render the logo from the setting', function () {
    spyOn(window, 'Settings.get').and.callFake(function (settingName) {
      return settingName;
    });

    render();

    var h1 = $div.find('h1.logo');
    expect(h1.length).toEqual(1);
    var link = h1.find('a');
    expect(link.length).toEqual(1);
    expect(link.attr('href')).toEqual('/');
    expect(link.find('img').length).toEqual(1);
    expect(link.find('img').attr('src')).toEqual('logoUrl');
    expect(link.find('img').attr('alt')).toEqual('title');
  });

  it('should render the site title if logo_url setting is empty', function () {
    spyOn(window, 'Settings.get').and.callFake(function (settingName) {
      if (settingName === 'logoUrl') {
        return null;
      }

      return settingName;
    });

    render();

    var h1 = $div.find('h1.logo');
    expect(h1.length).toEqual(1);
    var link = h1.find('a');
    expect(link.length).toEqual(1);
    expect(link.attr('href')).toEqual('/');
    expect(link.find('img').length).toEqual(0);
    expect(link.text()).toEqual('title');
  });

  describe('test primaryNav and secondaryNav', function () {
    var globalPrimaryNav, globalSecondaryNav;

    beforeEach(function () {
      globalPrimaryNav = primaryNav;
      primaryNav = [];
      globalSecondaryNav = secondaryNav;
      secondaryNav = [];
    });

    afterEach(function () {
      primaryNav = globalPrimaryNav;
      secondaryNav = globalSecondaryNav;
    });

    var setupNavTemplatesWithSpies = function (templateNames, renderFunction) {
      var navSpies = {};

      templateNames.forEach(function (templateName) {
        Template[templateName] = new Blaze.Template(
          templateName,
          renderFunction.bind(null, templateName)
        );
        navSpies[templateName] = spyOn(Template[templateName], 'renderFunction').and.callThrough();
      });

      return navSpies;
    };

    var checkNavListAndDeleteTemplates = function (renderedNav, templateNames, navSpies, contentFunction) {
      var list = renderedNav.find('li');
      expect(list.length).toEqual(templateNames.length);
      // Check that each of the <li>s contains the expected content and that the corresponding
      // renderFunction was called.
      list.each(function (index, el) {
        var templateName = templateNames[index];
        var navSpy = navSpies[templateName];
        expect(navSpy.calls.count()).toEqual(1);
        expect(el.innerHTML.trim()).toEqual(contentFunction(templateName));

        // Cleanup test template
        delete Template[templateName];
      });
    };

    var testNav = function (templateNames, expectedSelector) {
      var randomString = Math.random();

      var getNavContent = function (templateName) {
        return 'nav entry: ' + templateName + randomString;
      };
      var navSpies = setupNavTemplatesWithSpies(templateNames, getNavContent);

      spyOn(window, 'getThemeSetting').and.returnValue(true);

      render();

      var renderedNav = $div.find(expectedSelector);
      expect(renderedNav.length).toEqual(1);
      // Check that dropdownClass was added
      renderedNav.hasClass('has-dropdown');

      checkNavListAndDeleteTemplates(
        renderedNav,
        templateNames,
        navSpies,
        getNavContent
      );
    };

    it('should render primary nav from global primaryNav array of template names', function () {
      var templateNames = ['testNavTemplate1', 'testNavTemplate2'];
      primaryNav = templateNames.map(function (templateName, index) {
        return {
          template: templateName,
          order: index
        };
      });

      testNav(templateNames, 'ul.nav.primary-nav.desktop-nav');
    });

    it('should not render primary nav if global primaryNav array is empty', function () {
      primaryNav = [];

      render();

      // Look for broad selector just to make sure no .primary-nav exists
      var renderedPrimaryNav = $div.find('.primary-nav');
      expect(renderedPrimaryNav.length).toEqual(0);
    });

    it('should render secondary nav from global secondaryNav array of template names', function () {
      var templateNames = ['testNavTemplate1', 'testNavTemplate2'];
      secondaryNav = templateNames.map(function (templateName, index) {
        return {
          template: templateName,
          order: index
        };
      });

      testNav(templateNames, 'ul.nav.secondary-nav.desktop-nav');
    });

    it('should not render secondary nav if global secondaryNav array is empty', function () {
      secondaryNav = [];

      render();

      // Look for broad selector just to make sure no .secondary-nav exists
      var renderedSecondaryNav = $div.find('.secondary-nav');
      expect(renderedSecondaryNav.length).toEqual(0);
    });

    var setupAndRenderNavs = function () {
      primaryNav = [{
        template: 'testPrimaryNavTemplate',
        order: 10
      }];
      secondaryNav = [{
        template: 'testSecondaryNavTemplate',
        order: 10
      }];

      var getNavContent = function (templateName) {
        return templateName;
      };
      setupNavTemplatesWithSpies(
        [primaryNav[0].template, secondaryNav[0].template],
        getNavContent
      );

      render();
    };

    it('should render secondary nav directly after primary nav', function () {
      setupAndRenderNavs();

      var renderedPrimaryNav = $div.find('ul.nav.primary-nav');
      expect(renderedPrimaryNav.length).toEqual(1);
      var renderedSecondaryNav = $div.find('ul.nav.secondary-nav');
      expect(renderedSecondaryNav.length).toEqual(1);

      expect(renderedPrimaryNav.next()).toEqual(renderedSecondaryNav);
    });

    it('should have "has-dropdown" class if useDropdowns theme setting is true', function () {
      spyOn(window, 'getThemeSetting').and.returnValue(true);

      setupAndRenderNavs();

      var renderedPrimaryNav = $div.find('ul.nav.primary-nav.has-dropdown');
      expect(renderedPrimaryNav.length).toEqual(1);
      var renderedSecondaryNav = $div.find('ul.nav.secondary-nav.has-dropdown');
      expect(renderedSecondaryNav.length).toEqual(1);
    });

    it('should have "no-dropdown" class if useDropdowns theme setting is true', function () {
      spyOn(window, 'getThemeSetting').and.returnValue(false);

      setupAndRenderNavs();

      var renderedPrimaryNav = $div.find('ul.nav.primary-nav.no-dropdown');
      expect(renderedPrimaryNav.length).toEqual(1);
      var renderedSecondaryNav = $div.find('ul.nav.secondary-nav.no-dropdown');
      expect(renderedSecondaryNav.length).toEqual(1);
    });
  });
});
