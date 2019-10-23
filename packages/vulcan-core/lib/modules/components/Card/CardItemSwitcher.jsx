import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';

const getTypeName = (value, fieldName, collection) => {
  const schema = collection && collection.simpleSchema()._schema;
  const fieldSchema = schema && schema[fieldName];
  if (fieldSchema) {
    const type = fieldSchema.type.singleType;
    const typeName = typeof type === 'function' ? type.name : type;
    return typeName;
  } else {
    return typeof value;
  }
};

const CardItemSwitcher = props => {
  // if typeName is not provided, default to typeof value
  // note: contents provides additional clues about the contents (image, video, etc.)

  let { value, typeName, contents, Components, fieldName, collection } = props;

  if (!typeName) {
    if (collection) {
      typeName = getTypeName(value, fieldName, collection);
    } else {
      typeName = typeof value;
    }
  }

  const itemProps = { value, Components };

  // no value; we return an empty string
  if (typeof value === 'undefined' || value === null) {
    return '';
  }

  // JSX element
  if (React.isValidElement(value)) {
    return value;
  }

  // Array
  if (Array.isArray(value)) {
    typeName = 'Array';
  }

  switch (typeName) {
    case 'Boolean':
    case 'boolean':
    case 'Number':
    case 'number':
    case 'SimpleSchema.Integer':
      return <Components.CardItemNumber {...itemProps} />;

    case 'Array':
      return <Components.CardItemArray {...itemProps} />;

    case 'Object':
    case 'object':
      return <Components.CardItemObject {...itemProps} />;

    case 'Date':
      return <Components.CardItemDate {...itemProps} />;

    case 'String':
    case 'string':
      switch (contents) {
        case 'html':
          return <Components.CardItemHTML {...itemProps} />;

        case 'date':
          return <Components.CardItemDate {...itemProps} />;

        case 'image':
          return <Components.CardItemImage {...itemProps} force={true} />;

        case 'url':
          return <Components.CardItemURL {...itemProps} force={true} />;

        default:
          // still attempt to parse string as an image or URL if possible
          return <Components.CardItemImage {...itemProps} />;
      }

    default:
      return <Components.CardItemDefault {...itemProps} />;
  }
};
registerComponent({ name: 'CardItemSwitcher', component: CardItemSwitcher });
