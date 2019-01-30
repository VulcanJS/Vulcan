import {
  Components,
  registerComponent,
  getSetting,
  Strings,
  runCallbacks,
  detectLocale,
  hasIntlFields,
  Routes,
} from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider, intlShape } from 'meteor/vulcan:i18n';
import withCurrentUser from '../containers/withCurrentUser.js';
import withUpdate from '../containers/withUpdate.js';
import withSiteData from '../containers/withSiteData.js';
import { withApollo } from 'react-apollo';
import { withCookies } from 'react-cookie';
import moment from 'moment';
import { Switch, Route } from 'react-router-dom';
import { withRouter} from 'react-router';

// see https://stackoverflow.com/questions/42862028/react-router-v4-with-multiple-layouts
const RouteWithLayout = ({ layoutName, component, currentRoute, ...rest }) => {

   // if defined, use ErrorCatcher component to wrap layout contents
   const ErrorCatcher = Components.ErrorCatcher ? Components.ErrorCatcher : Components.Dummy;

   return (
  <Route
    // NOTE: Switch ignores the "exact" prop of components that 
    // are not its direct children
    // Since the render tree is now Switch > RouteWithLayout > Route
    // (instead of just Switch > Route), we must write <RouteWithLayout exact ... />
    //exact 
    {...rest}
    render={props => {

   const layoutProps = { ...props, currentRoute };
   const childComponentProps = { ...props, currentRoute };
      const layout = layoutName ? Components[layoutName] : Components.Layout;
      return React.createElement(layout, layoutProps, <ErrorCatcher>{React.createElement(component, childComponentProps)}</ErrorCatcher>);
    }}
  />
);};

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

  componentDidMount() {
    runCallbacks('app.mounted', this.props);
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
    const routeNames = Object.keys(Routes);
    //const LayoutComponent = currentRoute.layoutName ? Components[currentRoute.layoutName] : Components.Layout;

    return (
      <IntlProvider locale={this.getLocale()} key={this.getLocale()} messages={Strings[this.getLocale()]}>
        <Components.ScrollToTop />
        <div className={`locale-${this.getLocale()}`}>
          <Components.HeadTags />
          {/* <Components.RouterHook currentRoute={currentRoute} /> */}
          {this.props.currentUserLoading ? (
            <Components.Loading />
          ) : routeNames.length ? (
            <Switch>
              {routeNames.map(key => (
                // NOTE: if we want the exact props to be taken into account
                // we have to pass it to the RouteWithLayout, not the underlying Route,
                // because it is the direct child of Switch
                <RouteWithLayout exact currentRoute={Routes[key]} siteData={this.props.siteData} key={key} {...Routes[key]} />
              ))}
              <Route component={Components.Error404} /> 
            </Switch>
          ) : (
                <Components.Welcome />
              )}
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

registerComponent('App', App, withCurrentUser, withSiteData, [withUpdate, updateOptions], withApollo, withCookies, withRouter);

export default App;
