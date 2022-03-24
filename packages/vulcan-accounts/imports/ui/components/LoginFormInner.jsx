/* eslint-disable meteor/no-session */
import React from 'react';
import PropTypes from 'prop-types';
import { Accounts } from 'meteor/accounts-base';
import { KEY_PREFIX } from '../../login_session.js';
import { Components, registerComponent, withCurrentUser, Callbacks, runCallbacks } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import { withApollo } from '@apollo/client/react/hoc';

import TrackerComponent from './TrackerComponent.jsx';

import {
  STATES,
  passwordSignupFields,
  validateEmail,
  validatePassword,
  validateUsername,
  loginResultCallback,
  getLoginServices,
  hasPasswordService,
  capitalize,
} from '../../helpers.js';

export class AccountsLoginFormInner extends TrackerComponent {
  constructor(props) {
    super(props);

    if (props.formState === STATES.SIGN_IN && Package['accounts-password']) {
      // eslint-disable-next-line no-console
      console.warn(
        'Do not force the state to SIGN_IN on Accounts.ui.LoginFormInner, it will make it impossible to reset password in your app, this state is also the default state if logged out, so no need to force it.'
      );
    }

    const currentUser = props.currentUser;

    const resetStoreAndThen = hook => {
      return () => {
        const resetStoreCallback = () => {
          hook();
          removeResetStoreCallback(resetStoreCallback);
        };
        const removeResetStoreCallback = props.client.onResetStore(resetStoreCallback);
        props.client.resetStore();
      };
    };

    const postLogInAndThen = hook => {
      return () => {
        const resetStoreCallback = () => {
          if (Callbacks['users.postlogin']) {
            // execute any post-sign-in callbacks
            runCallbacks('users.postlogin');
          } else {
            // or else execute the hook
            hook();
          }
          removeResetStoreCallback(resetStoreCallback);
        };
        const removeResetStoreCallback = props.client.onResetStore(resetStoreCallback);
        props.client.resetStore();
      };
    };

    const doNothing = () => {};

    const defaultHooks = {
      onPreSignUpHook: props.redirect ? Accounts.ui._options.onPreSignUpHook : doNothing,
      onPostSignUpHook: props.redirect ? Accounts.ui._options.onPostSignUpHook : doNothing,
      onEnrollAccountHook: props.redirect ? Accounts.ui._options.onEnrollAccountHook : doNothing,
      onResetPasswordHook: props.redirect ? Accounts.ui._options.onResetPasswordHook : doNothing,
      onVerifyEmailHook: props.redirect ? Accounts.ui._options.onVerifyEmailHook : doNothing,
      onSignedInHook: props.redirect ? Accounts.ui._options.onSignedInHook : doNothing,
      onSignedOutHook: props.redirect ? Accounts.ui._options.onSignedOutHook : doNothing,
    };

    // Set inital state.
    this.state = {
      email: props.email || '',
      messages: [],
      waiting: false,
      formState: props.formState ? props.formState : currentUser ? STATES.PROFILE : STATES.SIGN_IN,
      onSubmitHook: props.onSubmitHook || Accounts.ui._options.onSubmitHook,
      onSignedInHook: postLogInAndThen(props.onSignedInHook || defaultHooks.onSignedInHook),
      onSignedOutHook: resetStoreAndThen(props.onSignedOutHook || defaultHooks.onSignedOutHook),
      onPreSignUpHook: props.onPreSignUpHook || defaultHooks.onPreSignUpHook,
      onPostSignUpHook: postLogInAndThen(props.onPostSignUpHook || defaultHooks.onPostSignUpHook),
    };
  }

