import { Accounts } from 'meteor/accounts-base';
import {
  redirect,
  validatePassword,
  validateEmail,
  validateUsername,
} from './helpers.js';

/**
 * @summary Accounts UI
 * @namespace
 * @memberOf Accounts
 */
Accounts.ui = {};

Accounts.ui._options = {
  requestPermissions: [],
  requestOfflineToken: {},
  forceApprovalPrompt: {},
  requireEmailVerification: false,
  passwordSignupFields: 'USERNAME_AND_EMAIL',
  minimumPasswordLength: 7,
  loginPath: '/',
  signUpPath: null,
  resetPasswordPath: null,
  profilePath: '/',
  changePasswordPath: null,
  homeRoutePath: '/',
  onSubmitHook: () => {},
  onPreSignUpHook: () => new Promise(resolve => resolve()),
  onPostSignUpHook: () => {},
  onEnrollAccountHook: () => redirect(`${Accounts.ui._options.loginPath}`),
  onResetPasswordHook: () => redirect(`${Accounts.ui._options.loginPath}`),
  onVerifyEmailHook: () => redirect(`${Accounts.ui._options.profilePath}`),
  onSignedInHook: () => redirect(`${Accounts.ui._options.homeRoutePath}`),
  onSignedOutHook: () => redirect(`${Accounts.ui._options.homeRoutePath}`),
  emailPattern: new RegExp('[^@]+@[^@\.]{2,}\.[^\.@]+'),
};

/**
 * @summary Configure the behavior of [`<Accounts.ui.LoginForm />`](#react-accounts-ui).
 * @anywhere
 * @param {Object} options
 * @param {Object} options.requestPermissions Which [permissions](#requestpermissions) to request from the user for each external service.
 * @param {Object} options.requestOfflineToken To ask the user for permission to act on their behalf when offline, map the relevant external service to `true`. Currently only supported with Google. See [Meteor.loginWithExternalService](#meteor_loginwithexternalservice) for more details.
 * @param {Object} options.forceApprovalPrompt If true, forces the user to approve the app's permissions, even if previously approved. Currently only supported with Google.
 * @param {String} options.passwordSignupFields Which fields to display in the user creation form. One of '`USERNAME_AND_EMAIL`' (default), '`USERNAME_AND_OPTIONAL_EMAIL`', '`USERNAME_ONLY`', '`EMAIL_ONLY`'.
 */
