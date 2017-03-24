let browserHistory
try { browserHistory = require('react-router').browserHistory } catch(e) {}
export const loginButtonsSession = Accounts._loginButtonsSession;
export const STATES = {
  SIGN_IN: Symbol('SIGN_IN'),
  SIGN_UP: Symbol('SIGN_UP'),
  PROFILE: Symbol('PROFILE'),
  PASSWORD_CHANGE: Symbol('PASSWORD_CHANGE'),
  PASSWORD_RESET: Symbol('PASSWORD_RESET'),
  ENROLL_ACCOUNT: Symbol('ENROLL_ACCOUNT')
};

export function getLoginServices() {
  // First look for OAuth services.
  const services = Package['accounts-oauth'] ? Accounts.oauth.serviceNames() : [];

  // Be equally kind to all login services. This also preserves
  // backwards-compatibility.
  services.sort();

  return _.map(services, function(name){
    return {name: name};
  });
};
// Export getLoginServices using old style globals for accounts-base which
// requires it.
this.getLoginServices = getLoginServices;

export function hasPasswordService() {
  // First look for OAuth services.
  return !!Package['accounts-password'];
};

export function loginResultCallback(service, err) {
  if (!err) {

  } else if (err instanceof Accounts.LoginCancelledError) {
    // do nothing
  } else if (err instanceof ServiceConfiguration.ConfigError) {

  } else {
    //loginButtonsSession.errorMessage(err.reason || "Unknown error");
  }

  if (Meteor.isClient) {
    if (typeof redirect === 'string'){
      window.location.href = '/';
    }

    if (typeof service === 'function'){
      service();
    }
  }
};

export function passwordSignupFields() {
  return Accounts.ui._options.passwordSignupFields || "USERNAME_AND_EMAIL";
};

export function validateEmail(email, showMessage, clearMessage) {
  if (passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL" && email === '') {
    return true;
  }
  if (Accounts.ui._options.emailPattern.test(email)) {
    return true;
  } else if (!email || email.length === 0) {
    showMessage("accounts.error_email_required", 'warning', false, 'email');
    return false;
  } else {
    showMessage("accounts.error_invalid_email", 'warning', false, 'email');
    return false;
  }
}

export function validatePassword(password = '', showMessage, clearMessage){
  if (password.length >= Accounts.ui._options.minimumPasswordLength) {
    return true;
  } else {
    const errMsg = "accounts.error_minchar"
    showMessage(errMsg, 'warning', false, 'password');
    return false;
  }
};

export function validateUsername(username, showMessage, clearMessage, formState) {
  if ( username ) {
    return true;
  } else {
    const fieldName = (passwordSignupFields() === 'USERNAME_ONLY' || formState === STATES.SIGN_UP) ? 'username' : 'usernameOrEmail';
    showMessage("accounts.error_username_required", 'warning', false, fieldName);
    return false;
  }
}

export function redirect(redirect) {
  if (Meteor.isClient) {
    if (window.history) {
      // Run after all app specific redirects, i.e. to the login screen.
      Meteor.setTimeout(() => {
        if (Package['kadira:flow-router']) {
          Package['kadira:flow-router'].FlowRouter.go(redirect);
        } else if (Package['kadira:flow-router-ssr']) {
          Package['kadira:flow-router-ssr'].FlowRouter.go(redirect);
        } else if (browserHistory) {
          browserHistory.push(redirect);
        } else {
          window.history.pushState( {} , 'redirect', redirect );
        }
      }, 100);
    }
  }
}

export function capitalize(string) {
  return string.replace(/\-/, ' ').split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}