  componentDidMount() {
    let changeState = Session.get(KEY_PREFIX + 'state');
    switch (changeState) {
      case 'enrollAccountToken':
        this.setState(prevState => ({
          formState: STATES.ENROLL_ACCOUNT,
        }));
        Session.set(KEY_PREFIX + 'state', null);
        break;
      case 'resetPasswordToken':
        this.setState(prevState => ({
          formState: STATES.PASSWORD_CHANGE,
        }));
        Session.set(KEY_PREFIX + 'state', null);
        break;

      case 'justVerifiedEmail':
        this.setState(prevState => ({
          formState: STATES.PROFILE,
        }));
        Session.set(KEY_PREFIX + 'state', null);
        break;
    }

    // Add default field values once the form did mount on the client
    this.setState(prevState => ({
      ...this.getDefaultFieldValues(),
    }));

    // if extra fields have been specified, add their default values
    if (this.props.extraFields) {
      this.props.extraFields.forEach(field => {
        this.setState({ [field.id]: field.defaultValue });
      });
    }

    // Listen for the user to login/logout.
    this.autorun(() => {
      // Add the services list to the user.
      this.subscribe('servicesList');
      this.setState({
        currentUser: Accounts.user(),
        waiting: !Accounts.loginServicesConfigured(),
      });
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.formState && nextProps.formState !== this.state.formState) {
      this.setState({
        formState: nextProps.formState,
        ...this.getDefaultFieldValues(),
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (typeof this.props.currentUser !== 'undefined') {
      if (!prevProps.currentUser !== !this.props.currentUser) {
        this.setState({
          formState: this.props.currentUser ? STATES.PROFILE : STATES.SIGN_IN,
        });
      }

      const loggingInMessage = 'accounts.logging_in';

      if (this.state.formState == STATES.PROFILE) {
        if (!this.props.currentUser && this.state.messages.length === 0) {
          // this.showMessage(loggingInMessage); // don't show logging in message for now
        } else if (this.props.currentUser && this.state.messages.find(({ message }) => message === loggingInMessage)) {
          this.clearMessage(loggingInMessage);
        }
      } else if (prevState.formState == STATES.PROFILE && this.state.messages.find(({ message }) => message === loggingInMessage)) {
        this.clearMessage(loggingInMessage);
      }
    } else {
      if (!prevState.currentUser !== !this.state.currentUser) {
        this.setState({
          formState: this.state.currentUser ? STATES.PROFILE : STATES.SIGN_IN,
        });
      }
    }
  }

  validateField(field, value) {
    const { formState } = this.state;
    switch (field) {
      case 'email':
        return validateEmail(value, this.showMessage.bind(this), this.clearMessage.bind(this));
      case 'password':
        return validatePassword(value, this.showMessage.bind(this), this.clearMessage.bind(this));
      case 'username':
        return validateUsername(value, this.showMessage.bind(this), this.clearMessage.bind(this), formState);
    }
  }

  getUsernameOrEmailField() {
    return {
      id: 'usernameOrEmail',
      hint: this.context.intl.formatMessage({ id: 'accounts.enter_username_or_email' }),
      label: this.context.intl.formatMessage({ id: 'accounts.username_or_email' }),
      required: true,
      defaultValue: this.state.currentUsername || '',
      onChange: this.handleChange.bind(this, 'usernameOrEmail'),
      message: this.getMessageForField('usernameOrEmail'),
    };
  }

  getUsernameField() {
    return {
      id: 'username',
      hint: this.context.intl.formatMessage({ id: 'accounts.enter_username' }),
      label: this.context.intl.formatMessage({ id: 'accounts.username' }),
      required: true,
      defaultValue: this.state.currentUsername || '',
      onChange: this.handleChange.bind(this, 'username'),
      message: this.getMessageForField('username'),
    };
  }

  getEmailField() {
    return {
      id: 'email',
      hint: this.context.intl.formatMessage({ id: 'accounts.enter_email' }),
      label: this.context.intl.formatMessage({ id: 'accounts.email' }),
      type: 'email',
      required: true,
      defaultValue: this.state.email || '',
      onChange: this.handleChange.bind(this, 'email'),
      message: this.getMessageForField('email'),
    };
  }

  getPasswordField() {
    return {
      id: 'password',
      hint: this.context.intl.formatMessage({ id: 'accounts.enter_password' }),
      label: this.context.intl.formatMessage({ id: 'accounts.password' }),
      type: 'password',
      required: true,
      defaultValue: this.state.password || '',
      onChange: this.handleChange.bind(this, 'password'),
      message: this.getMessageForField('password'),
    };
  }

  getSetPasswordField() {
    return {
      id: 'newPassword',
      hint: this.context.intl.formatMessage({ id: 'accounts.enter_password' }),
      label: this.context.intl.formatMessage({ id: 'accounts.choose_password' }),
      type: 'password',
      required: true,
      onChange: this.handleChange.bind(this, 'newPassword'),
    };
  }

  getNewPasswordField() {
    return {
      id: 'newPassword',
      hint: this.context.intl.formatMessage({ id: 'accounts.enter_new_password' }),
      label: this.context.intl.formatMessage({ id: 'accounts.new_password' }),
      type: 'password',
      required: true,
      onChange: this.handleChange.bind(this, 'newPassword'),
      message: this.getMessageForField('password'),
    };
  }

  handleChange(field, evt) {
    let value = evt.target.value;
    switch (field) {
      case 'password':
        break;
      default:
        value = value.trim();
        break;
    }
    this.setState({ [field]: value });
    this.setDefaultFieldValues({ [field]: value });
  }

  fields() {
    let loginFields = [];
    const { formState } = this.state;

    // if extra fields have been specified, add onChange handler to them
    if (this.props.extraFields) {
      loginFields = this.props.extraFields.map(field => {
        const { id } = field;
        return {
          ...field,
          onChange: this.handleChange.bind(this, id),
        };
      });
    }

    if (!hasPasswordService() && getLoginServices().length == 0) {
      loginFields.push({
        label: 'No login service added, i.e. accounts-password',
        type: 'notice',
      });
    }

    if (hasPasswordService() && formState == STATES.SIGN_IN) {
      if (_.contains(['USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL'], passwordSignupFields())) {
        loginFields.push(this.getUsernameOrEmailField());
      }

      if (passwordSignupFields() === 'USERNAME_ONLY') {
        loginFields.push(this.getUsernameField());
      }

      if (_.contains(['EMAIL_ONLY'], passwordSignupFields())) {
        loginFields.push(this.getEmailField());
      }

      loginFields.push(this.getPasswordField());
    }

    if (hasPasswordService() && formState == STATES.SIGN_UP) {
      if (_.contains(['USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_ONLY'], passwordSignupFields())) {
        loginFields.push(this.getUsernameField());
      }

      if (_.contains(['USERNAME_AND_EMAIL', 'EMAIL_ONLY'], passwordSignupFields())) {
        loginFields.push(this.getEmailField());
      }

      if (_.contains(['USERNAME_AND_OPTIONAL_EMAIL'], passwordSignupFields())) {
        loginFields.push(Object.assign(this.getEmailField(), { required: false }));
      }

      loginFields.push(this.getPasswordField());
    }

    if (formState == STATES.PASSWORD_RESET) {
      loginFields.push(this.getEmailField());
    }

    if (this.showPasswordChangeForm()) {
      if (Meteor.isClient && !Accounts._loginButtonsSession.get('resetPasswordToken')) {
        loginFields.push(this.getPasswordField());
      }
      loginFields.push(this.getNewPasswordField());
    }

    if (this.showEnrollAccountForm()) {
      loginFields.push(this.getSetPasswordField());
    }

    return _.indexBy(loginFields, 'id');
  }

  buttons() {
    const {
      loginPath = Accounts.ui._options.loginPath,
      signUpPath = Accounts.ui._options.signUpPath,
      resetPasswordPath = Accounts.ui._options.resetPasswordPath,
      changePasswordPath = Accounts.ui._options.changePasswordPath,
      profilePath = Accounts.ui._options.profilePath,
    } = this.props;
    const { formState, waiting } = this.state;
    let loginButtons = [];
    const currentUser = typeof this.props.currentUser !== 'undefined' ? this.props.currentUser : this.state.currentUser;

    if (currentUser && formState == STATES.PROFILE) {
      loginButtons.push({
        id: 'signOut',
        label: this.context.intl.formatMessage({ id: 'accounts.sign_out' }),
        disabled: waiting,
        onClick: this.signOut.bind(this),
      });
    }

    if (this.showCreateAccountLink() && this.props.showSignUpLink) {
      loginButtons.push({
        id: 'switchToSignUp',
        label: this.context.intl.formatMessage({ id: 'accounts.switch_to_sign_up' }) || this.context.intl.formatMessage({ id: 'accounts.sign_up' }),
        type: 'link',
        href: signUpPath,
        onClick: this.switchToSignUp.bind(this),
      });
    }

    if ((formState == STATES.SIGN_UP || formState == STATES.PASSWORD_RESET) && this.props.showSignInLink) {
      loginButtons.push({
        id: 'switchToSignIn',
        label:  this.context.intl.formatMessage({ id: 'accounts.switch_to_sign_in' }) || this.context.intl.formatMessage({ id: 'accounts.sign_in' }),
        type: 'link',
        href: loginPath,
        onClick: this.switchToSignIn.bind(this),
      });
    }

    if (this.showForgotPasswordLink()) {
      loginButtons.push({
        id: 'switchToPasswordReset',
        label: this.context.intl.formatMessage({ id: 'accounts.forgot_password' }),
        type: 'link',
        href: resetPasswordPath,
        onClick: this.switchToPasswordReset.bind(this),
      });
    }

    if (
      currentUser &&
      formState == STATES.PROFILE
      // note: user.services is not published so change password link would never be shown
      // && (currentUser.services && 'password' in currentUser.services)
    ) {
      loginButtons.push({
        id: 'switchToChangePassword',
        label: this.context.intl.formatMessage({ id: 'accounts.change_password' }),
        type: 'link',
        href: changePasswordPath,
        onClick: this.switchToChangePassword.bind(this),
      });
    }

    if (formState == STATES.SIGN_UP) {
      loginButtons.push({
        id: 'signUp',
        label: this.context.intl.formatMessage({ id: 'accounts.sign_up' }),
        type: hasPasswordService() ? 'submit' : 'link',
        className: 'active',
        disabled: waiting,
        onClick: hasPasswordService() ? this.signUp.bind(this, {}) : null,
      });
    }

    if (this.showSignInLink()) {
      loginButtons.push({
        id: 'signIn',
        label: this.context.intl.formatMessage({ id: 'accounts.sign_in' }),
        type: hasPasswordService() ? 'submit' : 'link',
        className: 'active',
        disabled: waiting,
        onClick: hasPasswordService() ? this.signIn.bind(this) : null,
      });
    }

    if (formState == STATES.PASSWORD_RESET) {
      loginButtons.push({
        id: 'emailResetLink',
        label: this.context.intl.formatMessage({ id: 'accounts.reset_your_password' }),
        type: 'submit',
        disabled: waiting,
        onClick: this.passwordReset.bind(this),
      });
    }

    if (this.showPasswordChangeForm() || this.showEnrollAccountForm()) {
      loginButtons.push({
        id: 'changePassword',
        label: this.showPasswordChangeForm()
          ? this.context.intl.formatMessage({ id: 'accounts.change_password' })
          : this.context.intl.formatMessage({ id: 'accounts.set_password' }),
        type: 'submit',
        disabled: waiting,
        onClick: this.passwordChange.bind(this),
      });

      if (currentUser) {
        loginButtons.push({
          id: 'switchToSignOut',
          label: this.context.intl.formatMessage({ id: 'accounts.cancel' }),
          type: 'link',
          href: profilePath,
          onClick: this.switchToSignOut.bind(this),
        });
      } else {
        loginButtons.push({
          id: 'cancelResetPassword',
          label: this.context.intl.formatMessage({ id: 'accounts.cancel' }),
          type: 'link',
          onClick: this.cancelResetPassword.bind(this),
        });
      }
    }

    // Sort the button array so that the submit button always comes first, and
    // buttons should also come before links.
    loginButtons.sort((a, b) => {
      return (b.type == 'submit' && a.type != undefined) - (a.type == 'submit' && b.type != undefined);
    });

    return _.indexBy(loginButtons, 'id');
  }

  showSignInLink() {
    return this.state.formState == STATES.SIGN_IN && Package['accounts-password'];
  }

  showPasswordChangeForm() {
    return Package['accounts-password'] && this.state.formState == STATES.PASSWORD_CHANGE;
  }

  showEnrollAccountForm() {
    return Package['accounts-password'] && this.state.formState == STATES.ENROLL_ACCOUNT;
  }

  showCreateAccountLink() {
    return this.state.formState == STATES.SIGN_IN && !Accounts._options.forbidClientAccountCreation && Package['accounts-password'];
  }

  showForgotPasswordLink() {
    return (
      this.state.formState == STATES.SIGN_IN &&
      hasPasswordService() &&
      _.contains(['USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'EMAIL_ONLY'], passwordSignupFields())
    );
  }

  /**
   * Helper to store field values while using the form.
   */
  setDefaultFieldValues(defaults) {
    if (typeof defaults !== 'object') {
      throw new Error('Argument to setDefaultFieldValues is not of type object');
    } else if (typeof localStorage !== 'undefined' && localStorage) {
      localStorage.setItem(
        'accounts_ui',
        JSON.stringify({
          passwordSignupFields: passwordSignupFields(),
          ...this.getDefaultFieldValues(),
          ...defaults,
        })
      );
    }
  }

  /**
   * Helper to get field values when switching states in the form.
   */
  getDefaultFieldValues() {
    if (typeof localStorage !== 'undefined' && localStorage) {
      const defaultFieldValues = JSON.parse(localStorage.getItem('accounts_ui') || null);
      if (defaultFieldValues && defaultFieldValues.passwordSignupFields === passwordSignupFields()) {
        return defaultFieldValues;
      }
    }
  }

  /**
   * Helper to clear field values when signing in, up or out.
   */
  clearDefaultFieldValues() {
    if (typeof localStorage !== 'undefined' && localStorage) {
      localStorage.removeItem('accounts_ui');
    }
  }

  switchToSignUp(event) {
    event.preventDefault();
    this.props.handlers.switchToSignUp();
    // this.setState({
    //   formState: STATES.SIGN_UP,
    //   ...this.getDefaultFieldValues(),
    // });
    this.clearMessages();
  }

  switchToSignIn(event) {
    event.preventDefault();
    this.props.handlers.switchToSignIn();
    // this.setState({
    //   formState: STATES.SIGN_IN,
    //   ...this.getDefaultFieldValues(),
    // });
    this.clearMessages();
  }

  switchToPasswordReset(event) {
    event.preventDefault();
    this.props.handlers.switchToPasswordReset();
    // this.setState({
    //   formState: STATES.PASSWORD_RESET,
    //   ...this.getDefaultFieldValues(),
    // });
    this.clearMessages();
  }

  switchToChangePassword(event) {
    event.preventDefault();
    this.props.handlers.switchToChangePassword();
    // this.setState({
    //   formState: STATES.PASSWORD_CHANGE,
    //   ...this.getDefaultFieldValues(),
    // });
    this.clearMessages();
  }

  switchToSignOut(event) {
    event.preventDefault();
    this.props.handlers.switchToSignOut();
    // this.setState({
    //   formState: STATES.PROFILE,
    // });
    this.clearMessages();
  }

  cancelResetPassword(event) {
    event.preventDefault();
    this.props.handlers.cancelResetPassword();
    // Accounts._loginButtonsSession.set('resetPasswordToken', null);
    // this.setState({
    //   formState: STATES.SIGN_IN,
    //   messages: [],
    // });
    this.clearMessages();
  }

  signOut() {
    Meteor.logout(() => {
      this.props.handlers.switchToSignIn();
      // this.setState({
      //   formState: STATES.SIGN_IN,
      //   password: null,
      // });
      this.state.onSignedOutHook();
      this.clearMessages();
      this.clearDefaultFieldValues();
    });
  }

  signIn() {
    const { username = null, email = null, usernameOrEmail = null, password, formState, onSubmitHook } = this.state;
    let error = false;
    let loginSelector;
    this.clearMessages();

    const self = this;

    if (usernameOrEmail !== null) {
      if (!this.validateField('username', usernameOrEmail)) {
        if (this.state.formState == STATES.SIGN_UP) {
          this.state.onSubmitHook('error.accounts.usernameRequired', this.state.formState);
        }
        error = true;
      } else {
        loginSelector = usernameOrEmail;
      }
    } else if (username !== null) {
      if (!this.validateField('username', username)) {
        if (this.state.formState == STATES.SIGN_UP) {
          this.state.onSubmitHook('error.accounts.usernameRequired', this.state.formState);
        }
        error = true;
      } else {
        loginSelector = { username: username };
      }
    } else if (usernameOrEmail == null) {
      if (!this.validateField('email', email)) {
        error = true;
      } else {
        loginSelector = { email };
      }
    }
    if (!this.validateField('password', password)) {
      error = true;
    }

    if (!error) {
      Meteor.loginWithPassword(loginSelector, password, (error, result) => {
        onSubmitHook(error, formState);
        if (error) {
          // eslint-disable-next-line no-console
          console.log(error);
          const errorId = `accounts.error_${error.reason.toLowerCase().replace(/ /g, '_')}`;
          if (this.context.intl.formatMessage({ id: errorId })) {
            self.showMessage(errorId);
          } else {
            self.showMessage('accounts.error_unknown');
          }
        } else {
          loginResultCallback(() => this.state.onSignedInHook(this.props));
          self.props.handlers.switchToProfile();
          // this.setState({
          //   formState: STATES.PROFILE,
          //   password: null,
          // });
          self.clearDefaultFieldValues();
        }
      });
    }
  }

  oauthButtons() {
    const { formState, waiting } = this.state;
    let oauthButtons = [];
    if (formState == STATES.SIGN_IN || formState == STATES.SIGN_UP) {
      if (Accounts.oauth) {
        Accounts.oauth.serviceNames().map(service => {
          oauthButtons.push({
            id: service,
            label: capitalize(service),
            disabled: waiting,
            type: 'button',
            className: `btn-${service} ${service}`,
            onClick: this.oauthSignIn.bind(this, service),
          });
        });
      }
    }
    return _.indexBy(oauthButtons, 'id');
  }

  oauthSignIn(serviceName) {
    const { formState, /* waiting, currentUser, */ onSubmitHook } = this.state;

    const self = this;

    //Thanks Josh Owens for this one.
    function capitalService() {
      return serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
    }

    if (serviceName === 'meteor-developer') {
      serviceName = 'meteorDeveloperAccount';
    }

    const loginWithService = Meteor['loginWith' + capitalService()];

    let options = {}; // use default scope unless specified
    if (Accounts.ui._options.requestPermissions[serviceName])
      options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];
    if (Accounts.ui._options.requestOfflineToken[serviceName])
      options.requestOfflineToken = Accounts.ui._options.requestOfflineToken[serviceName];
    if (Accounts.ui._options.forceApprovalPrompt[serviceName])
      options.forceApprovalPrompt = Accounts.ui._options.forceApprovalPrompt[serviceName];

    this.clearMessages();
    loginWithService(options, error => {
      onSubmitHook(error, formState);
      if (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        if (error instanceof Accounts.LoginCancelledError) {
          // do nothing
        } else {
          const errorId = `accounts.error_${error.message.toLowerCase().replace(/ /g, '_')}`;
          if (self.context.intl.formatMessage({ id: errorId })) {
            self.showMessage(errorId);
          } else {
            self.showMessage('accounts.error_unknown');
          }
        }
      } else {
        self.props.handlers.switchToProfile();
        // this.setState({ formState: STATES.PROFILE });
        self.clearDefaultFieldValues();
        loginResultCallback(() => {
          Meteor.setTimeout(() => this.state.onSignedInHook(this.props), 10);
        });
      }
    });
  }

  /**
   * Do NOT try to rewrite using GraphQL calls instead of Meteor methods
   * This would break all Meteor related code
   * If you want a form that uses GraphQL calls instead, duplicate this component or refactor
   * so custom methods can be provided. However the version with Meteor methods must be kept.
   */
  signUp(options = {}) {
    const {
      username = null,
      email = null,
      // usernameOrEmail = null,
      password,
      formState,
      onSubmitHook,
    } = this.state;

    // add extra fields to options
    if (this.props.extraFields) {
      this.props.extraFields.forEach(({ id }) => {
        options[id] = this.state[id];
      });
    }

    const self = this;

    let error = false;
    this.clearMessages();

    if (username !== null) {
      if (!this.validateField('username', username)) {
        if (this.state.formState == STATES.SIGN_UP) {
          this.state.onSubmitHook('error.accounts.usernameRequired', this.state.formState);
        }
        error = true;
      } else {
        options.username = username;
      }
    } else {
      if (_.contains(['USERNAME_AND_EMAIL'], passwordSignupFields()) && !this.validateField('username', username)) {
        if (this.state.formState == STATES.SIGN_UP) {
          this.state.onSubmitHook('error.accounts.usernameRequired', this.state.formState);
        }
        error = true;
      }
    }

    if (!this.validateField('email', email)) {
      error = true;
    } else {
      options.email = email;
    }

    if (!this.validateField('password', password)) {
      onSubmitHook('Invalid password', formState);
      error = true;
    } else {
      options.password = password;
    }

    // set the signup locale
    options.locale = this.context.intl.locale;

    const SignUp = function(_options) {
      Accounts.createUser(_options, error => {
        self.setState({ waiting: false });

        if (error) {
          // eslint-disable-next-line no-console
          console.log(error);

          const errorId = `accounts.error_${error.reason
            .toLowerCase()
            .replace(/ /g, '_')
            .replace('.', '')}`;

          if (self.context.intl.formatMessage({ id: errorId })) {
            self.showMessage(errorId, 'error');
          } else {
            self.showMessage('accounts.error_unknown', 'error');
          }

          if (self.context.intl.formatMessage({ id: `error.accounts_${error.reason}` })) {
            onSubmitHook(`error.accounts.${error.reason}`, formState);
          } else {
            onSubmitHook('Unknown error', formState);
          }
        } else {
          onSubmitHook(null, formState);
          self.props.handlers.switchToProfile();
          self.clearDefaultFieldValues();
          // self.setState({ formState: STATES.PROFILE, password: null });
          let currentUser = Accounts.user();
          loginResultCallback(self.state.onPostSignUpHook.bind(self, _options, currentUser));
        }
      });
    };
    if (!error) {
      this.setState({ waiting: true });
      // Allow for Promises to return.
      let promise = this.state.onPreSignUpHook(options);
      if (promise instanceof Promise) {
        promise.then(SignUp.bind(this, options));
      } else {
        // eslint-disable-next-line babel/new-cap
        SignUp(options);
      }
    }
  }

  passwordReset() {
    const { email = '', waiting, formState, onSubmitHook } = this.state;

    if (waiting) {
      return;
    }

    this.clearMessages();

    if (this.validateField('email', email)) {
      this.setState({ waiting: true });

      Accounts.forgotPassword({ email: email }, error => {
        // eslint-disable-next-line no-console
        console.log(error);
        if (error) {
          const errorId = `accounts.error_${error.reason.toLowerCase().replace(/ /g, '_')}`;
          this.showMessage(errorId, 'error');
        } else {
          this.showMessage('accounts.info_email_sent', 'success', 5000);
          this.clearDefaultFieldValues();
        }
        onSubmitHook(error, formState);
        this.setState({ waiting: false });
      });
    }
  }

  passwordChange() {
    const { password, newPassword, formState, onSubmitHook, onSignedInHook } = this.state;

    this.clearMessages();

    if (!this.validateField('password', newPassword)) {
      onSubmitHook('err.minChar', formState);
      return;
    }

    let token = Accounts._loginButtonsSession.get('resetPasswordToken');
    if (!token) {
      token = Accounts._loginButtonsSession.get('enrollAccountToken');
    }
    if (token) {
      Accounts.resetPassword(token, newPassword, error => {
        if (error) {
          const errorId = `accounts.error_${error.reason.toLowerCase().replace(/ /g, '_')}`;
          this.showMessage(errorId, 'error');
          onSubmitHook(error, formState);
        } else {
          this.showMessage('accounts.info_password_changed', 'success', 5000);
          onSubmitHook(null, formState);
          this.props.handlers.switchToProfile();
          // this.setState({ formState: STATES.PROFILE });
          Accounts._loginButtonsSession.set('resetPasswordToken', null);
          Accounts._loginButtonsSession.set('enrollAccountToken', null);
          onSignedInHook();
        }
      });
    } else {
      Accounts.changePassword(password, newPassword, error => {
        if (error) {
          const errorId = `accounts.error_${error.reason.toLowerCase().replace(/ /g, '_')}`;
          this.showMessage(errorId, 'error');
          onSubmitHook(error, formState);
        } else {
          this.showMessage('accounts.info_password_changed', 'success', 5000);
          onSubmitHook(null, formState);
          this.props.handlers.switchToProfile();
          // this.setState({ formState: STATES.PROFILE });
          this.clearDefaultFieldValues();
        }
      });
    }
  }

  showMessage(messageId, type, clearTimeout, field) {
    if (messageId) {
      this.setState(({ messages = [] }) => {
        messages.push({
          message: this.context.intl.formatMessage({ id: messageId }),
          type,
          ...(field && { field }),
        });
        return { messages };
      });
      if (clearTimeout) {
        this.hideMessageTimout = setTimeout(() => {
          // Filter out the message that timed out.
          this.clearMessage(messageId);
        }, clearTimeout);
      }
    }
  }

  getMessageForField(field) {
    const { messages = [] } = this.state;
    return messages.find(({ field: key }) => key === field);
  }

  clearMessage(message) {
    if (message) {
      this.setState(({ messages = [] }) => ({
        messages: messages.filter(({ message: a }) => a !== message),
      }));
    }
  }

  clearMessages() {
    if (this.hideMessageTimout) {
      clearTimeout(this.hideMessageTimout);
    }
    this.setState({ messages: [] });
  }

  componentWillUnmount() {
    if (this.hideMessageTimout) {
      clearTimeout(this.hideMessageTimout);
    }
  }

  render() {
    this.oauthButtons();
    // Backwords compatibility with v1.2.x.
    const { messages = [] } = this.state;
    const message = {
      deprecated: true,
      message: messages.map(({ message }) => message).join(', '),
    };

    return (
      <Components.AccountsForm
        oauthServices={this.oauthButtons()}
        fields={this.fields()}
        buttons={this.buttons()}
        {...this.state}
        message={message}
      />
    );
  }
}

AccountsLoginFormInner.propTypes = {
  showSignInLink: PropTypes.bool,
  showSignUpLink: PropTypes.bool,
};

AccountsLoginFormInner.defaultProps = {
  showSignInLink: true,
  showSignUpLink: true,
  redirect: true,
};

AccountsLoginFormInner.contextTypes = {
  intl: intlShape,
};

registerComponent('AccountsLoginFormInner', AccountsLoginFormInner, withCurrentUser, withApollo);
