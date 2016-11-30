import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import NovaForm from "meteor/nova:forms";
import Posts from "meteor/nova:posts";
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class PostsEditForm extends Component {

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
        <NovaForm
          collection={Posts}
          documentId={this.props.post._id}
          queryToUpdate="postsListQuery"
          successCallback={post => { 
            this.context.closeCallback();
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
  flash: React.PropTypes.func,
  post: React.PropTypes.object.isRequired,
}

PostsEditForm.contextTypes = {
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  closeCallback: React.PropTypes.func,
  intl: intlShape
}

const mapStateToProps = state => ({ messages: state.messages });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

Telescope.registerComponent('PostsEditForm', PostsEditForm, connect(mapStateToProps, mapDispatchToProps), withRouter);