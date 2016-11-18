import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";
import { Button } from 'react-bootstrap';
import { Accounts } from 'meteor/std:accounts-ui';
import { ModalTrigger } from "meteor/nova:core";
import withMoviesList from '../containers/withMoviesList';
import Movie from './Movie.jsx';
import Movies from '../collection.js';

const LoadMore = props => <a href="#" className="load-more button button--primary" onClick={props.loadMore}>Load More ({props.count}/{props.totalCount})</a>

class MoviesList extends Component {

  renderNew() {
    
    const component = (
      <div className="add-movie">
        <ModalTrigger 
          title="Add Movie" 
          component={<Button bsStyle="primary">Add Movie</Button>}
        >
          <NovaForm 
            collection={Movies} 
            mutationName="moviesNew" 
            currentUser={this.props.currentUser}
          />
        </ModalTrigger>
        <hr/>
      </div>
    )
    
    return !!this.props.currentUser ? component : "";
  }

  render() {
    return (
      <div className="movies">
        {this.renderNew()}
        {this.props.results && this.props.results.map(movie => <Movie key={movie._id} {...movie} currentUser={this.props.currentUser}/>)}
        {this.props.hasMore ? (this.props.ready ? <LoadMore {...this.props}/> : <p>Loading…</p>) : <p>No more movies</p>}
      </div>
    )
  }
};

export default withMoviesList(MoviesList);
