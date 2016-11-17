import Telescope from 'meteor/nova:lib';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const AppLoading = () => <p><FormattedMessage id="app.loading"/></p>

AppLoading.displayName = "AppLoading";

Telescope.registerComponent('AppLoading', AppLoading);