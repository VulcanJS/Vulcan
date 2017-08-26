import React, { PropTypes, Component } from 'react';
import { Components, withDocument, registerComponent } from 'meteor/vulcan:core';
import Sequences from '../../lib/collections/sequences/collection.js';
import moment from 'moment';
import Posts from 'meteor/vulcan:posts';

const testCollections = [
  {
    title: "The Core Sequences",
    id: "dummyId",
    user: {displayName: "EliezerYudkowsky"},
    summary: "The Core Sequences contain many of the formative ideas behind the Machine Intelligence Research Institute, the Center for Applied Rationality, and substantial parts of the effective altruist community.",
    image: "http://i.imgur.com/dVXiZtw.png",
    color: "#B1D4B4",
    big: true,
  },
  {
    title: "The Codex",
    id: "dummyId2",
    user: {displayName: "Yvain"},
    summary: "The Codex contains essays about science, medicine, philosophy, politics, and futurism. (There’s also one post about hallucinatory cactus-people, but it’s not representative)",
    image: "http://i.imgur.com/ItFKgn4.png",
    color: "#88ACB8",
    big: false,
  },
  {
    title: "Harry Potter and the Methods of Rationality",
    id: "dummyId3",
    user: {displayName: "EliezerYudkowsky"},
    summary: "In an Alternate Universe, Petunia married a scientist. Now Rationalist!Harry enters the wizarding world armed with Enlightenment ideals and the experimental spirit.",
    image: "http://i.imgur.com/uu4fJ5R.png",
    color: "#757AA7",
    big: false,
  }
];

const SequencesHome = ({document, currentUser, loading}) => {
  console.log("// Rendering SequencesHome component.");
  // TODO: decide on terms for community sequences
  const communitySeqTerms = {};
  return <div className="sequences-home">
    {/* Title */}
    <Components.Section>
      <div className="sequences-header">
        <div className="sequences-list-title">
          <h1>The Library</h1>
        </div>
        {/* Description */}
        <div className="sequences-list-description">
          Sequences are collections of posts that are curated by the community and
          are structured similarly to books. This is the place where you can find
          the best posts on LessWrong in easy to read formats.
        </div>
      </div>
    </Components.Section>
    {/* Curated collections tripartite */}
    <div className="sequences-list-curated-collections">
      <Components.Section title="Curated Collections">
        <div className="recommended-reading-section">
          <Components.CollectionsCard collection={testCollections[0]} big={true}/>
          <Components.CollectionsCard collection={testCollections[1]} float={"left"}/>
          <Components.CollectionsCard collection={testCollections[2]} float={"right"}/>
        </div>
      </Components.Section>
    </div>
    {/* Other curated sequences grid (make a sequencesGrid component w/ flexbox) */}
    <div className="sequences-list-curated-sequences">
      <Components.Section title="Other Curated Sequences">
        <Components.SequencesGridWrapper terms={communitySeqTerms} className="community-sequences-grid" />
      </Components.Section>
    </div>
    {/* In-progress sequences grid (make a sequencesGrid component w/ flexbox)*/}
    {/*<div className="sequences-list-progress-sequences">
      <Components.Section title="In Progress Sequences">
        <Components.SequencesGridWrapper terms={communitySeqTerms} className="community-sequences-grid" />
      </Components.Section>
    </div> */}
    {/* Community sequences list (make a sequencesList w/ roll your own list) */}
    <div>
      <div className="sequences-list-community-sequences">
        <Components.Section title="Community Sequences">
          <Components.SequencesList terms={communitySeqTerms} className="community-sequences-list" />
        </Components.Section>
      </div>
    </div>
  </div>;
};

// const options = {
//   collection: Sequences,
//   fragmentName: 'SequenceListFragment'
// };

registerComponent(
  'SequencesHome',
  SequencesHome,
  //withList(options)
);
