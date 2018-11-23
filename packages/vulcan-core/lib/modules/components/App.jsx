import {
  Components,
  registerComponent,
  getSetting,
  Strings,
  runCallbacks,
  detectLocale,
  hasIntlFields,
} from 'meteor/vulcan:lib';
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider, intlShape } from 'meteor/vulcan:i18n';
import withCurrentUser from '../containers/withCurrentUser.js';
import withUpdate from '../containers/withUpdate.js';
import { withApollo } from 'react-apollo';
import { withCookies } from 'react-cookie';
import moment from 'moment';

const DummyErrorCatcher = ({ children }) => children;

class App extends PureComponent {
  constructor(props) {
    super(props);
    if (props.currentUser) {
      runCallbacks('events.identify', props.currentUser);
    }
    const { locale, localeMethod } = this.initLocale();
    this.state = { locale, localeMethod };
    moment.locale(locale);
  }

  initLocale = () => {
    let userLocale = '';
    let localeMethod = '';
    const { currentUser, cookies, locale } = this.props;
    const availableLocales = Object.keys(Strings);
    const detectedLocale = detectLocale();

    if (locale) {
      // 1. locale is passed through SSR process
      // TODO: currently SSR locale is passed through cookies as a hack
      userLocale = locale;
      localeMethod = 'SSR';
    } else if (cookies && cookies.get('locale')) {
      // 2. look for a cookie
      userLocale = cookies.get('locale');
      localeMethod = 'cookie';
    } else if (currentUser && currentUser.locale) {
      // 3. if user is logged in, check for their preferred locale
      userLocale = currentUser.locale;
      localeMethod = 'user';
    } else if (detectedLocale) {
      // 4. else, check for browser settings
      userLocale = detectedLocale;
      localeMethod = 'browser';
    }
    // if user locale is available, use it; else compare first two chars
    // of user locale with first two chars of available locales
    const availableLocale = Strings[userLocale]
      ? userLocale
      : availableLocales.find(locale => locale.slice(0, 2) === userLocale.slice(0, 2));

    // 4. if user-defined locale is available, use it; else default to setting or `en-US`
    if (availableLocale) {
      return { locale: availableLocale, localeMethod };
    } else {
      return { locale: getSetting('locale', 'en-US'), localeMethod: 'setting' };
    }
  };

  getLocale = truncate => {
    return truncate ? this.state.locale.slice(0, 2) : this.state.locale;
  };

  setLocale = async locale => {
    const { cookies, updateUser, client, currentUser } = this.props;
    this.setState({ locale });
    cookies.remove('locale', { path: '/' });
    cookies.set('locale', locale, { path: '/' });
    // if user is logged in, change their `locale` profile property
    if (currentUser) {
      await updateUser({ selector: { documentId: currentUser._id }, data: { locale } });
    }
    moment.locale(locale);
    if (hasIntlFields) {
      client.resetStore();
    }
  };

  getChildContext() {
    const messages = Strings[this.getLocale()] || {};
    const intlProvider = new IntlProvider({ locale: this.getLocale() }, messages);
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
    const LayoutComponent = currentRoute.layoutName ? Components[currentRoute.layoutName] : Components.Layout;

    // if defined, use ErrorCatcher component to wrap layout contents
    const ErrorCatcher = Components.ErrorCatcher ? Components.ErrorCatcher : DummyErrorCatcher;

    return (
      <IntlProvider locale={this.getLocale()} key={this.getLocale()} messages={Strings[this.getLocale()]}>
        <div className={`locale-${this.getLocale()}`}>
          <Components.HeadTags />
          <Components.RouterHook currentRoute={currentRoute} />
          <LayoutComponent {...this.props} currentRoute={currentRoute}>
            {this.props.currentUserLoading ? (
              <Components.Loading />
            ) : this.props.children ? (
              <ErrorCatcher>{this.props.children}</ErrorCatcher>
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

const updateOptions = {
  collectionName: 'Users',
  fragmentName: 'UsersCurrent',
};

registerComponent('App', App, withCurrentUser, [withUpdate, updateOptions], withApollo, withCookies);

export default App;
