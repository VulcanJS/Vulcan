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
        indexName="dev_posts"
        algoliaClient={algoliaClient("Z0GR6EXQHD", "0b1d20b957917dbb5e1c2f3ad1d04ee2")}
        >
        <div className={"search-bar " + className}>
          <div onTouchTap={this.openSearch} className="search-bar-box">
            <SearchBox />
          </div>
          <div className="search-bar-close" onTouchTap={this.closeSearch}>
            <FontIcon className="material-icons" style={closeIconStyle}>close</FontIcon>
          </div>
        </div>
        <div className={"search-results " + className} onTouchTap={this.closeSearch}>
          <div className="search-results-container">
            <div className="search-results-posts">
              <Index indexName="test_posts">
                <Configure hitsPerPage={5} />
                <Components.Section title="Posts" titleWidth={150}>
                  <div className="search-results-posts-content">
                    <Hits hitComponent={Components.PostsSearchHit} />
                  </div>
                </Components.Section>
              </Index>
            </div>
            <div className="search-results-comments">
              <Index indexName="test_comments">
                <Configure hitsPerPage={5} />
                <Components.Section title="Comments" titleWidth={150}>
                  <div className="search-results-comments-content">
                    <Hits hitComponent={Components.CommentsSearchHit} />
                  </div>
                </Components.Section>
              </Index>
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
