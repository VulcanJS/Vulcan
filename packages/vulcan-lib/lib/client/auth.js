/**
 * Manage meteor_login_token cookie
 * Necessary for authentication when the
 * Authorization header is not set
 *
 * E.g on first page loading
 */
import Cookies from 'universal-cookie';

import { Meteor } from 'meteor/meteor';

const cookie = new Cookies();

function setToken(loginToken, expires) {
  if (loginToken && expires !== -1) {
    cookie.set('meteor_login_token', loginToken, {
      path: '/',
      expires,
      sameSite: 'lax',
      secure: document.domain !== 'localhost',
    });
  } else {
    cookie.remove('meteor_login_token', {
      path: '/',
    });
  }
}

function initToken() {
  const loginToken = global.localStorage['Meteor.loginToken'];
  const loginTokenExpires = new Date(global.localStorage['Meteor.loginTokenExpires']);

  if (loginToken) {
    setToken(loginToken, loginTokenExpires);
  } else {
    setToken(null, -1);
  }
}

Meteor.startup(() => {
  initToken();
});

// TODO: cleanup
// This part of the code overrides the default localStorage function,
// so that when Meteor.loginToken is set, it is also automatically
// stored as a cookie (necessary for SSR to work as expected for all HTTP requests)
const originalSetItem = Meteor._localStorage.setItem;
Meteor._localStorage.setItem = function setItem(key, value) {
  if (key === 'Meteor.loginToken') {
    Meteor.defer(initToken);
  }
  originalSetItem.call(Meteor._localStorage, key, value);
};
const originalRemoveItem = Meteor._localStorage.removeItem;
Meteor._localStorage.removeItem = function removeItem(key) {
  if (key === 'Meteor.loginToken') {
    Meteor.defer(initToken);
  }
  originalRemoveItem.call(Meteor._localStorage, key);
};
