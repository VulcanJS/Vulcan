import Telescope from './config.js';

import './utils.js';
import './callbacks.js';
import './settings.js';
import './collections.js';
import './deep.js';
import './deep_extend.js';
import './intl-polyfill.js';
import './graphql.js';
import './icons.js';

export { Components, registerComponent, replaceComponent, getRawComponent, getComponent, copyHoCs } from './components.js';
export { createCollection } from './collections.js';
export { Callbacks, addCallback, removeCallbacks, runCallbacks, runCallbacksAsync } from './callbacks.js';

export default Telescope;