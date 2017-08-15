import React, { Component } from 'react';
import { registerComponent, Components } from 'meteor/vulcan:core';
import algoliaClient from 'algoliasearch/src/browser/builds/algoliasearch'
import Paper from 'material-ui/Paper';

import { InstantSearch, Hits, SearchBox, Highlight, RefinementList, Pagination, CurrentRefinements, ClearAll, Snippet, Configure, Index} from 'react-instantsearch/dom';
import FontIcon from 'material-ui/FontIcon';

const closeIconStyle = {
  fontSize: '14px',
}


class SearchBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
    }
  }

  openSearch = () => {
    this.setState({open: true})
  }

  closeSearch = () => {
    this.setState({open: false})
  }

  render() {
    const className = this.state.open ? "open" : null
    return <div className="search">
      <InstantSearch
        indexName="test_posts"
        algoliaClient={algoliaClient("Z0GR6EXQHD", "0b1d20b957917dbb5e1c2f3ad1d04ee2")}
        >
        <div className={"search-bar " + className}>
          <div onTouchTap={this.openSearch} className="search-bar-box">
            <SearchBox resetComponent={<div></div>}/>
          </div>
          <div className="search-bar-close" onTouchTap={this.closeSearch}>
            <FontIcon className="material-icons" style={closeIconStyle}>close</FontIcon>
          </div>
        </div>
        <div className={"search-results " + className}>
          <div className="search-results-container">
            <div className="search-results-container-left">
              <div className="search-results-posts">
                  <Configure hitsPerPage={5} />
                  <Components.Section title="Posts" titleWidth={150}>
                    <div className="search-results-posts-content">
                      <Hits hitComponent={Components.PostsSearchHit} />
                    </div>
                    <Pagination />
                  </Components.Section>
              </div>
              <div className="search-results-comments">
                <Index indexName="test_comments">
                  <Configure hitsPerPage={5} />
                  <Components.Section title="Comments" titleWidth={150}>
                    <div className="search-results-comments-content">
                      <Hits hitComponent={Components.CommentsSearchHit} />
                    </div>
                     <object><Pagination /></object>
                  </Components.Section>
                </Index>
              </div>
            </div>
            <div className="search-results-container-right">
              <div className="search-results-users">
                <Index indexName= "test_users">
                  <Configure hitsPerPage={5} />
                  <div className="search-results-user-heading">
                    <h2>Users</h2>
                  </div>
                  <div className="search-resulsts-users-content">
                    <Hits hitComponent={Components.UsersSearchHit} />
                  </div>
                </Index>
              </div>
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  }
}

registerComponent("SearchBar", SearchBar);

//
// const Search = () =>
//
//
// const Post = (props) =>
//   <div>
//     <hr />
//     <span className="hit-title">
//       <Highlight attributeName="title" hit={props.hit} />
//     </span>
//     <br />
//     <span className="hit-htmlBody">
//       <Snippet attributeName="htmlBody" hit={props.hit} />
//     </span>
//   </div>
