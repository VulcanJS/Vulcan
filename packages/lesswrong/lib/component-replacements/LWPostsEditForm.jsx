import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent, getFragment, withMessages, withCurrentUser } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import Posts from "meteor/vulcan:posts";
import Users from "meteor/vulcan:users";
import { withRouter } from 'react-router'

class LWPostsEditForm extends PureComponent {

  renderAdminArea() {
    const postId = this.props.location.query.postId;
    return (
      <Components.ShowIf check={Posts.options.mutations.edit.check} document={this.props.post}>
        <div className="posts-edit-form-admin">
          <div className="posts-edit-form-id">ID: {postId}</div>
          {/* Commented out for convenience at launch. Should definitely be reactivated */}
          {/* TODO: Reactivate this, by writing a wrapper that passes the post as a props*/ }
          {/* <Components.PostsStats post={this.props.post} /> */}
        </div>
      </Components.ShowIf>
    )
  }

  render() {

    const postId = this.props.location.query.postId;

    return (
      <div className="posts-edit-form">
        {Users.isAdmin(this.props.currentUser) ? this.renderAdminArea() : null}
        <Components.SmartForm
          collection={Posts}
          documentId={postId}
          mutationFragment={getFragment('PostsPage')}
          successCallback={post => {
            this.props.flash(this.context.intl.formatMessage({ id: 'posts.edit_success' }, 'success'));
            this.props.router.push({pathname: Posts.getPageUrl(post)});
          }}
          removeSuccessCallback={({ documentId, documentTitle }) => {
            // post edit form is being included from a single post, redirect to index
            // note: this.props.params is in the worst case an empty obj (from react-router)
            if (this.props.params._id) {
              this.props.router.push('/');
            }

            const deleteDocumentSuccess = this.context.intl.formatMessage({ id: 'posts.delete_success' }, { title: documentTitle });
            this.props.flash(deleteDocumentSuccess, 'success');
            // todo: handle events in collection callbacks
            // this.context.events.track("post deleted", {_id: documentId});
          }}
          showRemove={true}
        />
      </div>
    );

  }
}

LWPostsEditForm.propTypes = {
  closeModal: PropTypes.func,
  flash: PropTypes.func,
}

LWPostsEditForm.contextTypes = {
  intl: intlShape
}

registerComponent('PostsEditForm', LWPostsEditForm, withMessages, withRouter, withCurrentUser);
