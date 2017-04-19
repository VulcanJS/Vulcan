import { addRoute, getComponent } from 'meteor/vulcan:core';

addRoute({name: "calendar", path: "/calendar", component: getComponent("CalendarPage")});
