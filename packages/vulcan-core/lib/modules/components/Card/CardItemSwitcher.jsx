import { getCollectionByTypeName, registerComponent } from 'meteor/vulcan:lib';
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

const getFieldSchema = (fieldName, collection) => {
  const schema = collection && collection.simpleSchema()._schema;
  const fieldSchema = schema && schema[fieldName];
  return fieldSchema;
};

const CardItemSwitcher = props => {
  // if typeName is not provided, default to typeof value
  // note: contents provides additional clues about the contents (image, video, etc.)

  let { nestingLevel = 0, value, typeName, contents, Components, fieldName, collection, document } = props;

  const fieldSchema = getFieldSchema(fieldName, collection);

  if (!typeName) {
    if (collection) {
      typeName = getTypeName(value, fieldName, collection);
    } else {
      typeName = typeof value;
    }
  }

  const itemProps = { nestingLevel: nestingLevel + 1, value, Components, document, fieldName, collection, fieldSchema };

  // no value; we return an empty string
  if (typeof value === 'undefined' || value === null) {
    return '';
  }

  // JSX element
  if (React.isValidElement(value)) {
    return value;
  }

  // Relation
  if (fieldSchema && fieldSchema.resolveAs && fieldSchema.resolveAs.relation) {
    itemProps.relatedFieldName = fieldSchema.resolveAs.fieldName || fieldName;
    itemProps.relatedDocument = document[itemProps.relatedFieldName];
    itemProps.relatedCollection = getCollectionByTypeName(fieldSchema.resolveAs.typeName || fieldSchema.resolveAs.type);

    if (!itemProps.relatedDocument) {
      return (
        <span>
          Missing data for sub-document <code>{value}</code> of type <code>{typeName}</code> (<code>{itemProps.relatedFieldName}</code>)
        </span>
      );
    }

    switch (fieldSchema.resolveAs.relation) {
      case 'hasOne':
        return <Components.CardItemRelationHasOne {...itemProps} />;

      case 'hasMany':
        return <Components.CardItemRelationHasMany {...itemProps} />;

      default:
        return <Components.CardItemDefault {...itemProps} />;
    }
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
