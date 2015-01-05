'use strict';

Jasmine.onTest(function () {
  describe('test permissions', function () {
    var testCanViewMeta = function (testFunc, requireViewInviteEnabled, mockValue, expected) {
        Settings.remove({});
        Settings.insert({'requireViewInvite': requireViewInviteEnabled});

        var canView = testFunc(mockValue);
        expect(canView).toEqual(expected);
    };
    describe('test can.view()', function () {

      var testCanView = function (requireViewInviteEnabled, mockUser, expected) {
        testCanViewMeta(can.view, requireViewInviteEnabled, mockUser, expected);
      };

      it('should return true when requireViewInvite setting is false', function () {
        testCanView(false, {}, true);
      });

      it('should return false when requireViewInvite setting is true and user is null', function () {
        testCanView(true, null, false);
      });

      it('should return false when requireViewInvite setting is true and user is neither admin nor invited', function () {
        testCanView(true, {}, false);
      });

      it('should return true when requireViewInvite setting is true and user is admin', function () {
        testCanView(true, {isAdmin: true}, true);
      });

      it('should return true when requireViewInvite setting is true and user is invited', function () {
        testCanView(true, {isInvited: true}, true);
      });
    });

    describe('test can.viewById()', function () {
       var testCanViewById = function (requireViewInviteEnabled, mockUserId, expected) {
        testCanViewMeta(can.viewById, requireViewInviteEnabled, mockUserId, expected);
      };

      it('should return true when requireViewInvite setting is false', function () {
        testCanViewById(false, 1, true);
      });

      it('should return false when requireViewInvite setting is true and userId is null', function () {
        testCanViewById(true, null, false);
      });

      it('should return true when requireViewInvite setting is true and user can view', function () {
        var canViewSpy = spyOn(can, 'view').and.returnValue(true);
        var userId = 5;
        testCanViewById(true, userId, true);

        expect(canViewSpy.calls.count()).toEqual(1);
        expect(canViewSpy).toHaveBeenCalledWith(Meteor.users.findOne(userId));
      });
    });
  });
});