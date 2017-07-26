import { addRoute } from 'meteor/vulcan:core';

import PicsList from '../components/pics/PicsList.jsx';

addRoute({ name: 'home', path: '/', component: PicsList });
