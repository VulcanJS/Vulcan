import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class VoteContainer extends Component {
  render() {
    const Component = this.props.component;
    return <Component {...this.props} />
  }
}

const VoteContainerWithMutation = graphql(gql`
  mutation postsVote($documentId: String, $voteType: String) {
    postsVote(documentId: $documentId, voteType: $voteType) {
      _id
      baseScore
      downvotes
      downvoters {
        _id
      }
      upvotes
      upvoters {
        _id
      }
    }
  }
`, {
  props: ({ownProps, mutate}) => ({
    vote: ({post, voteType, currentUser}) => {
      const votedItem = Telescope.operateOnItem(Posts, post, currentUser, voteType, true);
      return mutate({ 
        variables: {documentId: post._id, voteType},
        optimisticResponse: {
          __typename: 'Mutation',
          postsVote: {
            ...votedItem,
          },
        }
      })
    }
  }),
})(VoteContainer);

// redux state + actions for messages
const mapStateToProps = state => ({ messages: state.messages });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

module.exports = connect(mapStateToProps, mapDispatchToProps)(VoteContainerWithMutation);
export default connect(mapStateToProps, mapDispatchToProps)(VoteContainerWithMutation);