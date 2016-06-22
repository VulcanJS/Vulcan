// IMPORTANT
// ---------
// This is an auto generated file with React CDK.
// Do not modify this file.

import { configure, setAddon } from '@kadira/storybook'
import addStoriesGroup from 'react-storybook-addon-add-stories-group'

setAddon(addStoriesGroup)
function loadStories() {
  require('../lib/stories.js')
}

configure(loadStories, module)
