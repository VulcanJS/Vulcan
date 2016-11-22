import Telescope from 'meteor/nova:lib';
import Events from "meteor/nova:events";
import Users from 'meteor/nova:users';
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
      currentUser: this.props.currentUser,
      actions: {call: Meteor.call},
      events: Events,
      intl: intl
    };
  }

  render() {
    return (
      <IntlProvider locale={this.getLocale()} messages={Telescope.strings[this.getLocale()]}>
        {
          this.props.loading ? 
            <Telescope.components.AppLoading /> :
            <Telescope.components.Layout>{this.props.children}</Telescope.components.Layout> 
        }
      </IntlProvider>
    )
  }

}

App.propTypes = {
  loading: React.PropTypes.bool,
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
}

App.childContextTypes = {
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
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
      __commentCount
      __displayName
      __downvotedComments {
        itemId
        power
        votedAt
      }
      __downvotedPosts {
        itemId
        power
        votedAt
      }
      __email
      __emailHash
      __groups
      __htmlBio
      __karma
      __newsletter_subscribeToNewsletter
      __notifications_users
      __notifications_posts
      __postCount
      __slug
      __twitterUsername
      __upvotedComments {
        itemId
        power
        votedAt
      }
      __upvotedPosts {
        itemId
        power
        votedAt
      }
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