import React, { PropTypes, Component } from 'react';
import { IntlProvider, intlShape} from 'react-intl';
import { AppComposer } from "meteor/nova:core";

class App extends Component {

  getLocale() {
    return Telescope.settings.get("locale", "en");
  }

  getChildContext() {
    
    const messages = Telescope.strings[this.getLocale()] || {};
    const intlProvider = new IntlProvider({locale: this.getLocale()}, messages);
    
    const {intl} = intlProvider.getChildContext();

    return {
      currentUser: this.props.currentUser,
      intl: intl
    };
  }

  render() {

    if (this.props.ready) {
      return (
        <IntlProvider locale={this.getLocale()} messages={Telescope.strings[this.getLocale()]}>
          <Telescope.components.Layout currentUser={this.props.currentUser}>{this.props.children}</Telescope.components.Layout>
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
}

App.childContextTypes = {
  currentUser: React.PropTypes.object,
  intl: intlShape
}

module.exports = AppComposer(App);
export default AppComposer(App);