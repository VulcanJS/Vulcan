/*
A new custom route for our custom page. 
Browse to http://localhost:3000/my-custom-route to see it.
*/

import { addRoute } from 'meteor/nova:core';

addRoute({name: "myCustomRoute", path: "/my-custom-route", componentName: "MyCustomPage"});
