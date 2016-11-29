/*
A new custom route for our custom page. 
Browse to http://localhost:3000/my-custom-route to see it.
*/

import Telescope from 'meteor/nova:lib';
import MyCustomPage from './components/MyCustomPage.jsx';

Telescope.routes.add({name:"myCustomRoute", path:"/my-custom-route", component:MyCustomPage});
