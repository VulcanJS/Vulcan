import { Components, registerComponent, withDocument} from 'meteor/vulcan:core';
import Sequences from '../../lib/collections/sequences/collection.js';
import React from 'react';
import DragIcon from 'material-ui/svg-icons/editor/drag-handle';
import RemoveIcon from 'material-ui/svg-icons/navigation/close';


const SequencesListEditorItem = ({document, loading, ...props}) => {
  if (document && !loading) {
    return <div>
      <DragIcon className="drag-handle"/>
      <div className="sequences-list-edit-item-box">
        <div className="sequences-list-edit-item-title">
          {document.title}
        </div>
        <div className="sequences-list-edit-item-meta">
          <div className="sequences-list-edit-item-author">
            {document.user.displayName}
          </div>
          <div className="sequences-list-edit-item-karma">
            {document.karma} points
          </div>
          <div className="sequences-list-edit-item-comments">
            {document.commentCount} comments
          </div>
          <div className="sequences-list-edit-item-remove">
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
  collection: Sequences,
  queryName: "SequencesListEditorQuery",
  fragmentName: 'SequencesPageFragment',
};

registerComponent('SequencesListEditorItem', SequencesListEditorItem, [withDocument, options]);
