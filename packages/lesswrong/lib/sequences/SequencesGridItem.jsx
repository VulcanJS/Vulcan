import { Components, registerComponent, withList, withCurrentUser, Utils } from 'meteor/vulcan:core';
import React from 'react';
import moment from 'moment';


const SequencesGridItem = ({sequence, currentUser}) => {
  console.log("//     Rendering SequencesGridItem");
  const date = moment(new Date(sequence.createdAt)).format('dddd, MMMM Do YYYY');
  return <div className="sequences-grid-item">
    <div className="sequences-grid-item-top">
      <div className="sequences-grid-item-title">{sequence.title}</div>
      <div className="sequences-grid-item-progress">{sequence.finishedPosts}/{sequence.totalPosts} articles</div>
      <div className="sequences-grid-item-author">by {sequence.displayName}</div>
    </div>
    <div className="sequences-grid-item-bottom">
      <img className="sequences-grid-item-image" src={sequence.image} />
    </div>
  </div>;
};

SequencesGridItem.displayName = "SequencesGridItem";

registerComponent('SequencesGridItem', SequencesGridItem, withCurrentUser);