Accounts.ui.config = function(options) {
  // validate options keys
  const VALID_KEYS = [
    'passwordSignupFields',
    'requestPermissions',
    'requestOfflineToken',
    'forbidClientAccountCreation',
    'requireEmailVerification',
    'minimumPasswordLength',
    'loginPath',
    'signUpPath',
    'resetPasswordPath',
    'profilePath',
    'changePasswordPath',
    'homeRoutePath',
    'onSubmitHook',
    'onPreSignUpHook',
    'onPostSignUpHook',
    'onEnrollAccountHook',
    'onResetPasswordHook',
    'onVerifyEmailHook',
    'onSignedInHook',
    'onSignedOutHook',
    'validateField',
    'emailPattern',
  ];

  _.each(_.keys(options), function (key) {
    if (!_.contains(VALID_KEYS, key))
      throw new Error("Accounts.ui.config: Invalid key: " + key);
  });

  // Deal with `passwordSignupFields`
  if (options.passwordSignupFields) {
    if (_.contains([
      "USERNAME_AND_EMAIL",
      "USERNAME_AND_OPTIONAL_EMAIL",
      "USERNAME_ONLY",
      "EMAIL_ONLY",
    ], options.passwordSignupFields)) {
      Accounts.ui._options.passwordSignupFields = options.passwordSignupFields;
    }
    else {
      throw new Error("Accounts.ui.config: Invalid option for `passwordSignupFields`: " + options.passwordSignupFields);
    }
  }

  // Deal with `requestPermissions`
  if (options.requestPermissions) {
    _.each(options.requestPermissions, function (scope, service) {
      if (Accounts.ui._options.requestPermissions[service]) {
        throw new Error("Accounts.ui.config: Can't set `requestPermissions` more than once for " + service);
      }
      else if (!(scope instanceof Array)) {
        throw new Error("Accounts.ui.config: Value for `requestPermissions` must be an array");
      }
      else {
        Accounts.ui._options.requestPermissions[service] = scope;
      }
    });
  }

  // Deal with `requestOfflineToken`
  if (options.requestOfflineToken) {
    _.each(options.requestOfflineToken, function (value, service) {
      if (service !== 'google')
        throw new Error("Accounts.ui.config: `requestOfflineToken` only supported for Google login at the moment.");

      if (Accounts.ui._options.requestOfflineToken[service]) {
        throw new Error("Accounts.ui.config: Can't set `requestOfflineToken` more than once for " + service);
      }
      else {
        Accounts.ui._options.requestOfflineToken[service] = value;
      }
    });
  }

  // Deal with `forceApprovalPrompt`
  if (options.forceApprovalPrompt) {
    _.each(options.forceApprovalPrompt, function (value, service) {
      if (service !== 'google')
        throw new Error("Accounts.ui.config: `forceApprovalPrompt` only supported for Google login at the moment.");

      if (Accounts.ui._options.forceApprovalPrompt[service]) {
        throw new Error("Accounts.ui.config: Can't set `forceApprovalPrompt` more than once for " + service);
      }
      else {
        Accounts.ui._options.forceApprovalPrompt[service] = value;
      }
    });
  }

  // Deal with `requireEmailVerification`
  if (options.requireEmailVerification) {
    if (typeof options.requireEmailVerification != 'boolean') {
      throw new Error(`Accounts.ui.config: "requireEmailVerification" not a boolean`);
    }
    else {
      Accounts.ui._options.requireEmailVerification = options.requireEmailVerification;
    }
  }

  // Deal with `minimumPasswordLength`
  if (options.minimumPasswordLength) {
    if (typeof options.minimumPasswordLength != 'number') {
      throw new Error(`Accounts.ui.config: "minimumPasswordLength" not a number`);
    }
    else {
      Accounts.ui._options.minimumPasswordLength = options.minimumPasswordLength;
    }
  }

  // Deal with the hooks.
  for (let hook of [
    'onSubmitHook',
    'onPreSignUpHook',
    'onPostSignUpHook',
  ]) {
    if (options[hook]) {
      if (typeof options[hook] != 'function') {
        throw new Error(`Accounts.ui.config: "${hook}" not a function`);
      }
      else {
        Accounts.ui._options[hook] = options[hook];
      }
    }
  }

  // Deal with pattern.
  for (let hook of [
    'emailPattern',
  ]) {
    if (options[hook]) {
      if (!(options[hook] instanceof RegExp)) {
        throw new Error(`Accounts.ui.config: "${hook}" not a Regular Expression`);
      }
      else {
        Accounts.ui._options[hook] = options[hook];
      }
    }
  }

  // deal with the paths.
  for (let path of [
    'loginPath',
    'signUpPath',
    'resetPasswordPath',
    'profilePath',
    'changePasswordPath',
    'homeRoutePath'
  ]) {
    if (typeof options[path] !== 'undefined') {
      if (options[path] !== null && typeof options[path] !== 'string') {
        throw new Error(`Accounts.ui.config: ${path} is not a string or null`);
      }
      else {
        Accounts.ui._options[path] = options[path];
      }
    }
  }

  // deal with redirect hooks.
  for (let hook of [
      'onEnrollAccountHook',
      'onResetPasswordHook',
      'onVerifyEmailHook',
      'onSignedInHook',
      'onSignedOutHook']) {
    if (options[hook]) {
      if (typeof options[hook] == 'function') {
        Accounts.ui._options[hook] = options[hook];
      }
      else if (typeof options[hook] == 'string') {
        Accounts.ui._options[hook] = () => redirect(options[hook]);
      }
      else {
        throw new Error(`Accounts.ui.config: "${hook}" not a function or an absolute or relative path`);
      }
    }
  }
};

export default Accounts;
