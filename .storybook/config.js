/**
 * Global configuration of the stories
 */
import { addDecorator, configure } from '@storybook/react';

// init UI using a Decorator
import BootstrapDecorator from './decorators/BootstrapDecorator'
addDecorator(BootstrapDecorator)
// Uncomment to activate material UI instead
// import MaterialUIDecorator from './decorators/MaterialUIDecorator'
// addDecorator(MaterialUIDecorator)

import onStorybookStart from "./startup"
onStorybookStart(() => console.log("Storybook started"))
// load the components in the app so that <Component.Whatever /> is defined
import { populateComponentsApp, initializeFragments } from 'meteor/vulcan:lib';
onStorybookStart(() => {
  // we need registered fragments to be initialized because populateComponentsApp will run
  // hocs, like withUpdate, that rely on fragments
  initializeFragments();
  // actually fills the Components object
  populateComponentsApp();
})

/*

Standard Config

*/
// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

/*

React Router Config
See https://github.com/gvaldambrini/storybook-router/tree/master/packages/react

*/
import StoryRouter from 'storybook-react-router';
addDecorator(StoryRouter());

/*

Vulcan core Components

*/

import 'meteor/vulcan:core'

/*

i18n

See https://github.com/truffls/storybook-addon-intl

*/

import { setIntlConfig, withIntl } from 'storybook-addon-intl';
import { addLocaleData } from 'react-intl';
import { Strings, Locales } from './helpers.js';

const getMessages = locale => Strings[locale];

/*

En

*/
import enLocaleData from 'react-intl/locale-data/en';
addLocaleData(enLocaleData);
//import 'EnUS';

// Set intl configuration
setIntlConfig({
  locales: Locales.map(locale => locale.id),
  defaultLocale: 'en',
  getMessages,
});

// Register decorator
addDecorator(withIntl);

// Run storybook
configure(loadStories, module);
