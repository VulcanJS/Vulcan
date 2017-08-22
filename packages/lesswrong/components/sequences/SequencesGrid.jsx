import { Components, registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import { Link } from 'react-router';

const SequencesGrid = ({sequences}) => {
  if (sequences && sequences.length) {
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


registerComponent('SequencesGrid', SequencesGrid);
