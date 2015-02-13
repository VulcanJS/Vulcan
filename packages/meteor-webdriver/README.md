meteor-webdriver
================

A [webdriverIO](http://webdriver.io) for UI testing using any testing framework.

1. Starts PhantomJS in webdriver mode
2. Provides you with a browser you can automate using the industry standard Selenium Webdriver

##Installation

```sh
meteor add xolvio:webdriver
```

## Usage

```javascript

describe('Browser testing', function(done) {

  var _browser;

  before(function(done) {
    wdio.getGhostDriver(function(browser) {
      _browser = browser;
      done();
    });
  })

  it('should have the correct title', function(done) {
    _browser.
      init().
      url('http://www.google.com').
      title(function(err, res) {
          console.log('Title was: ' + res.value);
      }).
      end().
      call(done);
  });
  
});
  
```

For more examples and usage, see the [webdriver.io website](http://webdriver.io).

## Package Roadmap

- [x] [WebdriverIO](http://webdriver.io)
- [x] Use PhantomJS in GhostDriver mode
- [ ] Automatically Download [ChromeDriver](https://code.google.com/p/selenium/wiki/ChromeDriver) /
[Selenium Server](http://www.seleniumhq.org/download/)
- [ ] Reuse the selenium webdriver session between tests so the browser does not flicker on and off
- [ ] Support multiple window testing
- [ ] Specify the browser matrix to run in development
- [ ] Specify the browser matrix to run in continuous integration mode
- [ ] SauceLabs & BrowserStack support
