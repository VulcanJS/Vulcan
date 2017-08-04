import { Components, getRawComponent, registerComponent} from 'meteor/vulcan:core';
import React from 'react';
import { Col, Row } from 'react-bootstrap';

const testCollections = [
  {
    title: "The Core Sequences",
    id: "dummyId",
    user: {displayName: "EliezerYudkowsky"},
    summary: "Rationality: From AI to Zombies serves as a long-form introduction to formative ideas behind LessWrong, the Machine Intelligence Research Institute, the Center for Applied Rationality, and substantial parts of the effective altruist community.",
    image: "http://i.imgur.com/dVXiZtw.png",
    color: "#B1D4B4",
    big: true,
  },
  {
    title: "The Library of Scott Alexandria",
    id: "dummyId2",
    user: {displayName: "Yvain"},
    summary: "Welcome to Slate Star Codex, a blog about science, medicine, philosophy, politics, and futurism. (there’s also one post about hallucinatory cactus-people, but it’s not representative)",
    image: "http://i.imgur.com/ItFKgn4.png",
    color: "#88ACB8",
    big: false,
  },
  {
    title: "Harry Potter and the Methods of Rationality",
    id: "dummyId3",
    user: {displayName: "EliezerYudkowsky"},
    summary: "Every inch of wall space is covered by a bookcase. Each bookcase has six shelves, going almost to the ceiling. Some bookshelves are stacked to the brim with hardback books.",
    image: "http://i.imgur.com/uu4fJ5R.png",
    color: "#757AA7",
    big: false,
  }
]

const Home = (props, context) => {
  const terms = _.isEmpty(props.location && props.location.query) ? {view: 'top', limit: 5}: props.location.query;

  return (
    <div className="home">
      <Row>
        <Components.Section contentStyle={{marginTop: '-20px'}} title="Recommended Reading">
          <Components.CollectionsCard collection={testCollections[0]} big={true}/>
          <Components.CollectionsCard collection={testCollections[1]} float={"left"}/>
          <Components.CollectionsCard collection={testCollections[2]} float={"right"}/>
        </Components.Section>
        <Components.Section title="Featured Posts">
          <Components.PostsList terms={terms} />
        </Components.Section>
        <Components.Section title="Recent Posts">
          <Components.PostsList terms={terms} />
        </Components.Section>
        <Components.Section title="Recent Comments">
          <Components.RecentComments terms={{view: 'recentComments', limit: 5}} fontSize="small" />
        </Components.Section>
        {/* Sidebar Layout */}
        <Col xs={12} md={8}>
          <Components.PostsList terms={terms}/>
        </Col>
        <Col xs={12} md={4}>
          <Components.Sidebar />
        </Col>
      </Row>
    </div>
  )
};

registerComponent('Home', Home);
