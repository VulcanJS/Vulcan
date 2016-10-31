import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Users from 'meteor/nova:users';

class Vote extends Component {

  constructor() {
    super();
    this.upvote = this.upvote.bind(this);
  }

  upvote(e) {
    e.preventDefault();

    const post = this.props.post;
    const user = this.context.currentUser;

    if(!user){
      this.props.flash("Please log in first");
    } else if (Users.hasUpvoted(user, post)) {
      this.context.actions.call('posts.cancelUpvote', post._id, () => {
        this.props.refetchQuery();
        this.context.events.track("post upvote cancelled", {'_id': post._id});
      });        
    } else {
      this.context.actions.call('posts.upvote', post._id, () => {
        this.props.refetchQuery();
        this.context.events.track("post upvoted", {'_id': post._id});
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
          <Telescope.components.Icon name="upvote" />
          <div className="sr-only">Upvote</div>
          <div className="vote-count">{post.baseScore || 0}</div>
        </a>
      </div>
    )
  }

}

Vote.propTypes = {
  post: React.PropTypes.object.isRequired, // the current post
};

Vote.contextTypes = {
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  //messages: React.PropTypes.object
};

const mapStateToProps = state => ({ messages: state.messages });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

module.exports = connect(mapStateToProps, mapDispatchToProps)(Vote);
export default connect(mapStateToProps, mapDispatchToProps)(Vote);