import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import React, { PropTypes, Component } from 'react';
import { IntlProvider, intlShape} from 'react-intl';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from './Loading.jsx';
import Layout from './Layout.jsx';

class App extends Component {

  getLocale() {
    return Telescope.settings.get("locale", "en");
  }

  getChildContext() {
    
    const messages = Telescope.strings[this.getLocale()] || {};
    const intlProvider = new IntlProvider({locale: this.getLocale()}, messages);
    
    const { intl } = intlProvider.getChildContext();

    return { intl };
  }

  render() {
    return (
      <IntlProvider locale={this.getLocale()} messages={Telescope.strings[this.getLocale()]}>
        {
          this.props.loading ? 
            <Loading /> :
            <div>{this.props.children}</div> 
        }
      </IntlProvider>
    )
  }

}

App.propTypes = {
  loading: React.PropTypes.bool,
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
}

App.childContextTypes = {
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
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