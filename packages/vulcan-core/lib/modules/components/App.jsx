import { Components, registerComponent, Strings, runCallbacks, hasIntlFields, Routes, getLocale, getStrings } from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider, intlShape, IntlContext } from 'meteor/vulcan:i18n';
import withCurrentUser from '../containers/currentUser.js';
import withUpdate from '../containers/update.js';
import withSiteData from '../containers/siteData.js';
import { withLocaleData, withLocales } from '../containers/localeData.js';
import { withApollo } from '@apollo/client/react/hoc';
import { withCookies } from 'react-cookie';
import moment from 'moment';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import get from 'lodash/get';
import merge from 'lodash/merge';
import { SSRProvider } from '@react-aria/ssr';

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
    const { currentUser, locale } = props;
    if (currentUser) {
      runCallbacks('events.identify', currentUser);
    }

    // get translation strings loaded dynamically
    const loadedStrings = get(props.locale, 'data.locale.strings');
    // get translation strings bundled statically
    const bundledStrings = Strings[locale.id];

    this.state = {
      locale: {
        id: locale.id,
        rtl: locale.rtl ?? false,
        method: locale.method,
        loading: false,
        strings: merge({}, loadedStrings, bundledStrings),
      },
    };

    moment.locale(locale.id);
  }

  componentDidMount = async () => {
    runCallbacks('app.mounted', this.props);
  };

  // actually returns an id, not a locale
  getLocale = () => {
    return this.state.locale.id;
  };

  setLocale = async localeId => {
    // note: this is the getLocale in intl.js, not this.getLocale()!
    const localeObject = getLocale(localeId);
    const { cookies, updateUser, client, currentUser } = this.props;
    let localeStrings;

    // if this is a dynamic locale, fetch its data from the server
    if (localeObject.dynamic) {
      this.setState({ locale: { ...this.state.locale, loading: true, rtl: localeObject?.rtl ?? false } });
      localeStrings = await this.loadLocaleStrings(localeId);
    } else {
      localeStrings = getStrings(localeId);
    }

    // before removing the loading we have to change the rtl class on HTML tag if it exists
    if (document && typeof document.getElementsByTagName === 'function' && document.getElementsByTagName('html')) {
      const htmlTag = document.getElementsByTagName('html');
      if (htmlTag && htmlTag.length === 1) {
        // change in locale didn't change the html lang as well, which is fixed by this PR
        htmlTag[0].lang = localeId;
        if (localeObject?.rtl === true) {
          htmlTag[0].classList.add('rtl');
        } else {
          htmlTag[0].classList.remove('rtl');
        }
      }
    }
    this.setState({
      locale: { ...this.state.locale, loading: false, id: localeId, rtl: localeObject?.rtl ?? false, strings: localeStrings },
    });

    cookies.remove('locale', { path: '/' });
    cookies.set('locale', localeId, { path: '/' });
    // if user is logged in, change their `locale` profile property
    if (currentUser) {
      await updateUser({
        selector: { documentId: currentUser._id },
        data: { locale: localeId },
      });
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
  loadLocaleStrings = async localeId => {
    const result = await this.props.locale.refetch({ localeId });
    const fetchedLocaleStrings = get(result, 'data.locale.strings', []);
    const localeStrings = merge({}, this.state.localeStrings, fetchedLocaleStrings);
    return localeStrings;
  };

  getChildContext() {
    return {
      getLocale: this.getLocale,
      setLocale: this.setLocale,
    };
  }

  componentDidUpdate(nextProps) {
    const currentUser = this.props.currentUser;
    const nextUser = nextProps.currentUser;
    if (nextUser && (!currentUser || currentUser._id !== nextUser._id)) {
      runCallbacks('events.identify', nextUser);
    }
  }

  render() {
    const routeNames = Object.keys(Routes);
    const localeId = this.state.locale.id;
    //const LayoutComponent = currentRoute.layoutName ? Components[currentRoute.layoutName] : Components.Layout;

    const intlObject = {
      locale: localeId,
      key: localeId,
      messages: this.state.locale.strings,
    };

    // keep IntlProvider for now for backwards compatibility with legacy Context API
    return (
      <SSRProvider>
        <IntlProvider {...intlObject}>
          <IntlContext.Provider value={intlObject}>
            <Components.ScrollToTop />
            <div className={`locale-${localeId}`}>
              <Components.HeadTags />
              {this.props.currentUserLoading ? (
                <div className="app-initial-loading">
                  <Components.Loading />
                </div>
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
              {this.state.locale.loading && (
                <div className="app-secondary-loading">
                  <Components.Loading />
                </div>
              )}
            </div>
          </IntlContext.Provider>
        </IntlProvider>
      </SSRProvider>
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

registerComponent(
  'App',
  App,
  withCurrentUser,
  withSiteData,
  // withLocales,
  withLocaleData,
  [withUpdate, updateOptions],
  withApollo,
  withCookies,
  withRouter
);

export default App;
