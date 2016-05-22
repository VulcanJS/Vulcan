import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';

import { ModalTrigger } from "meteor/nova:core";

class PostsItem extends Component {

  renderCategories() {
    return this.props.post.categoriesArray ? <Telescope.components.PostsCategories post={this.props.post} /> : "";
  }

  renderCommenters() {
    return this.props.post.commentersArray ? <Telescope.components.PostsCommenters post={this.props.post}/> : "";
  }

  renderActions() {

    const component = (
      <ModalTrigger title="Edit Post" component={<a className="posts-action-edit">Edit</a>}>
        <Telescope.components.PostsEditForm post={this.props.post}/>
      </ModalTrigger>
    );

    return (
      <div className="post-actions">
        {Users.can.edit(this.context.currentUser, this.props.post) ? component : ""}
      </div>
    )
  }
  
  render() {

    const post = this.props.post;

    let postClass = "posts-item"; 
    if (post.sticky) postClass += " posts-sticky";

    // console.log(post)
    // console.log(post.user)

    return (
      <div className={postClass}>
        
        <div className="posts-item-vote">
          <Telescope.components.Vote post={post} currentUser={this.context.currentUser}/>
        </div>
        
        {post.thumbnailUrl ? <Telescope.components.PostsThumbnail post={post}/> : null}

        <div className="posts-item-content">
          
          <h3 className="posts-item-title">
            <a className="posts-item-title-link" href={Posts.getLink(post)} target={Posts.getLinkTarget(post)}>{post.title}</a>
            {this.renderCategories()}
          </h3>
          
          <div className="posts-item-meta">
            {post.user? <div className="posts-item-user"><Telescope.components.UsersAvatar user={post.user} size="small"/><Telescope.components.UsersName user={post.user}/></div> : null}
            <div className="posts-item-date">{moment(post.postedAt).fromNow()}</div>
            <div className="posts-item-comments"><a href={Posts.getPageUrl(post)}>{post.commentCount}&nbsp;comments</a></div>

            {(this.context.currentUser && this.context.currentUser.isAdmin) ?<Telescope.components.PostsStats post={post} />:null}
            {this.renderActions()}
          </div>

        </div>

        {this.renderCommenters()}
        
      
      </div>
    )
  }
};
  
PostsItem.propTypes = {
  post: React.PropTypes.object.isRequired
}

PostsItem.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = PostsItem;
export default PostsItem;