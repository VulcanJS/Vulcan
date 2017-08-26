import { Components, registerComponent, withDocument} from 'meteor/vulcan:core';
import Posts from 'meteor/vulcan:posts';
import React from 'react';
import DragIcon from 'material-ui/svg-icons/editor/drag-handle';
import RemoveIcon from 'material-ui/svg-icons/navigation/close';


const PostsItemWrapper = ({document, loading, ...props}) => {
  if (document && !loading) {
    return <div>
      <DragIcon className="drag-handle"/>
      <div className="posts-list-edit-item-box">
        <div className="posts-list-edit-item-title">
          {document.title}
        </div>
        <div className="posts-list-edit-item-meta">
          <div className="posts-list-edit-item-author">
            {document.user.displayName}
          </div>
          <div className="posts-list-edit-item-karma">
            {document.baseScore} points
          </div>
          <div className="posts-list-edit-item-comments">
            {document.commentCount} comments
          </div>
          <div className="posts-list-edit-item-remove">
            <RemoveIcon className="remove-icon" onTouchTap={() => props.removeItem(document._id)} />
          </div>
        </div>
      </div>
    </div>
  } else {
    return <Components.Loading />
  }
};

const options = {
  collection: Posts,
  fragmentName: 'LWPostsList',
  totalResolver: false,
};

registerComponent('PostsItemWrapper', PostsItemWrapper, withDocument(options));
