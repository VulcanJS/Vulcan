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

    ({UsersAvatar, UsersName, Vote, PostsStats, PostsThumbnail} = Telescope.components);

    const post = this.props.post;

    let postClass = "posts-item"; 
    if (post.sticky) postClass += " posts-sticky";

    // console.log(post)
    // console.log(post.user)

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
  
PostsItem.propTypes = {
  post: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object
}

PostsItem.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = PostsItem;
export default PostsItem;