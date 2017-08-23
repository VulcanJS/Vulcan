import React, { PropTypes, Component } from 'react';
import { registerComponent, Components, withList } from 'meteor/vulcan:core';
import Chapters from '../../lib/collections/chapters/collection.js';

const ChaptersList = ({results, loading, canEdit}) => {
  if (results && !loading) {
    return <div className="chapters-list">
      {results.map((chapter) => <Components.ChaptersItem key={chapter._id} chapter={chapter} canEdit={canEdit} />)}
    </div>
  } else {
    return <Components.Loading />
  }
}

const options = {
  collection: Chapters,
  queryName: 'chaptersListQuery',
  fragmentName: 'ChaptersFragment',
}

registerComponent('ChaptersList', ChaptersList, withList(options))
