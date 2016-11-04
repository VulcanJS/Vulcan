import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import NovaForm from "meteor/nova:forms";
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class PostsEditForm extends Component {

  constructor() {
    super();
    this.deletePost = this.deletePost.bind(this);
  }

  deletePost() {
    const post = this.props.post;
    const deletePostConfirm = this.context.intl.formatMessage({id: "posts.delete_confirm"}, {title: post.title});
    const deletePostSuccess = this.context.intl.formatMessage({id: "posts.delete_success"}, {title: post.title});

    const successOperations = () => {
      this.props.flash(deletePostSuccess, "success");
      this.context.events.track("post deleted", {'_id': post._id});
      // note: no need to call closeCallback because once the post is deleted, the modal automatically disappears
    }

    if (window.confirm(deletePostConfirm)) { 
      this.context.actions.call('posts.remove', post._id, (error, result) => {
        if (this.context.refetchPostsListQuery) {
          // post edit form is being included from a post list, refresh list
          this.context.refetchPostsListQuery().then(successOperations);
        } else {
          // post edit form is being included from a single post, redirect to root
          this.props.router.push('/');
          successOperations();
        }
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
          component={NovaFormWithMutation}
          componentProps={{
            collection: Posts,
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
  refetchPostsListQuery: React.PropTypes.func,
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  closeCallback: React.PropTypes.func,
  intl: intlShape
}

const mapStateToProps = state => ({ messages: state.messages, });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);


const NovaFormWithMutation = graphql(gql`
  mutation postsEdit($postId: String, $modifier: PostModifier) {
    postsEdit(postId: $postId, modifier: $modifier) {
      _id
      title
      url
      slug
      body
      htmlBody
      thumbnailUrl
      baseScore
      postedAt
      sticky
      status
      categories {
        _id
        name
        slug
      }
      commentCount
      comments {
        _id
        # note: currently not used in PostsCommentsThread
        # parentComment {
        #   htmlBody
        #   postedAt
        #   user {
        #     _id
        #     telescope {
        #       slug
        #       emailHash # used for the avatar
        #     }
        #   }
        # }
        htmlBody
        postedAt
        user {
          _id
          telescope {
            slug
            emailHash # used for the avatar
          }
        }
      }
      upvoters {
        _id
      }
      downvoters {
        _id
      }
      upvotes # should be asked only for admins?
      score # should be asked only for admins?
      viewCount # should be asked only for admins?
      clickCount # should be asked only for admins?
      user {
        _id
        telescope {
          displayName
          slug
          emailHash
        }
      }
    }
  }
`, {
  props: ({ownProps, mutate}) => ({
    novaFormMutation: ({documentId, modifier}) => {
      console.log("novaFormMutation")
      console.log(postId)
      console.log(modifier)
      return mutate({ 
        variables: {postId: documentId, modifier}
      })
    }
  }),
})(NovaForm);

module.exports = withRouter(connect(mapStateToProps, mapDispatchToProps)(PostsEditForm));
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostsEditForm));