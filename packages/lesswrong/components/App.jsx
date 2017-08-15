import { Components, replaceComponent, Strings, getRawComponent } from 'meteor/vulcan:lib';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider} from 'meteor/vulcan:i18n';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const muiTheme = getMuiTheme({
  "fontFamily": "ETBook",
  "palette": {
    "primary1Color": "#f5f5f5",
    "accent1Color": "#43a047",
    "primary2Color": "#eeeeee",
    "accent2Color": "#81c784",
    "accent3Color": "#c8e6c9",
    "pickerHeaderColor": "#4caf50"
  },
  "appBar": {
    "textColor": "rgba(0, 0, 0, 0.54)"
  },
  "datePicker": {
    "color": "rgba(0,0,0,0.54)",
    "selectTextColor": "rgba(0,0,0,0.54)",
  },
  "flatButton": {
    "primaryTextColor": "rgba(0,0,0,0.54)"
  }
});

class App extends getRawComponent('App') {
  render() {

    const currentRoute = _.last(this.props.routes);
    const LayoutComponent = currentRoute.layoutName ? Components[currentRoute.layoutName] : Components.Layout;

    return (
      <IntlProvider locale={this.getLocale()} messages={Strings[this.getLocale()]}>
        <div>
          {/* Theme Provider for Material UI */}
          <MuiThemeProvider muiTheme={muiTheme}>
            <div>
              <Components.HeadTags />
              <LayoutComponent {...this.props} currentRoute={currentRoute}>
                { this.props.currentUserLoading ? <Components.Loading /> : this.props.children }
              </LayoutComponent>
            </div>
          </MuiThemeProvider>
        </div>
      </IntlProvider>
    );
  }
}

replaceComponent('App', App);
