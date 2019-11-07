import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';

// HasMany Relation
const CardItemRelationHasMany = ({ relatedDocument: relatedDocuments, Components, ...rest }) => (
  <div className="contents-hasmany">
    {relatedDocuments.map(relatedDocument => (
      <Components.CardItemRelationItem
        key={relatedDocument._id}
        relatedDocument={relatedDocument}
        Components={Components}
        {...rest}
      />
    ))}
  </div>
);
registerComponent({ name: 'CardItemRelationHasMany', component: CardItemRelationHasMany });
