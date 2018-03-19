import { addRoute, getDynamicComponent } from 'meteor/vulcan:core';
import React from 'react';

addRoute({ name: 'admin', path: '/admin', component: () => getDynamicComponent(import('../components/AdminHome.jsx'))});
