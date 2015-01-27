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
      var width = $('.mobile-nav').width();
      // This is a pretty hacky check that's necessary because different testing environments
      // change the width of .mobile-nav which in turn changes the left value.
      var expectedLeft = width === 0 ? '60px' : '-200px';
      expect($('.mobile-nav').css('left')).toBe(expectedLeft);
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