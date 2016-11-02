import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Users from 'meteor/nova:users';

class Vote extends Component {

  constructor() {
    super();
    this.upvote = this.upvote.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.stopLoading = this.stopLoading.bind(this);
    this.state = {
      loading: false
    }
  }

  startLoading() {
    this.setState({ loading: true });
  }

  stopLoading() {
    this.setState({ loading: false });
  }

  upvote(e) {
    e.preventDefault();

    this.startLoading();

    const post = this.props.post;
    const user = this.context.currentUser;

    if(!user){
      this.props.flash("Please log in first");
    } else {
      const voteType = Users.hasUpvoted(user, post) ? "cancelUpvote" : "upvote";
      this.props.vote({post, voteType, currentUser: this.context.currentUser}).then(result => {
        this.stopLoading();
      });
    } 
  }

  render() {

    const post = this.props.post;
    const user = this.context.currentUser;

    const hasUpvoted = Users.hasUpvoted(user, post);
    const hasDownvoted = Users.hasDownvoted(user, post);
    const actionsClass = classNames(
      "vote", 
      {voted: hasUpvoted || hasDownvoted},
      {upvoted: hasUpvoted},
      {downvoted: hasDownvoted}
    );

    return (
      <div className={actionsClass}>
        <a className="upvote-button" onClick={this.upvote}>
          {this.state.loading ? <Telescope.components.Icon name="spinner" /> : <Telescope.components.Icon name="upvote" /> }
          <div className="sr-only">Upvote</div>
          <div className="vote-count">{post.baseScore || 0}</div>
        </a>
      </div>
    )
  }

}

Vote.propTypes = {
  post: React.PropTypes.object.isRequired, // the current post
  vote: React.PropTypes.func, // mutate function with callback inside
};

Vote.contextTypes = {
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
};

// graphql
const VoteWithMutation = graphql(gql`
  mutation postVote($postId: String, $voteType: String) {
    postVote(postId: $postId, voteType: $voteType)
  }
`, {
  props: ({ownProps, mutate}) => ({
    vote: ({post, voteType, currentUser}) => {
      
      const votedItem = Telescope.operateOnItem(Posts, post, currentUser, voteType, true);
      
      console.log("// votedItem")
      console.log(votedItem)

      return mutate({ 
        variables: {postId: post._id, voteType},
        optimisticResponse: {
          __typename: 'Mutation',
          postVote: votedItem
        },
      }).then(() => {
        return ownProps.refetchQuery();
      })
    }
  }),
})(Vote);

// redux state + actions for messages
const mapStateToProps = state => ({ messages: state.messages });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

module.exports = connect(mapStateToProps, mapDispatchToProps)(VoteWithMutation);
export default connect(mapStateToProps, mapDispatchToProps)(VoteWithMutation);