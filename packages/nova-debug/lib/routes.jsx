import React from 'react';
import Router from './router.js'
import {mount} from 'react-mounter';

import Cheatsheet from './components/Cheatsheet.jsx';
import Settings from './components/Settings.jsx';
import Emails from './components/Emails.jsx';

Router.route('/cheatsheet', {
  name: 'cheatsheet',
  action() {
    mount(Telescope.components.App, {content: <Cheatsheet/>});
  }
});

Router.route('/settings', {
  name: 'settings',
  action() {
    mount(Telescope.components.App, {content: <Settings/>});
  }
});

Router.route('/emails', {
  name: 'emails',
  action() {
    mount(Telescope.components.App, {content: <Emails/>});
  }
});