import React, { PropTypes, Component } from 'react';
import { registerComponent, Components } from 'meteor/vulcan:core';

const ChaptersList = (props) =>

  <div className="chapters-list">
    {console.log("ChaptersList props", props)}
    {props.chapters.map((chapter) => <Components.ChaptersItem key={chapter._id} chapter={chapter} />)}
  </div>

registerComponent('ChaptersList', ChaptersList)
