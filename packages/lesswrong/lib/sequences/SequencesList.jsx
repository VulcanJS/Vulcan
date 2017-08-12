import { Components, registerComponent, withList, withCurrentUser, Utils } from 'meteor/vulcan:core';
import React from 'react';
import Sequences from '../collections/sequences/collection.js';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';
import classNames from 'classnames';
// import PropTypes from 'prop-types';

const results = [
  {
    title: "Map and Territory",
    id: "dummyId",
    user: {displayName: "EliezerYudkowsky"},
    summary: "Rationality: From AI to Zombies serves as a long-form introduction to formative ideas behind LessWrong, the Machine Intelligence Research Institute, the Center for Applied Rationality, and substantial parts of the effective altruist community.",
    image: "http://i.imgur.com/dVXiZtw.png",
    color: "#B1D4B4",
    big: true,
    createdAt: "2017-08-06T21:15:49.175Z",
    commentCount: 100,
    finishedPosts: 10,
    totalPosts: 14
  },
  {
    title: "Rationality and Rationalization",
    id: "dummyId2",
    user: {displayName: "Yvain"},
    summary: "Welcome to Slate Star Codex, a blog about science, medicine, philosophy, politics, and futurism. (there’s also one post about hallucinatory cactus-people, but it’s not representative)",
    image: "http://i.imgur.com/dVXiZtw.png",
    color: "#88ACB8",
    big: false,
    createdAt: "2017-08-06T21:15:49.175Z",
    commentCount: 12,
    finishedPosts: 10,
    totalPosts: 14
  },
  {
    title: "HPJEV and the Methods of Rationality",
    id: "dummyId3",
    user: {displayName: "EliezerYudkowsky"},
    summary: "Every inch of wall space is covered by a bookcase. Each bookcase has six shelves, going almost to the ceiling. Some bookshelves are stacked to the brim with hardback books.",
    image: "http://i.imgur.com/dVXiZtw.png",
    color: "#757AA7",
    big: false,
    createdAt: "2017-08-06T21:15:49.175Z",
    commentCount: 36,
    finishedPosts: 10,
    totalPosts: 14
  }
];

const SequencesList = ({className, loading, currentUser, terms, results, error}) => {
  console.log("//   Rendering SequencesList");
  if (results && results.length) {
    // render list of sequences
    return (<div className={classNames(className, 'sequences-list')}>
      <div className="sequences-list-content">
          {results.map(sequence => {
            return (<div className="sequences-list-item">
              <Components.SequencesListItem sequence={sequence} key={sequence._id}
              currentUser={currentUser} terms={terms} />
            </div>);
        })}
      </div>
    </div>);
  } else if (loading) {
    // TODO: Replace with SequencesLoading
    return (<div className={classNames(className, 'sequences-list')}>
      <div className="sequences-list-content">
        <Components.PostsLoading/>
      </div>
    </div>);
  } else {
    // TODO: Replace with SequencesNoResults
    return (<div className={classNames(className, 'sequences-list')}>
      {error ? <Error error={error} /> : null }
      <div className="sequences-list-content">
        <Components.PostsNoResults/>
      </div>
    </div>);
  }
};

const withMockList = (seqListComp) => {
  return (options) => {
    return SequencesList({loading: false, results: results, error: null, ...options});
  }
};

SequencesList.displayName = "SequencesList";

/* contextTypes omitted because it's only for debugging; see SequencesList */
/* What is contextTypes for? */


SequencesList.contextTypes = {
  intl: intlShape
};

const options = {

};

registerComponent('SequencesList', withMockList(SequencesList), withCurrentUser,
// [withList, options]
);
