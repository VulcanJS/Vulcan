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
import { withApollo } from 'react-apollo';
import { withCookies } from 'react-cookie';
import moment from 'moment';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

// see https://stackoverflow.com/questions/42862028/react-router-v4-with-multiple-layouts
const RouteWithLayout = ({ layoutName, component, ...rest }) => (
  <Route
    // NOTE: Switch ignores the "exact" prop of components that 
    // are not its direct children
    // Since the render tree is now Switch > RouteWithLayout > Route
    // (instead of just Switch > Route), we must write <RouteWithLayout exact ... />
    //exact 
    {...rest}
    render={props => {
      const layout = layoutName ? Components[layoutName] : Components.Layout;
      return React.createElement(layout, props, React.createElement(component, props));
    }}
  />
);

class App extends PureComponent {
  constructor(props) {
    super(props);
    if (props.currentUser) {
      runCallbacks('events.identify', props.currentUser);
    }
    const locale = this.initLocale();
    this.state = { locale };
    moment.locale(locale);
  }

  initLocale = () => {
    let userLocale = '';
    const { currentUser, cookies } = this.props;
    const availableLocales = Object.keys(Strings);

    if (currentUser && currentUser.locale) {
      // 1. if user is logged in, check for their preferred locale
      userLocale = currentUser.locale;
    } else if (cookies && cookies.get('locale')) {
      // 2. else, look for a cookie
      userLocale = cookies.get('locale');
    } else if (detectLocale()) {
      // 3. else, check for browser settings
      userLocale = detectLocale();
    }
    // if user locale is available, use it; else compare first two chars
    // of user locale with first two chars of available locales
    const availableLocale = Strings[userLocale]
      ? userLocale
      : availableLocales.find(locale => locale.slice(0, 2) === userLocale.slice(0, 2));

    // 4. if user-defined locale is available, use it; else default to setting or `en-US`
    return availableLocale ? availableLocale : getSetting('locale', 'en-US');
  };

  getLocale = (truncate = false) => {
    return truncate ? this.state.locale.slice(0, 2) : this.state.locale;
  };

  setLocale = async locale => {
    this.setState({ locale });
    this.props.cookies.set('locale', locale);
    // if user is logged in, change their `locale` profile property
    if (this.props.currentUser) {
      await this.props.updateUser({ selector: { documentId: this.props.currentUser._id }, data: { locale } });
    }
    moment.locale(locale);
    if (hasIntlFields) {
      this.props.client.resetStore();
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
    return (
      <IntlProvider locale={this.getLocale()} key={this.getLocale()} messages={Strings[this.getLocale()]}>
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
                <RouteWithLayout exact key={key} {...Routes[key]} />
              ))}
              <Route component={Components.Error404} /> // TODO Apollo2: figure out why this is not working
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

registerComponent('App', App, withCurrentUser, [withUpdate, updateOptions], withApollo, withCookies);

export default App;
