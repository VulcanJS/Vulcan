import React, { PropTypes, Component } from 'react';

import NoSSR from 'react-no-ssr';

import Core from 'meteor/nova:core';
import SmartContainers from "meteor/utilities:react-list-container";
import FormContainers from "meteor/nova:forms";

const ModalTrigger = Core.ModalTrigger;
const NewDocument = FormContainers.NewDocument;
const EditDocument = FormContainers.EditDocument;
const ListContainer = SmartContainers.ListContainer;

const FlashContainer = Telescope.components.FlashContainer;
const FlashMessages = Telescope.components.FlashMessages;

//////////////////////////////////////////////////////
// MoviesWrapper                                    //
//////////////////////////////////////////////////////

class MoviesWrapper extends Component {
  render() {
    return (
      <div className="wrapper">

        <NoSSR onSSR={<p>Loading…</p>}>
          <LogInButtons />
        </NoSSR>

        <FlashContainer component={FlashMessages}/>

        <div className="main">
          <ListContainer 
            collection={Movies} 
            publication="movies.list"
            terms={{options: {sort: {createdAt: -1}}}}
            options={{sort: {createdAt: -1}}}
            joins={Movies.getJoins()}
            limit={5}
          >
            <MoviesList/>
          </ListContainer>
        </div>

      </div>
    )
  }
}

//////////////////////////////////////////////////////
// MoviesList                                       //
//////////////////////////////////////////////////////

class MoviesList extends Component {

  renderNew() {
    
    const component = (
      <ModalTrigger label="Add Movie" className="button button--primary">
        <NewDocument collection={Movies} label="Add Movie" methodName="movies.create"/>
      </ModalTrigger>
    )
    
    return !!this.props.currentUser ? component : "";
  }

  render() {

    return (
      <div className="movies">
        {this.renderNew()}
        {this.props.results.map(movie => <Movie key={movie._id} {...movie} currentUser={this.props.currentUser}/>)}
        {this.props.hasMore ? (this.props.ready ? <LoadMore {...this.props}/> : <p>Loading…</p>) : <p>No more movies</p>}
      </div>
    )
  }
};

//////////////////////////////////////////////////////
// Movie                                            //
//////////////////////////////////////////////////////
class Movie extends Component {

  renderEdit() {

    const movie = this.props;

    const component = (
      <ModalTrigger label="Edit" className="button button--secondary">
        <EditDocument collection={Movies} document={movie} label="Edit Movie" methodName="movies.edit"/>
      </ModalTrigger>
    );

    return (
      <div className="item-actions">
        {this.props.currentUser && this.props.currentUser._id === movie.userId ? component : ""}
      </div>
    )
  }

  render() {
    
    const movie = this.props;

    return (
      <div key={movie.name} style={{marginBottom: "15px"}}>
        <h2>{movie.name} ({movie.year})</h2>
        <p>{movie.review} – by <strong>{movie.user && movie.user.username}</strong></p>
        {this.renderEdit()}
      </div>
    )
  }

};

const LoadMore = props => <a href="#" className="load-more button button--primary" onClick={props.loadMore}>Load More ({props.count}/{props.totalCount})</a>

export default MoviesWrapper