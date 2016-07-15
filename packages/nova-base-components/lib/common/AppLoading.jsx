import React from 'react';
import { FormattedMessage } from 'react-intl';

const AppLoading = () => <p><FormattedMessage id="app.loading"/></p>

AppLoading.displayName = "AppLoading";

module.exports = AppLoading;
export default AppLoading;