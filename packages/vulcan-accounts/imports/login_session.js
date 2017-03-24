import {Accounts} from 'meteor/accounts-base';
import {
  STATES,
  loginResultCallback,
  getLoginServices
} from './helpers.js';

const VALID_KEYS = [
  'dropdownVisible',

  // XXX consider replacing these with one key that has an enum for values.
  'inSignupFlow',
  'inForgotPasswordFlow',
  'inChangePasswordFlow',
  'inMessageOnlyFlow',

  'errorMessage',
  'infoMessage',

  // dialogs with messages (info and error)
  'resetPasswordToken',
  'enrollAccountToken',
  'justVerifiedEmail',
  'justResetPassword',

  'configureLoginServiceDialogVisible',
  'configureLoginServiceDialogServiceName',
  'configureLoginServiceDialogSaveDisabled',
  'configureOnDesktopVisible'
];

export const validateKey = function (key) {
  if (!_.contains(VALID_KEYS, key))
    throw new Error("Invalid key in loginButtonsSession: " + key);
};

export const KEY_PREFIX = "Meteor.loginButtons.";

// XXX This should probably be package scope rather than exported
// (there was even a comment to that effect here from before we had
// namespacing) but accounts-ui-viewer uses it, so leave it as is for
// now
Accounts._loginButtonsSession = {
  set: function(key, value) {
    validateKey(key);
    if (_.contains(['errorMessage', 'infoMessage'], key))
      throw new Error("Don't set errorMessage or infoMessage directly. Instead, use errorMessage() or infoMessage().");

    this._set(key, value);
  },

  _set: function(key, value) {
    Session.set(KEY_PREFIX + key, value);
  },

  get: function(key) {
    validateKey(key);
    return Session.get(KEY_PREFIX + key);
  }
};

if (Meteor.isClient){
  // In the login redirect flow, we'll have the result of the login
  // attempt at page load time when we're redirected back to the
  // application.  Register a callback to update the UI (i.e. to close
  // the dialog on a successful login or display the error on a failed
  // login).
  //
  Accounts.onPageLoadLogin(function (attemptInfo) {
    // Ignore if we have a left over login attempt for a service that is no longer registered.
    if (_.contains(_.pluck(getLoginServices(), "name"), attemptInfo.type))
      loginResultCallback(attemptInfo.type, attemptInfo.error);
  });

  let doneCallback;

  Accounts.onResetPasswordLink(function (token, done) {
    Accounts._loginButtonsSession.set('resetPasswordToken', token);
    Session.set(KEY_PREFIX + 'state', 'resetPasswordToken');
    doneCallback = done;

    Accounts.ui._options.onResetPasswordHook();
  });

  Accounts.onEnrollmentLink(function (token, done) {
    Accounts._loginButtonsSession.set('enrollAccountToken', token);
    Session.set(KEY_PREFIX + 'state', 'enrollAccountToken');
    doneCallback = done;

    Accounts.ui._options.onEnrollAccountHook();
  });

  Accounts.onEmailVerificationLink(function (token, done) {
    Accounts.verifyEmail(token, function (error) {
      if (! error) {
        Accounts._loginButtonsSession.set('justVerifiedEmail', true);
        Session.set(KEY_PREFIX + 'state', 'justVerifiedEmail');
        Accounts.ui._options.onSignedInHook();
      }
      else {
        Accounts.ui._options.onVerifyEmailHook();
      }

      done();
    });
  });
}
