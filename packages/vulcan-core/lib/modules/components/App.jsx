import {
  Components,
  registerComponent,
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
    this.state = {
      locale: getSetting('locale', 'en')
    }
  }

  getLocale = () => {
    return this.state.locale;
  }

  setLocale = (locale) => {
    this.setState({ locale });
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
      getLocale: this.getLocale,
      setLocale: this.setLocale,
    };
  }

  componentWillUpdate(nextProps) {
    if (!this.props.currentUser && nextProps.currentUser) {
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
        <div className={`locale-${this.getLocale()}`}>
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
  setLocale: PropTypes.func,
  getLocale: PropTypes.func,
};

App.displayName = 'App';

registerComponent('App', App, withCurrentUser);

export default App;
