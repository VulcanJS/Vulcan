import { Components, registerComponent} from 'meteor/vulcan:core';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router';

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
  const recentPostsTerms = _.isEmpty(props.location && props.location.query) ? {view: 'top', limit: 5}: props.location.query;
  const featuredPostsTerms = {view: 'featured', limit: 3};
  return (
    <div className="home">
        <Components.Section contentStyle={{marginTop: '-20px'}} title="Recommended Reading">
          <Components.CollectionsCard collection={testCollections[0]} big={true} url={"/sequences"}/>
          <Components.CollectionsCard collection={testCollections[1]} float={"left"} url={"/hpmor"}/>
          <Components.CollectionsCard collection={testCollections[2]} float={"right"} url={"/codex"}/>
        </Components.Section>
        <Components.Section title="Featured Posts">
          <Components.PostsList terms={featuredPostsTerms} showHeader={false} showLoadMore={false} />
        </Components.Section>
        <Components.Section title="Recent Posts"
          titleComponent= {<div className="recent-posts-title-component">
            sorted by<br /> <Components.PostsViews />
          <div className="new-post-link"><Link to={"/newPost"}> new post </Link></div>
          </div>}>
          <Components.PostsList terms={recentPostsTerms} showHeader={false} />
        </Components.Section>

         <Components.Section title="Recent Comments">
          <Components.RecentComments terms={{view: 'recentComments', limit: 5}} fontSize="small" />
        </Components.Section>
    </div>
  )
};

registerComponent('Home', Home);
