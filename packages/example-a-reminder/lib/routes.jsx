import { addRoute, getComponent } from 'meteor/vulcan:core';

addRoute({name:'Layout', path: '/', component: getComponent("Layout")});
