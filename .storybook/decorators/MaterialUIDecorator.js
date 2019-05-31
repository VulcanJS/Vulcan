/*

Use this decorator to load Material UI

*/
import { Components } from 'meteor/vulcan:lib';
// load UI components
import React from 'react'
import 'meteor/vulcan:ui-material/lib/modules/components.js';
import { wrapWithMuiTheme } from 'meteor/vulcan:ui-material';


export default  storyFn => (
  <Components.ThemeProvider>
    <div>{storyFn()}</div>
  </Components.ThemeProvider>
)
