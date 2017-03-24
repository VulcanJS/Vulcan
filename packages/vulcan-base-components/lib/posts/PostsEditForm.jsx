import { Components, registerComponent, getFragment, withMessages } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import Posts from "meteor/vulcan:posts";
import { withRouter } from 'react-router'

class PostsEditForm extends Component {

  renderAdminArea() {
    return (
      <Components.ShowIf check={Posts.options.mutations.edit.check} document={this.props.post}>
        <div className="posts-edit-form-admin">
          <div className="posts-edit-form-id">ID: {this.props.post._id}</div>
          <Components.PostsStats post={this.props.post} />
        </div>
      </Components.ShowIf>
    )
  }

  render() {

    return (
      <div className="posts-edit-form">
        {this.renderAdminArea()}
        <Components.SmartForm
          collection={Posts}
          documentId={this.props.post._id}
          mutationFragment={getFragment('PostsPage')}
          successCallback={post => {
            this.props.closeModal();
            this.props.flash(this.context.intl.formatMessage({id: "posts.edit_success"}, {title: post.title}), 'success');
          }}
          removeSuccessCallback={({documentId, documentTitle}) => {
            // post edit form is being included from a single post, redirect to index
            // note: this.props.params is in the worst case an empty obj (from react-router)
            if (this.props.params._id) {
              this.props.router.push('/');
            }

            const deleteDocumentSuccess = this.context.intl.formatMessage({id: 'posts.delete_success'}, {title: documentTitle});
            this.props.flash(deleteDocumentSuccess, "success");
            // todo: handle events in collection callbacks
            // this.context.events.track("post deleted", {_id: documentId});
          }}
          showRemove={true}
        />
      </div>
    );

  }
}

PostsEditForm.propTypes = {
  closeModal: React.PropTypes.func,
  flash: React.PropTypes.func,
  post: React.PropTypes.object.isRequired,
}

PostsEditForm.contextTypes = {
  intl: intlShape
}

registerComponent('PostsEditForm', PostsEditForm, withMessages, withRouter);
