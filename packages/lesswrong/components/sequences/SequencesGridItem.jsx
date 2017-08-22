import { Components, registerComponent, withCurrentUser} from 'meteor/vulcan:core';
import { Image } from 'cloudinary-react';
import React from 'react';


const SequencesGridItem = ({sequence, currentUser}) => {
  const allPostsList = _.reduce(sequence.chapters, (memo, c) => [...memo, ...c.posts]);
  const totalPostsNumber = allPostsList.length;
  const readPostsNumber = _.filter(allPostsList, (p) => p && p.lastVisitedAt).length;
  return <div className="sequences-grid-item" >
    <div className="sequences-grid-item-top" style={{borderTopColor: sequence.color}}>
      <div className="sequences-grid-item-title">{sequence.title}</div>
      <div className="sequences-grid-item-progress" style={{color: sequence.color}}>{readPostsNumber}/{totalPostsNumber} articles</div>
      <div className="sequences-grid-item-author">by {sequence.user.displayName}</div>
    </div>
    <div className="sequences-grid-item-bottom">
      <div className="sequences-grid-item-image">
        {sequence.gridImageId ? <Image cloudName="lesswrong-2-0" publidId={sequence.gridImageId} /> : null}
      </div>
    </div>
  </div>;
};

SequencesGridItem.displayName = "SequencesGridItem";

registerComponent('SequencesGridItem', SequencesGridItem, withCurrentUser);
