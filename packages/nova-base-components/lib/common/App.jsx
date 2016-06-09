import React, { PropTypes, Component } from 'react';
import {IntlProvider, intlShape} from 'react-intl';
import { AppComposer } from "meteor/nova:core";

class App extends Component {

  getLocale() {
    return Telescope.settings.get("locale", "en_US");
  }

  getChildContext() {
    
    const intlProvider = new IntlProvider({locale: this.getLocale()}, Telescope.strings[this.getLocale()]);
    const {intl} = intlProvider.getChildContext();

    return {
      currentUser: this.props.currentUser,
      currentRoute: this.props.currentRoute,
      intl: intl
    };
  }

  render() {

    if (this.props.ready) {
      return (
        <IntlProvider locale={this.getLocale()} messages={Telescope.strings[this.getLocale()]}>
          <Telescope.components.Layout currentUser={this.props.currentUser}>{this.props.content}</Telescope.components.Layout>
        </IntlProvider>
      )
    } else {
      return <Telescope.components.AppLoading />
    }
  }

}

App.propTypes = {
  ready: React.PropTypes.bool,
  currentUser: React.PropTypes.object,
  currentRoute: React.PropTypes.object
}

App.childContextTypes = {
  currentUser: React.PropTypes.object,
  currentRoute: React.PropTypes.object,
  intl: intlShape
}

module.exports = AppComposer(App);
export default AppComposer(App);