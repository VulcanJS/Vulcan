import React, { PropTypes, Component } from 'react';
import { Components, withDocument, registerComponent } from 'meteor/vulcan:core';
import Sequences from '../collections/sequences/collection.js';
import moment from 'moment';
import Posts from 'meteor/vulcan:posts';

const SequencesPage = ({document, currentUser, loading}) => {
  const date = moment(new Date(document.createdAt)).format('dddd, MMMM Do YYYY');
  return (<div className="sequences-page">
    {!loading && document ? <div>
      <div className="sequences-title">
        {document.title}
      </div>
      <div className="sequences-description">
        {document.description}
      </div>
      <div className="sequences-meta">
        <div className="sequences-date">
          {date}
        </div>
        <div className="sequences-comment-count">
          {document.commentCount}
        </div>
        {document.userId ? <div className="sequences-author-top">
          by {document.user.displayName}
        </div> : null}
      </div>
      <div className="sequences-chapters">
        <Components.ChaptersList chapters={document.chapters} />
      </div>
    </div> : <Components.Loading />}
    <div className="sequences-author-bottom">
      {document.user.displayName}
    </div>
    <div className="posts-item-vote">
      <Components.Vote collection={Posts} document={document} currentUser={currentUser}/>
    </div>
    // Comments
    // <Components.PostsCommentsThreadWrapper terms={{postId: document._id, view: 'postCommentsTop'}} userId={document.userId} />
  </div>);
};

const options = {
  collection: Sequences,
  fragmentName: 'SequencePageFragment'
};


registerComponent('SequencesPage', SequencesPage, withDocument(options));
