import Telescope from 'meteor/nova:lib';
import React from 'react';
import Posts from 'meteor/nova:posts';
import { withSingle } from 'meteor/nova:core';
import gql from 'graphql-tag';

const PostsPage = (props) => {

  if (props.loading) {

    return <div className="posts-page"><Telescope.components.Loading/></div>

  } else {

    const post = props.document;

    const htmlBody = {__html: post.htmlBody};

    return (
      <div className="posts-page">
        <Telescope.components.HeadTags url={Posts.getLink(post)} title={post.title} image={post.thumbnailUrl} />
        
        <Telescope.components.PostsItem post={post} />

        {post.htmlBody ? <div className="posts-page-body" dangerouslySetInnerHTML={htmlBody}></div> : null}

        {/*<SocialShare url={ Posts.getLink(post) } title={ post.title }/>*/}

        <Telescope.components.PostsCommentsThread terms={{postId: post._id}} />

      </div> 
    )
  }
};

PostsPage.displayName = "PostsPage";

PostsPage.propTypes = {
  document: React.PropTypes.object
}

PostsPage.fragmentName = 'PostsSingleFragment'
PostsPage.fragment = gql` 
  fragment PostsSingleFragment on Post {
    _id
    title
    url
    body
    htmlBody
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
      __displayName
      __emailHash
      __slug
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
      __displayName
      __emailHash
      __slug
    }
    userId
  }
`;

const options = {
  collection: Posts,
  queryName: 'postsSingleQuery',
  fragmentName: PostsPage.fragmentName,
  fragment: PostsPage.fragment,
};

Telescope.registerComponent('PostsPage', PostsPage, withSingle(options));
