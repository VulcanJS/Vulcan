import React, { PropTypes, Component } from 'react';
import { registerComponent, ModalTrigger, Components } from 'meteor/vulcan:core';

const ChaptersItem = ({chapter, currentUser}) =>

  <div className="chapters-item">

    {chapter.number != 0 ? <div>
      <div className="chapters-item-title">
        Chapter {chapter.number}: {chapter.title}
      </div>
      <div className="chapters-item-description">
        {chapter.description}
      </div>
    </div> : null}

    <div className="chapters-item-posts">
      <Components.SequencesPostsList posts={chapter.posts} />
    </div>
  </div>

registerComponent('ChaptersItem', ChaptersItem)
