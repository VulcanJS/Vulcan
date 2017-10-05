/* 

List of movies. 
Wrapped with the "withList" and "withCurrentUser" containers.

*/

import React from 'react';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import Movies from '../../modules/movies/index.js';

const ReactionCell = ({column, document, currentUser}) =>
  <Components.Reaction collection={Movies} document={document} currentUser={currentUser} />

const MoviesList = ({results = [], currentUser, loading, loadMore, count, totalCount}) => 
  
  <div>

    {loading ? 

      <Components.Loading /> :

      <div className="movies">
        
        {/* new document form */}

        {Movies.options.mutations.new.check(currentUser) ?
          <div style={{marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #ccc'}}>
            <h4>Insert New Document</h4>
            <Components.SmartForm collection={Movies} /> 
          </div> :
          null
        }

        {/* documents list */}

        <Components.Datatable 
          collection={Movies} 
          showSearch={false}
          showEdit={true}
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

  </div>

registerComponent('MoviesList', MoviesList, withCurrentUser);
