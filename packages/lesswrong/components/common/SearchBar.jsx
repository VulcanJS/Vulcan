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
      inputOpen: false,
      searchOpen: false,
      currentQuery: "",
    }
  }

  openSearchInput = () => {
    this.setState({inputOpen: true});
  }

  closeSearchInput = () => {
    this.setState({inputOpen: false});
  }

  openSearchResults = () => {
    this.setState({searchOpen: true});
  }

  closeSearchResults = () => {
    this.setState({searchOpen: false});
  }

  closeSearch = () => {
    this.setState({searchOpen: false, inputOpen: false});
  }

  handleSearchTap = () => {
    this.setState({inputOpen: true, searchOpen: this.state.currentQuery});
  }

  queryStateControl = (searchState) => {
    this.setState({currentQuery: searchState.query});
    if (searchState.query) {
      this.openSearchResults();
    } else {
      this.closeSearchResults();
    }
  }

  render() {
    const inputOpenClass = this.state.inputOpen ? "open" : null;
    const resultsOpenClass = this.state.searchOpen ? "open" : null;
    return <div className="search">
      <InstantSearch
        indexName="test_posts"
        algoliaClient={algoliaClient("Z0GR6EXQHD", "0b1d20b957917dbb5e1c2f3ad1d04ee2")}
        onSearchStateChange={this.queryStateControl}
        >
        <div className={"search-bar " + inputOpenClass}>
          <div className="search-bar-box">
            <SearchBox onTouchTap={this.handleSearchTap} resetComponent={<div className="search-box-reset"></div>} />
          </div>
          <div className="search-bar-close" onTouchTap={this.closeSearch}>
            <FontIcon className="material-icons" style={closeIconStyle}>close</FontIcon>
          </div>
        </div>
        <div className={"search-results " + resultsOpenClass}>
          <div className="search-results-container">
            <div className="search-results-container-left">
              <div className="search-results-posts">
                <Index indexName="test_posts">
                  <Configure hitsPerPage={3} />
                  <Components.Section title="Posts" titleWidth={150} titleComponent={<Pagination pagesPadding={0} showFirst={false}/>}>
                    <div className="search-results-posts-content" onTouchTap={this.closeSearch}>
                      <Hits hitComponent={Components.PostsSearchHit} />
                    </div>
                  </Components.Section>
                </Index>
              </div>
              <div className="search-results-comments">
                <Index indexName="test_comments">
                  <Configure hitsPerPage={3} />
                  <Components.Section title="Comments" titleWidth={150} titleComponent={<Pagination pagesPadding={0} showFirst={false}/>}>
                    <div className="search-results-comments-content" onTouchTap={this.closeSearch}>
                      <Hits hitComponent={Components.CommentsSearchHit} />
                    </div>
                  </Components.Section>
                </Index>
              </div>
            </div>
            <div className="search-results-container-right">
              <div className="search-results-users">
                <Index indexName= "test_users">
                  <Configure hitsPerPage={10} />
                  <div className="search-results-users-heading">
                    <h2>Users</h2>
                  </div>
                  <div className="search-resulsts-users-content" onTouchTap={this.closeSearch}>
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
