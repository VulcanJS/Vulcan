import { Components, registerComponent } from 'meteor/vulcan:core';
import React from 'react';

const Section = ({contentStyle, title, titleWidth = 220, contentWidth = 715, titleComponent, children}) => {

  return (
    <div className="section" style={{width: `${titleWidth+contentWidth+5}px`, display: 'flex'}}>
      <div className="section-title" style={{width: `${titleWidth}px`}}>
        <h2>{title}</h2>
        {titleComponent ? titleComponent : null}
      </div>
      <div className="section-content" style={{width: `${contentWidth}`, ...contentStyle}}>
        {children}
      </div>
    </div>
  )
};

registerComponent('Section', Section);
