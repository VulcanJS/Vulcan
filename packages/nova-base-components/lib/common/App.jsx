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
      actions: this.props.actions,
      events: this.props.events,
      messages: this.props.messages,
      intl: intl
    };
  }

  render() {
    return (
      <IntlProvider locale={this.getLocale()} messages={Telescope.strings[this.getLocale()]}>
        {
          this.props.ready ? 
            <Telescope.components.Layout currentUser={this.props.currentUser}>{this.props.children}</Telescope.components.Layout> 
          : <Telescope.components.AppLoading />
        }
      </IntlProvider>
    )
  }

}

App.propTypes = {
  ready: React.PropTypes.bool,
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  messages: React.PropTypes.object,
}

App.childContextTypes = {
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  messages: React.PropTypes.object,
  intl: intlShape
}

module.exports = AppComposer(App);
export default AppComposer(App);