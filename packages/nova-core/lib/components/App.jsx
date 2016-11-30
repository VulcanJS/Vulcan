import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { IntlProvider, intlShape} from 'react-intl';
import withApp from '../containers/withApp.js';

class App extends Component {

  getLocale() {
    return Telescope.settings.get("locale", "en");
  }

  getChildContext() {
    
    const messages = Telescope.strings[this.getLocale()] || {};
    const intlProvider = new IntlProvider({locale: this.getLocale()}, messages);
    
    const {intl} = intlProvider.getChildContext();

    return {
      intl: intl
    };
  }

  render() {
    return (
      <IntlProvider locale={this.getLocale()} messages={Telescope.strings[this.getLocale()]}>
        {
          this.props.loading ? 
            <Telescope.components.Loading /> :
            <Telescope.components.Layout>{this.props.children}</Telescope.components.Layout>
        }
      </IntlProvider>
    )
  }

}

App.propTypes = {
  loading: React.PropTypes.bool,
}

App.childContextTypes = {
  intl: intlShape,
}

Telescope.registerComponent('App', App, withApp);

export default App;