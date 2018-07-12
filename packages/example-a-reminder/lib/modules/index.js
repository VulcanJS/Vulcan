import { replaceComponent } from 'meteor/vulcan:core';
import './reminders/collection.js';
// components
import Layout from "../components/common/Layout.jsx";

replaceComponent('Layout', Layout);

// routes
import "../routes.jsx";
