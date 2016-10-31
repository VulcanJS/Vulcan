import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { IntlProvider, intlShape} from 'react-intl';

class App extends Component {

  getLocale() {
    return Telescope.settings.get("locale", "en");
  }

  getChildContext() {
    
    const messages = Telescope.strings[this.getLocale()] || {};
    const intlProvider = new IntlProvider({locale: this.getLocale()}, messages);
    
    const {intl} = intlProvider.getChildContext();

    return {
      currentUser: this.props.data.currentUser,
      categories: this.props.data.categories,
      //actions: this.props.actions,
      actions: {call: Meteor.call},
      events: this.props.events,
      intl: intl
    };
  }

  render() {
    return (
      <IntlProvider locale={this.getLocale()} messages={Telescope.strings[this.getLocale()]}>
        {
          this.props.ready ? 
            <Telescope.components.Layout>{this.props.children}</Telescope.components.Layout> 
          : <Telescope.components.AppLoading />
        }
      </IntlProvider>
    )
  }

}

App.propTypes = {
  ready: React.PropTypes.bool,
  currentUser: React.PropTypes.object,
  categories: React.PropTypes.array,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
}

App.childContextTypes = {
  currentUser: React.PropTypes.object,
  categories: React.PropTypes.array,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  intl: intlShape
}

module.exports = App;
export default App;