/**
 * Use this decorator to setup Bootstrap
 */
import React from 'react'

import 'meteor/vulcan:ui-bootstrap/lib/stylesheets/bootstrap.min.css';
import 'meteor/vulcan:ui-bootstrap/lib/stylesheets/style.scss';
import 'meteor/vulcan:ui-bootstrap/lib/stylesheets/datetime.scss';

// load UI components
import 'meteor/vulcan:ui-bootstrap/lib/modules/components.js';

export default  storyFn => (<div>{storyFn()}</div>)