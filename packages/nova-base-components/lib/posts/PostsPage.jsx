import Telescope from 'meteor/nova:lib';
import React from 'react';
import Posts from "meteor/nova:posts";

const PostsPage = (props) => {
  
  const {refetchQuery} = props;
  const post = props.document;
  const htmlBody = {__html: post.htmlBody};

  return (
    <div className="posts-page">

      <Telescope.components.HeadTags url={Posts.getLink(post)} title={post.title} image={post.thumbnailUrl} />
      
      <Telescope.components.PostsItem post={post} refetchQuery={refetchQuery} />

      {post.htmlBody ? <div className="posts-page-body" dangerouslySetInnerHTML={htmlBody}></div> : null}

      {/*<SocialShare url={ Posts.getLink(post) } title={ post.title }/>*/}

      <Telescope.components.CommentsListContainer
        component={Telescope.components.PostsCommentsThread}
        postId={post._id}
        componentProps={{
          commentCount: post.commentCount,
          postId: post._id
        }}
      />

    </div>
  )
};

PostsPage.displayName = "PostsPage";

PostsPage.propTypes = {
  document: React.PropTypes.object
}

module.exports = PostsPage;
export default PostsPage;