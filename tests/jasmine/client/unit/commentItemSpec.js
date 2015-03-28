'use strict';

describe('test clicking vote buttons', function () {
  var $div;
  // Setting layoutTemplate to null to avoid stubbing the template completely.
  // Must happen here, because it will have otherwise run by the time beforeEach runs.
  Router.configure({
    layoutTemplate: null
  });

  beforeEach(function () {
    $div = $('<div>');
  });

  var render = function (data) {
    return Blaze.renderWithData(Template[getTemplate('comment_item')], data || {}, $div.get(0));
  };

  var shouldRedirectIfLoggedOut = function (selector) {
    render();

    spyOn(Meteor, 'user').and.returnValue(false);
    var routerSpy = spyOn(Router, 'go');
    var flashMessageSpy = spyOn(window, 'Messages.flash');
    var meteorCallSpy = spyOn(Meteor, 'call');

    $div.find(selector).click();

    expect(routerSpy.calls.count()).toEqual(1);
    expect(routerSpy).toHaveBeenCalledWith('atSignIn');
    expect(flashMessageSpy.calls.count()).toEqual(1);
    expect(meteorCallSpy.calls.count()).toEqual(0);
  };

  it('should redirect to the sign in page if logged out after upvoting', function () {
    shouldRedirectIfLoggedOut('.not-upvoted .upvote');
  });

  it('should redirect to the sign in page if logged out after removing upvote', function () {
    spyOn(Template.comment_item.__helpers, ' upvoted').and.returnValue(true);
    shouldRedirectIfLoggedOut('.upvoted .upvote');
  });

  it('should redirect to the sign in page if logged out after downvoting', function () {
    shouldRedirectIfLoggedOut('.not-downvoted .downvote');
  });

  it('should redirect to the sign in page if logged out after removing downvote', function () {
    spyOn(Template.comment_item.__helpers, ' downvoted').and.returnValue(true);
    shouldRedirectIfLoggedOut('.downvoted .downvote');
  });

  var shouldSendVoteAndTrack = function (selector, meteorMethodName, eventName) {
    var data = {
      _id: 'id',
      post: 'postId',
      userId: 'userId'
    };

    render(data);

    spyOn(Meteor, 'user').and.returnValue(true);
    var routerSpy = spyOn(Router, 'go');
    var flashMessageSpy = spyOn(window, 'Messages.flash');
    var trackEventSpy = spyOn(window, 'trackEvent').and.stub();
    var meteorCallSpy = spyOn(Meteor, 'call').and.callFake(function (methodName, context, callback) {
      callback();
    });

    $div.find(selector).click();

    expect(routerSpy.calls.count()).toEqual(0);
    expect(flashMessageSpy.calls.count()).toEqual(0);
    expect(meteorCallSpy.calls.count()).toEqual(1);
    expect(meteorCallSpy.calls.first().args[0]).toEqual(meteorMethodName);
    expect(trackEventSpy.calls.count()).toEqual(1);
    expect(trackEventSpy).toHaveBeenCalledWith(eventName, {
      'commentId': data._id,
      'postId': data.post,
      'authorId': data.userId
    });
  };

  it('should send upvote and track event', function () {
    shouldSendVoteAndTrack('.not-upvoted .upvote', 'upvoteComment', 'post upvoted');
  });

  it('should remove upvote and track event', function () {
    spyOn(Template.comment_item.__helpers, ' upvoted').and.returnValue(true);
    shouldSendVoteAndTrack('.upvoted .upvote', 'cancelUpvoteComment', 'post upvote cancelled');
  });

  it('should send downvote and track event', function () {
    shouldSendVoteAndTrack('.not-downvoted .downvote', 'downvoteComment', 'post downvoted');
  });

  it('should remove downvote and track event', function () {
    spyOn(Template.comment_item.__helpers, ' downvoted').and.returnValue(true);
    shouldSendVoteAndTrack('.downvoted .downvote', 'cancelDownvoteComment', 'post downvote cancelled');
  });
});
