import React, { PropTypes, Component } from 'react';
import { registerComponent, Components } from 'meteor/vulcan:core';

const ChaptersList = (props) =>

  <div className="chapters-list">
<<<<<<< HEAD:packages/lesswrong/lib/sequences-page/ChaptersList.jsx
    {props.chapters.map((chapter) => <Components.ChaptersItem key={chapter._id} chapter={chapter} />)}
=======
    {props.chapters.map((chapter) =>
      <Components.ChaptersItem key={chapter._id} chapter={chapter} />)}
>>>>>>> faf414047a3744464be2bc31ed217017bf7d69a5:packages/lesswrong/lib/sequences/ChaptersList.jsx
  </div>

registerComponent('ChaptersList', ChaptersList)
