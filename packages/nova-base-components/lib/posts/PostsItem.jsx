import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';

import Core from "meteor/nova:core";
const ModalTrigger = Core.ModalTrigger;

import SmartContainers from "meteor/utilities:react-list-container";
const DocumentContainer = SmartContainers.DocumentContainer;

class PostsItem extends Component {

  renderCategories() {

    ({PostsCategories} = Telescope.components);

    return this.props.post.categoriesArray ? <PostsCategories post={this.props.post} /> : "";
  }

  renderCommenters() {

    ({PostsCommenters} = Telescope.components);

    return this.props.post.commentersArray ? <PostsCommenters post={this.props.post}/> : "";
  }

  renderActions() {

    ({PostsEditForm} = Telescope.components);

    const component = (
      <ModalTrigger title="Edit Post" component={<a className="edit-link">Edit</a>}>
        <PostsEditForm post={this.props.post}/>
      </ModalTrigger>
    );

    return (
      <div className="post-actions">
        {Users.can.edit(this.props.currentUser, this.props.post) ? component : ""}
      </div>
    )
  }
  
  render() {

    ({UserAvatar, UserName, Vote, PostsStats, PostsThumbnail} = Telescope.components);

    const post = this.props.post;

    let postClass = "post-item"; 
    if (post.sticky) postClass += " post-sticky";

    // console.log(post)
    // console.log(post.user)

    return (
      <div className={postClass}>
        
        <div className="post-vote">
          <Vote post={post} currentUser={this.props.currentUser}/>
        </div>
        
        {post.thumbnailUrl ? <PostsThumbnail post={post}/> : null}

        <div className="post-content">
          
          <h3 className="post-title">
            <a className="post-title-link" href={Posts.getLink(post)} target={Posts.getLinkTarget(post)}>{post.title}</a>
            {this.renderCategories()}
          </h3>
          
          <div className="post-meta">
            {post.user? <div className="post-user"><UserAvatar user={post.user} size="small"/><UserName user={post.user}/></div> : null}
            <div className="post-date">{moment(post.postedAt).fromNow()}</div>
            <div className="post-comments"><a href={Posts.getPageUrl(post)}>{post.commentCount}&nbsp;comments</a></div>
            <PostsStats post={post} />
            {this.renderActions()}
          </div>

        </div>

        {this.renderCommenters()}
        
      
      </div>
    )
  }
};
  
PostsItem.propTypes = {
  post: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object
}

PostsItem.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = PostsItem;
export default PostsItem;