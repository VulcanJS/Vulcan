import React, { PropTypes, Component } from 'react';
import ReactForms from "meteor/nova:forms";
const EditDocument = ReactForms.EditDocument;

import Core from "meteor/nova:core";
const Messages = Core.Messages;
const FlashContainer = Core.FlashContainer;

import Actions from "../actions.js";

class PostEditForm extends Component{

  constructor() {
    super();
    this.deletePost = this.deletePost.bind(this);
  }

  deletePost() {
    const post = this.props.post;
    if (window.confirm(`Delete post “${post.title}”?`)) { 
      Actions.call('posts.deleteById', post._id, function(){
        Messages.flash(`Post “${post.title}” deleted.`, "success");
        Events.track("post deleted", {'_id': post._id});
      });
    }
  }

  render() {

    ({FlashMessages} = Telescope.components);
    
    return (
      <div className="edit-post-form">
        <div className="modal-form-title edit-post-form-header">
          <h3>Edit Post</h3>
          <a onClick={this.deletePost} className="delete-post-link"><Icon name="close"/> Delete Post</a>
        </div>
        <FlashContainer component={FlashMessages}/>
        <EditDocument 
          collection={Posts}
          document={this.props.post}
          currentUser={this.context.currentUser}
          methodName="posts.edit"
          labelFunction={Telescope.utils.camelToSpaces}
          errorCallback={(post, error)=>{
            Messages.flash(error.message);
          }}
        />
      </div>
    )
  }
}

PostEditForm.propTypes = {
  post: React.PropTypes.object.isRequired
}

PostEditForm.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = PostEditForm;
export default PostEditForm;