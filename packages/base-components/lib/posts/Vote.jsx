import React, { PropTypes, Component } from 'react';

class Vote extends Component {

  constructor() {
    super();
    this.upvote = this.upvote.bind(this);
  }

  upvote(e) {
    e.preventDefault();

    const post = this.props.post;
    const user = this.props.currentUser;

    if(!user){
      FlowRouter.go('signIn');
      Messages.flash(__("please_log_in_first"), "info");
    } else if (user.hasUpvoted(post)) {
      Meteor.call('posts.cancelUpvote', post._id, function(){
        Events.track("post upvote cancelled", {'_id': post._id});
      });        
    } else {
      Meteor.call('posts.upvote', post._id, function(){
        Events.track("post upvoted", {'_id': post._id});
      });  
    }

  }

  render() {

    ({Icon} = Telescope.components);

    const post = this.props.post;
    const user = this.props.currentUser;

    let actionsClass = "vote";
    if (user.hasUpvoted(post)) actionsClass += " voted upvoted";
    if (user.hasDownvoted(post)) actionsClass += " voted downvoted";

    return (
      <div className={actionsClass}>
        <a href="#" className="button button--secondary upvote" onClick={this.upvote}>
          <Icon name="upvote" />
          <span className="sr-only">Upvote</span>
        </a>
      </div>
    )
  }

}

Vote.propTypes = {
  post: React.PropTypes.object.isRequired, // the current comment
  currentUser: React.PropTypes.object, // the current user
}

module.exports = Vote;
export default Vote;