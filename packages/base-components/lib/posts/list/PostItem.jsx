import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';

import ReactForms from "meteor/utilities:react-form-containers";
const EditDocument = ReactForms.EditDocument;

class PostItem extends Component {

  renderCategories() {

    ({PostCategories} = Telescope.components);

    return this.props.post.categoriesArray ? <PostCategories post={this.props.post} /> : "";
  }

  renderCommenters() {

    ({PostCommenters} = Telescope.components);

    return this.props.post.commentersArray ? <PostCommenters post={this.props.post}/> : "";
  }

  renderActions() {

    ({ModalTrigger, DocumentContainer} = Telescope.components);

    const component = (
      <ModalTrigger component={<a href="#" className="edit-link">Edit</a>}>
        <div className="edit-post-form">
          <h3 className="modal-form-title">Edit Post</h3>
          <EditDocument 
            collection={Posts}
            document={this.props.post}
            currentUser={this.context.currentUser}
            methodName="posts.edit"
          />
        </div>
      </ModalTrigger>
    );

    return (
      <div className="post-actions">
        {Users.can.edit(this.props.currentUser, this.props.post) ? component : ""}
      </div>
    )
  }
  
  render() {

    ({UserAvatar, UserName, Vote, PostStats, PostThumbnail} = Telescope.components);

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
        
        {post.thumbnailUrl ? <PostThumbnail post={post}/> : null}

        <div className="post-content">
          
          <h3 className="post-title">
            <a className="post-title-link" href={Posts.getLink(post)} target={Posts.getLinkTarget(post)}>{post.title}</a>
            {this.renderCategories()}
          </h3>
          
          <div className="post-meta">
            <UserAvatar user={post.user} size="small"/>
            <UserName user={post.user}/>
            <div className="post-date">{moment(post.postedAt).fromNow()}</div>
            <div className="post-comments"><a href={Posts.getPageUrl(post)}>{post.commentCount}&nbsp;comments</a></div>
            <PostStats post={post} />
            {this.renderActions()}
          </div>

        </div>

        {this.renderCommenters()}
        
      
      </div>
    )
  }
};
  
PostItem.propTypes = {
  post: React.PropTypes.object.isRequired, // the current comment
  currentUser: React.PropTypes.object, // the current user
}

PostItem.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = PostItem;