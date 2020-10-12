import { Components, registerComponent, getSetting, Strings, runCallbacks, detectLocale, hasIntlFields, Routes, getLocale } from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider, intlShape, IntlContext } from 'meteor/vulcan:i18n';
import withCurrentUser from '../containers/currentUser.js';
import withUpdate from '../containers/update.js';
import withSiteData from '../containers/siteData.js';
import withLocaleData from '../containers/localeData.js';
import { withApollo } from '@apollo/react-hoc';
import { withCookies } from 'react-cookie';
import moment from 'moment';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import MessageContext from '../messages.js';
import get from 'lodash/get';
import merge from 'lodash/merge';

// see https://stackoverflow.com/questions/42862028/react-router-v4-with-multiple-layouts
const RouteWithLayout = ({ layoutComponent, layoutName, component, currentRoute, ...rest }) => {
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
        // Use layoutComponent, or else registered layout component; or else default layout
        const layout = layoutComponent ? layoutComponent : layoutName ? Components[layoutName] : Components.Layout;
        const children = (
          <ErrorCatcher>
            <Components.RouterHook currentRoute={currentRoute} />
            <Components.AccessControl currentRoute={currentRoute}>
              {React.createElement(component, childComponentProps)}
            </Components.AccessControl>
          </ErrorCatcher>
        );
        return React.createElement(layout, layoutProps, children);
      }}
    />
  );
};

class App extends PureComponent {
  constructor(props) {
    super(props);
    if (props.currentUser) {
      runCallbacks('events.identify', props.currentUser);
    }
    const { localeId, localeMethod } = props.locale;
    // get translation strings loaded dynamically
    const loadedStrings = { [localeId]: get(props.locale, 'data.locale.strings') };
    // get translation strings bundled statically
    const bundledStrings = Strings[localeId];
    this.state = {
      locale: localeId,
      localeMethod,
      messages: [],
      localeLoading: false,
      localeStrings: merge({}, loadedStrings, bundledStrings),
    };
    moment.locale(localeId);
  }

  /*

  Clear messages on route change
  See https://stackoverflow.com/a/45373907/649299

  */
  UNSAFE_componentWillMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      this.clear();
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  /* 
  
  Show a flash message
  
  */
  flash = message => {
    this.setState({
      messages: [...this.state.messages, message],
    });
  };

  /*

  Clear all flash messages

  */
  clear = () => {
    this.setState({ messages: [] });
  };

  componentDidMount = async () => {
    runCallbacks('app.mounted', this.props);
  }

  // initLocale = () => {
  //   let userLocale = '';
  //   let localeMethod = '';
  //   const { currentUser, cookies, locale } = this.props;
  //   const availableLocales = Object.keys(Strings);
  //   const detectedLocale = detectLocale();

  //   if (locale) {
  //     // 1. locale is passed from AppGenerator through SSR process
  //     userLocale = locale.localeId;
  //     localeMethod = 'SSR';
  //   } else if (cookies && cookies.get('locale')) {
  //     // 2. look for a cookie
  //     userLocale = cookies.get('locale');
  //     localeMethod = 'cookie';
  //   } else if (currentUser && currentUser.locale) {
  //     // 3. if user is logged in, check for their preferred locale
  //     userLocale = currentUser.locale;
  //     localeMethod = 'user';
  //   } else if (detectedLocale) {
  //     // 4. else, check for browser settings
  //     userLocale = detectedLocale;
  //     localeMethod = 'browser';
  //   }
  //   console.log('app.jsx initlocale')
  //   console.log(userLocale)
  //   console.log(localeMethod)
  //   // if user locale is available, use it; else compare first two chars
  //   // of user locale with first two chars of available locales
  //   const availableLocale = Strings[userLocale]
  //     ? userLocale
  //     : availableLocales.find(locale => locale.slice(0, 2) === userLocale.slice(0, 2));

  //   // 4. if user-defined locale is available, use it; else default to setting or `en-US`
  //   if (availableLocale) {
  //     return { locale: availableLocale, localeMethod };
  //   } else {
  //     return { locale: getSetting('locale', 'en-US'), localeMethod: 'setting' };
  //   }
  // };

  getLocale = truncate => {
    return truncate ? this.state.locale.slice(0, 2) : this.state.locale;
  };

  setLocale = async localeId => {
    const localeObject = getLocale(localeId);
    const { cookies, updateUser, client, currentUser } = this.props;
    this.setState({ locale: localeId });
    cookies.remove('locale', { path: '/' });
    cookies.set('locale', localeId, { path: '/' });
    // if user is logged in, change their `locale` profile property
    if (currentUser) {
      await updateUser({ selector: { documentId: currentUser._id }, data: { locale: localeId } });
    }
    // if this is a dynamic locale, fetch its data from the server
    if (localeObject.dynamic) {
      await this.loadLocale(localeId);
    }
    moment.locale(localeId);
    if (hasIntlFields) {
      client.resetStore();
    }
  };

  /*

  Load a locale by triggering the refetch() method passed down by
  withLocalData HoC
  
  */
  loadLocale = async localeId => {
    this.setState({ localeLoading: true });
    const result = await this.props.locale.refetch({ localeId });
    const fetchedLocaleStrings = { [localeId]: get(result, 'data.locale.strings', [])};
    const localeStrings = merge({}, this.state.localeStrings, fetchedLocaleStrings);
    this.setState({ localeLoading: false, localeStrings });
  }

  getChildContext() {
    return {
      getLocale: this.getLocale,
      setLocale: this.setLocale,
    };
  }

  UNSAFE_componentWillUpdate(nextProps) {
    const currentUser = this.props.currentUser;
    const nextUser = nextProps.currentUser;
    if (nextUser && (!currentUser || currentUser._id !== nextUser._id)) {
      runCallbacks('events.identify', nextUser);
    }
  }

  render() {
    const routeNames = Object.keys(Routes);
    const { flash } = this;
    const { messages } = this.state;
    const locale = this.getLocale();
    //const LayoutComponent = currentRoute.layoutName ? Components[currentRoute.layoutName] : Components.Layout;

    // combine both strings loaded via the Strings object and strings loaded dynamically
    const currentLocaleStrings = this.state.localeStrings[locale];

    // keep IntlProvider for now for backwards compatibility with legacy Context API
    return (
      <IntlProvider locale={locale} key={locale} messages={currentLocaleStrings}>
        <IntlContext.Provider
          value={{
            locale,
            key: locale,
            messages: currentLocaleStrings,
          }}>
          <MessageContext.Provider value={{ messages, flash }}>
            <Components.ScrollToTop />
            <div className={`locale-${locale}`}>
              <Components.HeadTags />
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
                  <RouteWithLayout siteData={this.props.siteData} currentRoute={{ name: '404' }} component={Components.Error404} />
                  {/* <Route component={Components.Error404} />  */}
                </Switch>
              ) : (
                <Components.Welcome />
              )}
            </div>
          </MessageContext.Provider>
        </IntlContext.Provider>
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

registerComponent('App', App, withCurrentUser, withSiteData, withLocaleData, [withUpdate, updateOptions], withApollo, withCookies, withRouter);

export default App;
