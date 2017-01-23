import { Components, registerComponent, withDocument, withCurrentUser } from 'meteor/nova:core';
import React from 'react';
import Posts from 'meteor/nova:posts';
import gql from 'graphql-tag';

const PostsPage = (props) => {

  if (props.loading) {

    return <div className="posts-page"><Components.Loading/></div>

  } else {

    const post = props.document;

    const htmlBody = {__html: post.htmlBody};

    return (
      <div className="posts-page">
        <Components.HeadTags url={Posts.getLink(post)} title={post.title} image={post.thumbnailUrl} />
        
        <Components.PostsItem post={post} currentUser={props.currentUser} />

        {post.htmlBody ? <div className="posts-page-body" dangerouslySetInnerHTML={htmlBody}></div> : null}

        {/*<SocialShare url={ Posts.getLink(post) } title={ post.title }/>*/}

        <Components.PostsCommentsThread terms={{postId: post._id}} />

      </div> 
    )
  }
};

PostsPage.displayName = "PostsPage";

PostsPage.propTypes = {
  document: React.PropTypes.object
}

PostsPage.fragment = gql` 
  fragment PostsSingleFragment on Post {
    _id
    title
    url
    body # extra
    htmlBody # extra
    slug
    thumbnailUrl
    baseScore
    postedAt
    sticky
    status
    categories {
      # ...minimumCategoryInfo
      _id
      name
      slug
    }
    commentCount
    commenters {
      # ...avatarUserInfo
      _id
      displayName
      emailHash
      slug
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
      # ...avatarUserInfo
      _id
      displayName
      emailHash
      slug
    }
    userId
  }
`;

const options = {
  collection: Posts,
  queryName: 'postsSingleQuery',
  fragment: PostsPage.fragment,
};

registerComponent('PostsPage', PostsPage, withCurrentUser, withDocument(options));
