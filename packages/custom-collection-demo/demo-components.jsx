import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { ListContainer } from "meteor/utilities:react-list-container";
import NovaForm from "meteor/nova:forms";
import { Button } from 'react-bootstrap';
import { Accounts } from 'meteor/std:accounts-ui';
import { ModalTrigger, Messages, FlashContainer } from "meteor/nova:core";

const FlashMessages = Telescope.components.FlashMessages;

//////////////////////////////////////////////////////
// MoviesWrapper                                    //
//////////////////////////////////////////////////////

class MoviesWrapper extends Component {
  render() {
    return (
      <div className="wrapper">

        <div style={{maxWidth: "300px"}}>
          <Accounts.ui.LoginForm />
        </div>

        <FlashContainer component={FlashMessages}/>

        <div className="main">
          <ListContainer 
            collection={Movies} 
            publication="movies.list"
            terms={{options: {sort: {createdAt: -1}}}}
            options={{sort: {createdAt: -1}}}
            joins={Movies.getJoins()}
            limit={5}
            component={MoviesList}
            listId="movies.list"
          />
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
      <div className="add-movie">
        <ModalTrigger 
          title="Add Movie" 
          component={<Button bsStyle="primary">Add Movie</Button>}
        >
          <NovaForm 
            collection={Movies} 
            methodName="movies.create" 
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
      <ModalTrigger 
        label="Edit Movie" 
        component={<Button bsStyle="primary">Edit Movie</Button>} 
      >
        <NovaForm 
          collection={Movies} 
          currentUser={this.props.currentUser} 
          document={movie} 
          methodName="movies.edit"
        />
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
      <div key={movie.name} style={{paddingBottom: "15px",marginBottom: "15px", borderBottom: "1px solid #ccc"}}>
        <h2>{movie.name} ({movie.year})</h2>
        <p>{movie.review} – by <strong>{movie.user && movie.user.username}</strong></p>
        {this.renderEdit()}
      </div>
    )
  }

};

const LoadMore = props => <a href="#" className="load-more button button--primary" onClick={props.loadMore}>Load More ({props.count}/{props.totalCount})</a>

export default MoviesWrapper