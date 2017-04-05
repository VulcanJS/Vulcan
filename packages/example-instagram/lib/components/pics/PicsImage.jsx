import React, { PropTypes, Component } from 'react';

const PicsImage = ({imageUrl, onClick}) =>

  <div className="pics-image" onClick={onClick}>
    
    <img src={`http://vulcanjs.org/photos/${imageUrl}`}/>
  
  </div>

export default PicsImage;