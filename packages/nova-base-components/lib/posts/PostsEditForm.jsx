import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import NovaForm from "meteor/nova:forms";
import { DocumentContainer } from "meteor/utilities:react-list-container";
//import { Messages } from "meteor/nova:core";
//import Actions from "../actions.js";
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

class PostsEditForm extends Component{

  constructor() {
    super();
    this.deletePost = this.deletePost.bind(this);
  }

  deletePost() {
    const post = this.props.post;
    const deletePostConfirm = this.context.intl.formatMessage({id: "posts.delete_confirm"}, {title: post.title});
    const deletePostSuccess = this.context.intl.formatMessage({id: "posts.delete_success"}, {title: post.title});

    if (window.confirm(deletePostConfirm)) { 
      this.context.actions.call('posts.remove', post._id, (error, result) => {
        this.context.messages.flash(deletePostSuccess, "success");
        this.context.events.track("post deleted", {'_id': post._id});
      });
    }
  }

  renderAdminArea() {
    return (
      <div className="posts-edit-form-admin">
        <div className="posts-edit-form-id">ID: {this.props.post._id}</div>
        <Telescope.components.PostsStats post={this.props.post} />
      </div>
    )
  }

  render() {

  
    return (
      <div className="posts-edit-form">
        {Users.is.admin(this.context.currentUser) ?  this.renderAdminArea() : null}
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
            successCallback: (post) => { 
              this.context.messages.flash(this.context.intl.formatMessage({id: "posts.edit_success"}, {title: post.title}), 'success')
            }
          }}
        />
        <hr/>
        <a onClick={this.deletePost} className="delete-post-link"><Telescope.components.Icon name="close"/> <FormattedMessage id="posts.delete"/></a>
      </div>
    )
  }
}

PostsEditForm.propTypes = {
  post: React.PropTypes.object.isRequired
}

PostsEditForm.contextTypes = {
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  messages: React.PropTypes.object,
  intl: intlShape
}

module.exports = PostsEditForm;
export default PostsEditForm;