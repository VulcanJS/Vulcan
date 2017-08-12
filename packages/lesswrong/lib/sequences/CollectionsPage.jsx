import React, { PropTypes, Component } from 'react';
import { Components, withDocument, registerComponent } from 'meteor/vulcan:core';
import moment from 'moment';
import Sequences from '../collections/sequences/collection.js';
import Collections from '../collections/collections/collection.js';
import classNames from 'classnames';

const collection = {
  title: "Map and Territory",
  id: "dummyId",
  user: {displayName: "EliezerYudkowsky"},
  description: "Rationality: From AI to Zombies serves as a long-form introduction to formative ideas behind LessWrong, the Machine Intelligence Research Institute, the Center for Applied Rationality, and substantial parts of the effective altruist community.",
  image: "http://i.imgur.com/dVXiZtw.png",
  color: "#B1D4B4",
  big: true,
  createdAt: "2017-08-06T21:15:49.175Z",
  sequences: [
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
  ]
};

const subtitle = (subtitle) => {
  <div className="sequence-subtitle">{subtitle}</div>
};

const CollectionsPage = ({collection, currentUser, loading, error}) => {
  if (collection && collection.length) {
  return (<div className="collections-page">
      <div className="collection-name">{collection.title}</div>
      <div className="collection-description">{collection.description}</div>
      <div className="collections-page-content">
      {/* For each sequence, print a section with a grid of sequences */}
      {collection.sequences.map(sequence => {
        <Components.Section title={sequence.title}
          titleComponent={subtitle(sequence.subtitle)}>
          <div className="sequence-description">{sequence.description}</div>
          <Components.SequencesGrid terms={communitySeqTerms} className="sequence-grid-list" />
        </Components.Section>
      })}
    </div>
    </div>);
  } else if (loading) {
    return (<div className={classNames(className, 'collections-page')}>
      <div className="collections-page-content">
        <Components.PostsLoading/>
      </div>
    </div>);
  } else {
    // TODO: Replace with CollectionsNoResults
    return (<div className={classNames(className, 'collections-page')}>
      {error ? <Error error={error} /> : null }
      <div className="collections-page-content">
        <Components.PostsNoResults/>
      </div>
    </div>);
  }
};

const withMockDocument = (collectionsDocumentComp) => {
  return (options) => {
    return collectionsDocumentComp({loading: false, collection: collection, error: null, ...options});
  }
};

const options = {
  collection: Collections,
  fragmentName: 'CollectionPageFragment'
};

registerComponent('CollectionsPage', withMockDocument(CollectionsPage),
// withDocument(options)
);
