import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';

// HasOne Relation
const CardItemRelationHasOne = ({ Components, ...rest }) => (
  <div className="contents-hasone">
    {<Components.CardItemRelationItem Components={Components} {...rest} />}
  </div>
);
registerComponent({ name: 'CardItemRelationHasOne', component: CardItemRelationHasOne });
