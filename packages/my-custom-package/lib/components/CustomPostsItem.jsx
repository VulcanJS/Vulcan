import React, { PropTypes, Component } from 'react';

class CustomPostsItem extends Telescope.components.PostsItem {

  render() {

    ({UsersAvatar, UsersName, Vote, PostsStats, PostsThumbnail} = Telescope.components);

    const post = this.props.post;

    let postClass = "posts-item"; 
    if (post.sticky) postClass += " post-sticky";
    
    // ⭐ custom code starts here ⭐
    if (post.color) {
      postClass += " post-"+post.color;
    }
    // ⭐ custom code ends here ⭐

    return (
      <div className={postClass}>
        
        <div className="posts-item-vote">
          <Vote post={post} currentUser={this.props.currentUser}/>
        </div>
        
        {post.thumbnailUrl ? <PostsThumbnail post={post}/> : null}

        <div className="posts-item-content">
          
          <h3 className="posts-item-title">
            <a className="posts-item-title-link" href={Posts.getLink(post)} target={Posts.getLinkTarget(post)}>{post.title}</a>
            {this.renderCategories()}
          </h3>
          
          <div className="posts-item-meta">
            {post.user? <div className="posts-item-user"><UsersAvatar user={post.user} size="small"/><UsersName user={post.user}/></div> : null}
            <div className="posts-item-date">{moment(post.postedAt).fromNow()}</div>
            <div className="posts-item-comments"><a href={Posts.getPageUrl(post)}>{post.commentCount}&nbsp;comments</a></div>
            <PostsStats post={post} />
            {this.renderActions()}
          </div>

        </div>

        {this.renderCommenters()}
      
      </div>
    )
  }
};

export default CustomPostsItem;