/* 

My Reactions2

Variant: query for user.reactedMovies field directly

Pros: only requires setting up `reactedMovies` virtual field
Cons: cannot use Datatable/pagination/etc.

*/

import React from 'react';
import { Components, withCurrentUser, registerComponent, withDocument } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import mapProps from 'recompose/mapProps';

import Movies from '../../modules/movies/index.js';

const MyReactions2 = ({document, currentUser, loading, loadMore}) => 
  
  <div>

      {loading ? 

        <Components.Loading /> :

        <div className="movies">

          {document.reactedMovies.map(movie => <Components.Card key={movie._id} document={movie} collection={Movies} currentUser={currentUser} />)}
          
        </div>
      }

  </div>

const options = {
  collection: Users,
  fragmentName: 'UserReactedMovies',
};

const mapPropsFunction = props => ({...props, documentId: props.currentUser && props.currentUser._id});

registerComponent('MyReactions2', MyReactions2, withCurrentUser, mapProps(mapPropsFunction), [withDocument, options]);
