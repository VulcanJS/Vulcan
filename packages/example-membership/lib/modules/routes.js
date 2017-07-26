import { addRoute } from 'meteor/vulcan:core';

import PicsHome from '../components/pics/PicsHome.jsx';

addRoute({ name: 'home', path: '/', component: PicsHome });
