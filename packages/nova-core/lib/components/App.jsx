import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { IntlProvider, intlShape} from 'react-intl';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

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

// we are not "forced" to use the containers helpers to run specific queries like `getCurrentUser` which doesn't take any argument
const currentUserContainer = graphql(
  gql`query getCurrentUser {
    currentUser {
      _id
      username
      createdAt
      isAdmin
      __bio
      __displayName
      __email
      __emailHash
      __groups
      __htmlBio
      __karma
      __slug
      __twitterUsername
      __website
    }
  }
  `, {
    props(props) {
      const {data: {loading, currentUser}} = props;
      return {
        loading,
        currentUser,
      };
    },
  }
);

Telescope.registerComponent('App', App, currentUserContainer);

export default App;