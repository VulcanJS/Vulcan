import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';

// Array
const CardItemArray = ({ nestingLevel, value, Components }) => (
  <ol className="contents-array">
    {value.map((item, index) => (
      <li key={index}>
        {
          <Components.CardItemSwitcher
            value={item}
            typeName={typeof item}
            Components={Components}
            nestingLevel={nestingLevel}
          />
        }
      </li>
    ))}
  </ol>
);
registerComponent({ name: 'CardItemArray', component: CardItemArray });
