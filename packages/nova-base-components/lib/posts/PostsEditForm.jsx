import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import NovaForm from "meteor/nova:forms";
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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
        this.props.flash(deletePostSuccess, "success");
        this.context.events.track("post deleted", {'_id': post._id});
      });
    }
  }

  renderAdminArea() {
    return (
      <Telescope.components.CanDo action="posts.edit.all">
        <div className="posts-edit-form-admin">
          <div className="posts-edit-form-id">ID: {this.props.post._id}</div>
          <Telescope.components.PostsStats post={this.props.post} />
        </div>
      </Telescope.components.CanDo>
    )
  }

  render() {

  
    return (
      <div className="posts-edit-form">
        {this.renderAdminArea()}
        <Telescope.components.PostsSingleContainer
          postId={this.props.post._id}
          component={NovaForm}
          componentProps={{
            collection: Posts,
            currentUser: this.context.currentUser,
            methodName: "posts.edit",
            successCallback: (post) => { 
              this.props.flash(this.context.intl.formatMessage({id: "posts.edit_success"}, {title: post.title}), 'success');
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
  intl: intlShape
}

const mapStateToProps = state => ({ messages: state.messages, });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

module.exports = connect(mapStateToProps, mapDispatchToProps)(PostsEditForm);
export default connect(mapStateToProps, mapDispatchToProps)(PostsEditForm);