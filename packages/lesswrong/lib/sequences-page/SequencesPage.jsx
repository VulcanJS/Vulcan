import React, { PropTypes, Component } from 'react';
import { Components, withDocument, registerComponent } from 'meteor/vulcan:core';
import Sequences from '../collections/sequences/collection.js'

const SequencesPage = ({document, currentUser, loading}) =>
<div className="sequences-page">
  {!loading && document ? <div>
    <div className="sequences-title">
      {document.title}
    </div>
    <div className="sequences-description">
      {document.description}
    </div>
    <div className="sequences-meta">
      <div className="sequences-date">
        {document.createdAt}
      </div>
      <div className="sequences-comment-count">=
        {document.commentCount}
      </div>
      {document.userId ? <div className="sequences-author">
        by {document.user.displayName}
      </div> : null}
    </div>
    <div className="sequences-chapters">
      <Components.ChaptersList chapters={document.chapters} />
    </div>
  </div> : <Components.Loading />}

</div>

    // Voting and comment sections TBD

const options = {
  collection: Sequences,
  fragmentName: 'SequencePageFragment',
};


registerComponent('SequencesPage', SequencesPage, withDocument(options));
