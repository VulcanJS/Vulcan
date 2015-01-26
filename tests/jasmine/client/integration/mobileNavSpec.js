'use strict';

describe('test mobile nav', function() {

  beforeEach(function (done) {
    // Make sure the mobile menu is open
    $('.mobile-menu-button').click();
    setTimeout(function () {
      expect($('.mobile-nav').css('left')).toBe('0px');
      done();
    }, 500);
  });

  it('should close when clicked outside', function (done) {
    $('.inner-wrapper').click();
    setTimeout(function () {
      // Checking against 60px, because the left is width - 60px, but the width during testing is 0.
      expect($('.mobile-nav').css('left')).toBe('60px');
      done();
    }, 500);
  });

  it('should not close when clicked inside', function (done) {
    $('.mobile-nav').click();
    setTimeout(function () {
      expect($('.mobile-nav').css('left')).toBe('0px');
      done();
    }, 500);
  });
});