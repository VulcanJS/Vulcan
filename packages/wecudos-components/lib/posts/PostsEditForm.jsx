import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";

import SmartContainers from "meteor/utilities:react-list-container";
const DocumentContainer = SmartContainers.DocumentContainer;

import Core from "meteor/nova:core";
const Messages = Core.Messages;

import Actions from "../actions.js";

class PostsEditForm extends Component{

  constructor() {
    super();
    this.deletePost = this.deletePost.bind(this);
  }

  deletePost() {
    const post = this.props.post;
    if (window.confirm(`Delete post “${post.title}”?`)) { 
      Actions.call('posts.deleteById', post._id, (error, result) => {
        Messages.flash(`Post “${post.title}” deleted.`, "success");
        Events.track("post deleted", {'_id': post._id});
      });
    }
  }

  render() {

    return (
      <div className="edit-post-form">
        <DocumentContainer 
          collection={Posts} 
          publication="posts.single" 
          selector={{_id: this.props.post._id}}
          terms={{_id: this.props.post._id}}
          joins={Posts.getJoins()}
          component={NovaForm}
          componentProps={{
            // note: the document prop will be passed from DocumentContainer
            collection: Posts,
            currentUser: this.context.currentUser,
            methodName: "posts.edit",
            labelFunction: fieldName => Telescope.utils.getFieldLabel(fieldName, Posts)
          }}
        />
        <hr/>
        <a onClick={this.deletePost} className="delete-post-link"><Icon name="close"/> Delete Post</a>
      </div>
    )
  }
}

PostsEditForm.propTypes = {
  post: React.PropTypes.object.isRequired
}

PostsEditForm.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = PostsEditForm;
export default PostsEditForm;