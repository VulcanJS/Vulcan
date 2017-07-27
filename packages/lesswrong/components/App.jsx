import { Components, replaceComponent, Strings, getRawComponent } from 'meteor/vulcan:lib';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider} from 'meteor/vulcan:i18n';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends getRawComponent('App') {
  render() {

    const currentRoute = _.last(this.props.routes);
    const LayoutComponent = currentRoute.layoutName ? Components[currentRoute.layoutName] : Components.Layout;

    return (
      <IntlProvider locale={this.getLocale()} messages={Strings[this.getLocale()]}>
        <div>
          {/* Theme Provider for Material UI */}
          <MuiThemeProvider>
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
