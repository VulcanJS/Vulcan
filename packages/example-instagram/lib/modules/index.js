import { replaceComponent } from 'meteor/vulcan:core';
import './pics/collection.js';
import './comments/collection.js';

import Layout from '../components/common/Layout.jsx';
replaceComponent('Layout', Layout);

import './routes.js';
import './icons.js';
