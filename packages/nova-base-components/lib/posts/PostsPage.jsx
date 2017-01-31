import { Components, registerComponent, withDocument, withCurrentUser } from 'meteor/nova:core';
import React from 'react';
import Posts from 'meteor/nova:posts';

const PostsPage = (props) => {

  if (props.loading) {

    return <div className="posts-page"><Components.Loading/></div>

  } else {

    const post = props.document;

    const htmlBody = {__html: post.htmlBody};

    return (
      <div className="posts-page">
        <Components.HeadTags url={Posts.getLink(post)} title={post.title} image={post.thumbnailUrl} description={post.excerpt} />
        
        <Components.PostsItem post={post} currentUser={props.currentUser} />

        {post.htmlBody ? <div className="posts-page-body" dangerouslySetInnerHTML={htmlBody}></div> : null}

        <Components.PostsCommentsThread terms={{postId: post._id}} />

      </div> 
    )
  }
};

PostsPage.displayName = "PostsPage";

PostsPage.propTypes = {
  document: React.PropTypes.object
}

const options = {
  collection: Posts,
  queryName: 'postsSingleQuery',
  fragmentName: 'PostsPage',
};

registerComponent('PostsPage', PostsPage, withCurrentUser, [withDocument, options]);
