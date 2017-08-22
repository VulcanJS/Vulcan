import { Components, registerComponent, withList, withCurrentUser, Utils } from 'meteor/vulcan:core';
import React from 'react';
import moment from 'moment';


const SequencesListItem = ({sequence, currentUser}) => {
  const date = moment(new Date(sequence.createdAt)).format('dddd, MMMM Do YYYY');
  return <div className="sequences-list-item">
    <img className="sequences-grid-item-image" src={sequence.image} />
    <div className="sequences-list-item-right">
      <div className="sequences-list-item-title">{sequence.title}</div>
      <div className="sequences-list-item-articles">{sequence.finishedPosts}/{sequence.totalPosts} articles</div>
      <div className="sequences-list-item-author">by {sequence.user.displayName}</div>
      <div className="sequences-list-item-description">{sequence.summary}</div>
      <div className="sequences-list-item-bottom">
        <div className="sequences-list-item-comment-count">{sequence.commentCount} comments</div>
        <div className="sequences-list-item-date">{date}</div>
      </div>
    </div>
  </div>;
};

SequencesListItem.displayName = "SequencesListItem";

registerComponent('SequencesListItem', SequencesListItem, withCurrentUser);
