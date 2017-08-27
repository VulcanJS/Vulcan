import { Components, registerComponent, withDocument} from 'meteor/vulcan:core';
import Sequences from '../../lib/collections/sequences/collection.js';
import React from 'react';

const RecommendedReadingWrapper = ({document, loading, post, router, nextTitle, nextLink}) => {
  if (document && !loading) {
    //TODO: Factor out the code in here and SequencesNavigation
    if (document.chapters) {
      let currentChapter = false;
      let currentPostIndex = false;
      let currentChapterIndex = false;
      let currentSequenceLength = document.chapters.length;
      document.chapters.forEach((c) => {
        if(c.posts && _.pluck(c.posts, '_id').indexOf(post._id) > -1) {
          currentChapter = c
          currentPostIndex = _.pluck(c.posts, '_id').indexOf(post._id);
          currentChapterIndex = _.pluck(document.chapters, '._id').indexOf(c._id);
        }
      })
      let nextPostLink = "";
      let nextPost = false;
      let previousPostLink = "";
      let previousPost = false;
      if (currentPostIndex || currentPostIndex === 0) {
        if (currentPostIndex + 1 < currentChapter.posts.length) {
          nextPost = currentChapter.posts[currentPostIndex + 1]
          nextPostLink = "/s/" + document._id + "/p/" + nextPost._id;
        } else if (currentChapterIndex + 1 < currentSequenceLength) {
          nextPost = document.chapters[currentChapterIndex + 1].posts[0]
          nextPostLink = "/s/" + document._id + "/p/" + nextPost._id;
        } else {
          nextPostLink = "/sequences/" + document._id;
        }

        if (currentPostIndex > 0) {
          previousPost = currentChapter.posts[currentPostIndex - 1]
          previousPostLink = "/s/" + document._id + "/p/" + previousPost._id;
        } else if (currentChapterIndex > 1) {
          previousPost = document.chapters[currentChapterIndex - 1].posts[document.chapters[currentChapterIndex-1].length - 1];
          previousPostLink = "/s/" + document._id + "/p/" + previousPost._id;
        } else {
          previousPostLink = "/s/" + document._id + "/p/" + document._id;
        }

        return <Components.RecommendedReading sequence={document} chapter={currentChapter} post={post} previousPost={previousPost} nextPost={nextPost} nextTitle={nextTitle} nextLink={nextLink}/>
      }
    }
  } else {
    return <Components.Loading />
  }
};

const options = {
  collection: Sequences,
  queryName: "SequencesNavigationQuery",
  fragmentName: 'SequencesNavigationFragment',
  totalResolver: false,
}

registerComponent('RecommendedReadingWrapper', RecommendedReadingWrapper, [withDocument, options]);
