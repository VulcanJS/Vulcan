import Telescope from 'meteor/nova:lib';
import React from 'react';
import Posts from 'meteor/nova:posts';
import { withPostsSingle } from 'meteor/nova:base-containers';

const PostsPage = (props) => {
  
  if (props.data.loading) {

    return <div className="posts-page"><Telescope.components.Loading/></div>

  } else {

    const post = props.data.post;
    const htmlBody = {__html: post.htmlBody};

    return (
      <div className="posts-page">
        <Telescope.components.HeadTags url={Posts.getLink(post)} title={post.title} image={post.thumbnailUrl} />
        
        <Telescope.components.PostsItem post={post} />

        {post.htmlBody ? <div className="posts-page-body" dangerouslySetInnerHTML={htmlBody}></div> : null}

        {/*<SocialShare url={ Posts.getLink(post) } title={ post.title }/>*/}

        <Telescope.components.PostsCommentsThread postId={post._id} />

      </div> 
    )
  }
};

PostsPage.displayName = "PostsPage";

PostsPage.propTypes = {
  document: React.PropTypes.object
}

const getPostIdFromRouter = props => ({ postId: props.params._id });

module.exports = withPostsSingle(getPostIdFromRouter)(PostsPage);
export default withPostsSingle(getPostIdFromRouter)(PostsPage);
