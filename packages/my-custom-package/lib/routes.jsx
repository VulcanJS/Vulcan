/*
A new custom route for our custom page. 
Browse to http://localhost:3000/my-custom-route to see it.
*/

import React from 'react';
import {mount} from 'react-mounter';

import MyCustomPage from './components/MyCustomPage.jsx';

FlowRouter.route('/my-custom-route', {
  name: 'myCustomRoute',
  action(params, queryParams) {

    mount(Telescope.components.App, {content: <MyCustomPage />})
  }
});