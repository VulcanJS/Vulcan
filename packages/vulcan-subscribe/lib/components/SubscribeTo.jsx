import React, { PropTypes, Component } from 'react';
import { intlShape, FormattedMessage } from 'react-intl';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Users from 'meteor/vulcan:users';
import { withCurrentUser, withMessages, registerComponent, Utils } from 'meteor/vulcan:core';

// boolean -> unsubscribe || subscribe
const getSubscribeAction = subscribed => subscribed ? 'unsubscribe' : 'subscribe' 

class SubscribeToActionHandler extends Component {

  constructor(props, context) {
    super(props, context);

    this.onSubscribe = this.onSubscribe.bind(this);
    
    this.state = {
      subscribed: !!Users.isSubscribedTo(props.currentUser, props.document, props.documentType),
    };
  }

  async onSubscribe(e) {
    try {
      e.preventDefault();

      const { document, documentType } = this.props;
      const action = getSubscribeAction(this.state.subscribed);
      
      // todo: change the mutation to auto-update the user in the store
      await this.setState(prevState => ({subscribed: !prevState.subscribed}));

      // mutation name will be for example postsSubscribe
      await this.props[`${documentType + Utils.capitalize(action)}`]({documentId: document._id});

      // success message will be for example posts.subscribed
      this.props.flash(this.context.intl.formatMessage(
        {id: `${documentType}.${action}d`}, 
        // handle usual name properties
        {name: document.name || document.title || document.displayName}
      ), "success");
      

    } catch(error) {
      this.props.flash(error.message, "error");
    }
  }

  render() {
    const { currentUser, document, documentType } = this.props;
    const { subscribed } = this.state;
    
    const action = `${documentType}.${getSubscribeAction(subscribed)}`;
    
    // can't subscribe to yourself or to own post (also validated on server side)
    if (!currentUser || !document || (documentType === 'posts' && document.userId === currentUser._id) || (documentType === 'users' && document._id === currentUser._id)) {
      return null;
    }

    const className = this.props.className ? this.props.className : "";
    
    return Users.canDo(currentUser, action) ? <a className={className} onClick={this.onSubscribe}><FormattedMessage id={action} /></a> : null;
  }

}

SubscribeToActionHandler.propTypes = {
  document: React.PropTypes.object.isRequired,
  className: React.PropTypes.string,
  currentUser: React.PropTypes.object,
}

SubscribeToActionHandler.contextTypes = {
  intl: intlShape
};

const subscribeMutationContainer = ({documentType, actionName}) => graphql(gql`
  mutation ${documentType + actionName}($documentId: String) {
    ${documentType + actionName}(documentId: $documentId) {
      _id
      subscribedItems
    }
  }
`, {
  props: ({ownProps, mutate}) => ({
    [documentType + actionName]: vars => {
      return mutate({ 
        variables: vars,
      });
    },
  }),
});

const SubscribeTo = props => {
  
  const documentType = Utils.getCollectionNameFromTypename(props.document.__typename);
  
  const withSubscribeMutations = ['Subscribe', 'Unsubscribe'].map(actionName => subscribeMutationContainer({documentType, actionName})); 
  
  const EnhancedHandler = compose(...withSubscribeMutations)(SubscribeToActionHandler);
  
  return <EnhancedHandler {...props} documentType={documentType} />;
}


registerComponent('SubscribeTo', SubscribeTo, withCurrentUser, withMessages);
