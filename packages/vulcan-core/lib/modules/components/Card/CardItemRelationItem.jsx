import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import { Link } from 'react-router-dom';

/*

Tokens are components used to display an invidual element like a user name, 
link to a post, category name, etc. 

The naming convention is Type+Token, e.g. UserToken, PostToken, CategoryToken…

*/

// Relation Item
const CardItemRelationItem = ({ relatedDocument, relatedCollection, Components }) => {
  const label = relatedCollection.options.getLabel
    ? relatedCollection.options.getLabel(relatedDocument)
    : relatedDocument._id;
  const typeName = relatedDocument.__typename;
  const Token = Components[`${typeName}Token`];
  return Token ? (
    <Token document={relatedDocument} label={label} />
  ) : (
    <Components.DefaultToken document={relatedDocument} label={label} />
  );
};
registerComponent({ name: 'CardItemRelationItem', component: CardItemRelationItem });

// Default Token
const DefaultToken = ({ document, label }) => (
  <li className="relation-default-token">
    {document.pagePath ? <Link to={document.pagePath}>{label}</Link> : <span>{label}</span>}
  </li>
);
registerComponent({ name: 'DefaultToken', component: DefaultToken });

// User Token
const UserToken = ({ document }) => (
  <div className="contents-user user-item">
    <Components.Avatar size="small" user={document} />
    {document.pagePath ? (
      <Link className="user-item-name" to={document.pagePath}>
        {document.displayName}
      </Link>
    ) : (
      <span className="user-item-name">{document.displayName}</span>
    )}
  </div>
);
registerComponent({ name: 'UserToken', component: UserToken });
