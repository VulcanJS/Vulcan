import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { intlShape } from 'react-intl';
import NovaForm from "meteor/nova:forms";
import { withRouter } from 'react-router'
import Posts from "meteor/nova:posts";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'react-addons-update';

const PostsNewForm = (props, context) => {
  
  const router = props.router;

  return (
    <Telescope.components.CanDo
      action="posts.new"
      noPermissionMessage="users.cannot_post"
      displayNoPermissionMessage={true}
    >
      <div className="posts-new-form">
        <NovaFormWithMutation 
          collection={Posts} 
          successCallback={(post)=>{
            router.push({pathname: Posts.getPageUrl(post)});
            props.flash(context.intl.formatMessage({id: "posts.created_message"}), "success");
          }}
        />
      </div>
    </Telescope.components.CanDo>
  )
}

PostsNewForm.contextTypes = {
  currentUser: React.PropTypes.object,
  triggerMainRefetch: React.PropTypes.func,
  intl: intlShape
};

PostsNewForm.displayName = "PostsNewForm";

const mapStateToProps = state => ({ messages: state.messages });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

const NovaFormWithMutation = graphql(gql`
  mutation postsNew($post: PostInput) {
    postsNew(post: $post) {
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
    novaFormMutation: ({document}) => {
      // const optimisticResponseItem = {
      //   ...document,
      //   title: "optimisitc!",
      //   __typename: 'Post',
      //   id: 123,
      //   slug: 'foo'
      // }

      // console.log(document)
      // console.log(optimisticResponseItem)

      return mutate({ 
        variables: {post: document},
        // optimisticResponse: {
        //   __typename: 'Mutation',
        //   postsNew: optimisticResponseItem,
        // },
        updateQueries: {
          getPostsView: (prev, { mutationResult }) => {
            const newPost = mutationResult.data.postsNew;
            const newList = update(prev, {
              posts: {
                $unshift: [newPost],
              },
              postsViewTotal: {
                $set: prev.postsViewTotal + 1
              }
            });
            return newList;
          },
        }
      })
    }
  }),
})(NovaForm);


// note: why having both module.exports & export default?
module.exports = withRouter(connect(mapStateToProps, mapDispatchToProps)(PostsNewForm));
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostsNewForm));