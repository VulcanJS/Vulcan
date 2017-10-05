/* 

My Reactions

Use Datatable together with userReactedMovies view

Pros: can use Datatable, pagination, withList, etc.
Cons: setting up view can be complex

*/

import React from 'react';
import { Components, withCurrentUser, registerComponent, withDocument } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import mapProps from 'recompose/mapProps';

import Movies from '../../modules/movies/index.js';

const ReactionCell = ({column, document, currentUser}) =>
  <Components.Reaction collection={Movies} document={document} currentUser={currentUser} />

const MyReactions = ({results = [], currentUser, loading, loadMore, count, totalCount}) => 
  
  <div>

    {currentUser ? <div>

      {loading ? 

        <Components.Loading /> :

        <div className="movies">

          {/* documents list */}

          <Components.Datatable 
            collection={Movies} 
            showSearch={false}
            showEdit={false}
            columns={[
              {
                name: 'reaction',
                component: ReactionCell
              },
              'name',
              'year',
              'review'
            ]}
            options={{
              terms: {view: 'userReactedMovies', userId: currentUser._id},
              fragmentName: 'MovieFragment',
            }}
          />
          
          {/* load more */}

          {totalCount > results.length ?
            <a href="#" onClick={e => {e.preventDefault(); loadMore();}}>Load More ({count}/{totalCount})</a> : 
            <p>No more items.</p>
          }

        </div>
      }

    </div> : <div>Please log in</div>}

  </div>

/*

We want the current user's votes to be loaded in memory on the client so
we need to wrap this component with withDocument. 

If we don't, we won't be able to properly filter the list on the client
inside the `userReactedMovies` view. 

*/
const options = {
  collection: Users,
  fragmentName: 'UserMoviesVotes',
};

const mapPropsFunction = props => ({...props, documentId: props.currentUser && props.currentUser._id});

registerComponent('MyReactions', MyReactions, withCurrentUser, mapProps(mapPropsFunction), [withDocument, options]);
