import { Components, registerComponent, withList, withCurrentUser, Utils } from 'meteor/vulcan:core';
import React from 'react';
import moment from 'moment';


const SequencesListItem = ({sequence, currentUser}) => {
  console.log("//     Rendering SequencesListItem");
  const date = moment(new Date(sequence.createdAt)).format('dddd, MMMM Do YYYY');
  return <div class="sequences-list-item">
    <div className="sequences-list-item-title">{sequence.title}</div>
    <div className="sequences-list-item-articles">{sequence.finishedPosts}/{sequence.totalPosts} articles</div>
    <div className="sequences-list-item-author">by {sequence.displayName}</div>
    <div className="sequences-list-item-description">{sequence.summary}</div>
    <div className="sequences-list-item-comment-count">{sequence.commentCount} comments</div>
    <div className="sequences-list-item-date">{date}</div>
    <img className="sequences-grid-item-image" src={sequence.image} />
  </div>;
};

SequencesListItem.displayName = "SequencesListItem";

registerComponent('SequencesListItem', SequencesListItem, withCurrentUser);
