import NoSSR from 'react-no-ssr';

//////////////////////////////////////////////////////
// MoviesWrapper                                    //
//////////////////////////////////////////////////////

MoviesWrapper = React.createClass({

  render() {

    ({ListContainer, FlashContainer} = Telescope.components);

    return (
      <div>

        <NoSSR onSSR={<p>Loading…</p>}>
          <LogInButtons />
        </NoSSR>

        <FlashContainer />

        <div className="main">
          <ListContainer 
            collection={Movies} 
            publication="movies.list"
            terms={{options: {sort: {createdAt: -1}}}}
            options={{sort: {createdAt: -1}}}
            joins={Movies.simpleSchema().getJoins()}
            limit={4}
          >
            <MoviesList/>
          </ListContainer>
        </div>

      </div>
    )
  }
})

//////////////////////////////////////////////////////
// MoviesList                                       //
//////////////////////////////////////////////////////

MoviesList = React.createClass({

  renderNew() {
    
    ({ModalButton, NewDocContainer} = Telescope.components);

    const component = (
      <ModalButton label="Add Movie" className="button button--primary">
        <NewDocContainer collection={Movies} label="Add Movie" methodName="movies.create"/>
      </ModalButton>
    )
    
    return !!this.props.currentUser ? component : "";
  },

  render() {
    ({LoadMore} = Telescope.components);

    return (
      <div className="movies">
        {this.renderNew()}
        {this.props.results.map(movie => <Movie key={movie._id} {...movie} currentUser={this.props.currentUser}/>)}
        {this.props.hasMore ? (this.props.ready ? <LoadMore {...this.props}/> : <p>Loading…</p>) : <p>No more movies</p>}
      </div>
    )
  }
});

//////////////////////////////////////////////////////
// Movie                                            //
//////////////////////////////////////////////////////

Movie = React.createClass({


  renderEdit() {

    ({ModalButton, EditDocContainer} = Telescope.components);

    const movie = this.props;

    const component = (
      <ModalButton label="Edit" className="button button--secondary">
        <EditDocContainer collection={Movies} document={movie} label="Edit Movie" methodName="movies.edit"/>
      </ModalButton>
    );

    return (
      <div className="item-actions">
        {this.props.currentUser && this.props.currentUser._id === movie.userId ? component : ""}
      </div>
    )
  },

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

});