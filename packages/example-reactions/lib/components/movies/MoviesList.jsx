/* 

List of movies. 
Wrapped with the "withList" and "withCurrentUser" containers.

*/

import React from 'react';
import Helmet from 'react-helmet';
import { Components, withCurrentUser, registerComponent } from 'meteor/vulcan:core';

import Movies from '../../modules/movies/collection.js';

const ReactionCell = ({column, document, currentUser}) =>
  <Components.Reaction collection={Movies} document={document} currentUser={currentUser} />

const MoviesList = ({results = [], currentUser, loading, loadMore, count, totalCount}) => 
  
  <div style={{maxWidth: '500px', margin: '20px auto'}}>

    <Components.FlashMessages />

    <Helmet>
      <link name="bootstrap" rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css"/>
    </Helmet>

    {/* user accounts */}

    <div style={{padding: '20px 0', marginBottom: '20px', borderBottom: '1px solid #ccc'}}>
    
      <Components.AccountsLoginForm />
    
    </div>

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
