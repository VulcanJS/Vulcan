import { Components, registerComponent } from 'meteor/vulcan:core';
import React from 'react';

const Section = ({title, titleWidth = 220, contentWidth = 675, TitleComponent, children}) => {

  return (
    <div className="Section" style={{width: `${titleWidth+contentWidth}px`}}>
      <div className="SectionTitle" style={{width: `${titleWidth}px`, float: 'left'}}>
        {title}
        {TitleComponent ? <TitleComponent /> : null}
      </div>
      <div className="SectionContent" style={{width: `${contentWidth}`, float: 'right'}}>
        {children}
      </div>
    </div>
  )
};

registerComponent('Section', Section);
