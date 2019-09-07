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
import MessageContext from '../messages.js';

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
        const children = <ErrorCatcher>
          <Components.RouterHook currentRoute={currentRoute}/>
          {React.createElement(component, childComponentProps)}
        </ErrorCatcher>;
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
    const { locale, localeMethod } = this.initLocale();
    this.state = { 
      locale, 
      localeMethod,
      messages: [], 
    };
    moment.locale(locale);
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
      messages: [...this.state.messages, message
    ]});
  }

  /*

  Clear all flash messages

  */
  clear = () => {
    this.setState({ messages: []});
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
    //const LayoutComponent = currentRoute.layoutName ? Components[currentRoute.layoutName] : Components.Layout;

    return (
      <IntlProvider locale={this.getLocale()} key={this.getLocale()} messages={Strings[this.getLocale()]}>
        <MessageContext.Provider value={{ messages, flash }}>
          <Components.ScrollToTop />
          <div className={`locale-${this.getLocale()}`}>
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
                <RouteWithLayout siteData={this.props.siteData} currentRoute={{ name: '404'}} component={Components.Error404} />
                {/* <Route component={Components.Error404} />  */}
              </Switch>
            ) : (
                  <Components.Welcome />
                )}
          </div>
        </MessageContext.Provider>
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
