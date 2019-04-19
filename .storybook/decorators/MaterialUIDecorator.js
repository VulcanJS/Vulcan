/*

Use this decorator to load Material UI

*/
// load UI components
import React from 'react'
import 'meteor/vulcan:ui-material/lib/modules/components.js';

export default  storyFn => (<div>{storyFn()}</div>)