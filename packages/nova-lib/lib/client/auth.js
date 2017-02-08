import cookie from 'react-cookie';

import { Meteor } from 'meteor/meteor';

import { getRenderContext } from './render_context.js';

const context = getRenderContext();

function setToken(loginToken, expires) {
  if (loginToken && expires !== -1) {
    cookie.save('meteor_login_token', loginToken, {
      path: '/',
      expires,
    });
  } else {
    cookie.remove('meteor_login_token', {
      path: '/',
    });
  }
}

function resetToken() {
  const loginToken = global.localStorage['Meteor.loginToken'];
  const loginTokenExpires = new Date(global.localStorage['Meteor.loginTokenExpires']);

  if (loginToken) {
    setToken(loginToken, loginTokenExpires);
  } else {
    setToken(null, -1);
  }

  context.loginToken = loginToken;
}

Meteor.startup(() => {
  resetToken();
});

const originalSetItem = Meteor._localStorage.setItem;
Meteor._localStorage.setItem = function setItem(key, value) {
  if (key === 'Meteor.loginToken') {
    Meteor.defer(resetToken);
  }
  originalSetItem.call(Meteor._localStorage, key, value);
};

const originalRemoveItem = Meteor._localStorage.removeItem;
Meteor._localStorage.removeItem = function removeItem(key) {
  if (key === 'Meteor.loginToken') {
    Meteor.defer(resetToken);
  }
  originalRemoveItem.call(Meteor._localStorage, key);
};
