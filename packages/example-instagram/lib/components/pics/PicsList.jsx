/* 

List of pics. 
Wrapped with the "withList" and "withCurrentUser" containers.

*/

import React, { PropTypes, Component } from 'react';
import { Components, withList, withCurrentUser, Loading } from 'meteor/vulcan:core';

import Pics from '../../modules/pics/collection.js';
import PicsItem from './PicsItem.jsx';

const PicsList = ({results = [], currentUser, loading, loadMore, count, totalCount}) => 
  
  <div className="pics-list">

    {loading ? 

      <Loading /> :

      <div className="pics-list-content">

        <div className="pics-list-grid">
          {results.map(pic => <PicsItem key={pic._id} pic={pic} currentUser={currentUser} />)}
        </div>

        <div className="pics-list-footer">
          {totalCount > results.length ?
            <a className="load-more" href="#" onClick={e => {e.preventDefault(); loadMore();}}>Load More ({count}/{totalCount})</a> : 
            <p className="no-more">No more items.</p>
          }
        </div>
        
      </div>
    }

  </div>

const options = {
  collection: Pics,
  fragmentName: 'PicsItemFragment',
  limit: 6
};

export default withList(options)(withCurrentUser(PicsList));