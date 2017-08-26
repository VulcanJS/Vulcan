import { Components, registerComponent, withCurrentUser} from 'meteor/vulcan:core';
import { Image } from 'cloudinary-react';
import NoSSR from 'react-no-ssr';
import React from 'react';


const SequencesGridItem = ({sequence, currentUser}) => {
  const allPostsList = sequence.chapters && _.reduce(sequence.chapters, (memo, c) => [...memo, ...c.posts], []);
  const totalPostsNumber = allPostsList && allPostsList.length;
  const readPostsNumber = allPostsList && _.filter(allPostsList, (p) => p && p.lastVisitedAt).length;
  return <div className="sequences-grid-item" >
    <div className="sequences-grid-item-top" style={{borderTopColor: sequence.color}}>
      <div className="sequences-grid-item-title">{sequence.title}</div>
      <div className="sequences-grid-item-progress" style={{color: sequence.color}}>{readPostsNumber}/{totalPostsNumber} articles</div>
      <div className="sequences-grid-item-author">by {sequence.user.displayName}</div>
    </div>
    <div className="sequences-grid-item-bottom">
      <div className="sequences-grid-item-image">
        <NoSSR><Image publicId={sequence.gridImageId || "Group_ybgiy6.png"} dpr="auto" responsive={true} sizes="100vw" cloudName="lesswrong-2-0" quality="auto" height={80} width={203} crop="fill" gravity="custom"/></NoSSR>
      </div>
    </div>
  </div>;
};

SequencesGridItem.displayName = "SequencesGridItem";

registerComponent('SequencesGridItem', SequencesGridItem, withCurrentUser);
