import { Components, registerComponent, withList } from 'meteor/vulcan:core';
import React from 'react';
import { Link } from 'react-router';
import Sequences from '../../lib/collections/sequences/collection.js';

const SequencesGrid = ({results, loading}) => {
  if (results && results.length && !loading) {
    const sequences = results;
    return (<div className='sequences-grid'>
      <div className="sequences-grid-content">
          {sequences.map(sequence => {
            return (<Link to={"/sequences/"+sequence._id}><Components.SequencesGridItem sequence={sequence} key={sequence._id} /></Link>);
        })}
      </div>
    </div>);
  } else {
    return <Components.Loading />
  }
};

const options = {
  collection: Sequences,
  queryName: 'SequencesGridQuery',
  fragmentName: 'SequencesPageFragment',
}


registerComponent('SequencesGrid', SequencesGrid, withList(options));
