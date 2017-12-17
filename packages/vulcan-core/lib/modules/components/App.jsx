import {
  Components,
  registerComponent,
  registerSetting,
  getSetting,
  Strings,
  runCallbacks,
} from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider, intlShape } from 'meteor/vulcan:i18n';
import withCurrentUser from '../containers/withCurrentUser.js';

class App extends PureComponent {
  constructor(props) {
    super(props);
    if (props.currentUser) {
      runCallbacks('events.identify', props.currentUser);
    }
  }

  getLocale() {
    return getSetting('locale', 'en');
  }

  getChildContext() {
    const messages = Strings[this.getLocale()] || {};
    const intlProvider = new IntlProvider(
      { locale: this.getLocale() },
      messages
    );
    const { intl } = intlProvider.getChildContext();
    return {
      intl: intl,
    };
  }

  componentWillUpdate(nextProps) {
    if (nextProps.currentUser) {
      runCallbacks('events.identify', nextProps.currentUser);
    }
  }

  render() {
    const currentRoute = _.last(this.props.routes);
    const LayoutComponent = currentRoute.layoutName
      ? Components[currentRoute.layoutName]
      : Components.Layout;

    return (
      <IntlProvider
        locale={this.getLocale()}
        messages={Strings[this.getLocale()]}
      >
        <div>
          <Components.HeadTags />
          <Components.RouterHook currentRoute={currentRoute} />
          <LayoutComponent {...this.props} currentRoute={currentRoute}>
            {this.props.currentUserLoading ? (
              <Components.Loading />
            ) : this.props.children ? (
              this.props.children
            ) : (
              <Components.Welcome />
            )}
          </LayoutComponent>
        </div>
      </IntlProvider>
    );
  }
}

App.propTypes = {
  currentUserLoading: PropTypes.bool,
};

App.childContextTypes = {
  intl: intlShape,
};

App.displayName = 'App';

registerComponent('App', App, withCurrentUser);

export default App;
