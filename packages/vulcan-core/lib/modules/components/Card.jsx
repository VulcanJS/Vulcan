import { registerComponent, Components, formatLabel } from 'meteor/vulcan:lib';
import withComponents from '../containers/withComponents';
import { intlShape, FormattedMessage } from 'meteor/vulcan:i18n';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { Link } from 'react-router-dom';
import without from 'lodash/without';

/*

Helpers

*/
const getLabel = (field, fieldName, collection, intl) => {
  const schema = collection && collection.simpleSchema()._schema;
  return formatLabel({
    intl,
    fieldName: fieldName,
    collectionName: collection && collection._name,
    schema: schema,
  });
};

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

/*

Card Item Components

*/

// Image
const CardItemImage = ({ value, force = false, Components }) => {
  const isImage =
    ['.png', '.jpg', '.gif'].indexOf(value.substr(-4)) !== -1 ||
    ['.webp', '.jpeg'].indexOf(value.substr(-5)) !== -1;
  return isImage || force ? (
    <img
      className="contents-image"
      style={{ width: '100%', minWidth: 80, maxWidth: 200, display: 'block' }}
      src={value}
      alt={value}
    />
  ) : (
    <Components.CardItemUrl value={value} Components={Components} />
  );
};
registerComponent({ name: 'CardItemImage', component: CardItemImage });

// URL
const CardItemUrl = ({ value, force, Components }) => {
  return force || value.slice(0, 4) === 'http' ? (
    <a className="contents-link" href={value} target="_blank" rel="noopener noreferrer">
      <Components.CardItemString string={value} />
    </a>
  ) : (
    <Components.CardItemString string={value} />
  );
};
registerComponent({ name: 'CardItemUrl', component: CardItemUrl });

// String
const CardItemString = ({ string }) => (
  <div className="contents-string">
    {string.indexOf(' ') === -1 && string.length > 30 ? (
      <span title={string}>{string.substr(0, 30)}…</span>
    ) : (
      <span>{string}</span>
    )}
  </div>
);
registerComponent({ name: 'CardItemString', component: CardItemString });

// Date
const CardItemDate = ({ value }) => (
  <span className="contents-date">{moment(new Date(value)).format('YYYY/MM/DD, hh:mm')}</span>
);
registerComponent({ name: 'CardItemDate', component: CardItemDate });

// Number
const CardItemNumber = ({ value }) => <code className="contents-number">{value.toString()}</code>;
registerComponent({ name: 'CardItemNumber', component: CardItemNumber });

// Array
const CardItemArray = ({ value, Components }) => (
  <ol className="contents-array">
    {value.map((item, index) => (
      <li key={index}>
        {
          <Components.CardItemSwitcher
            value={item}
            typeName={typeof item}
            Components={Components}
          />
        }
      </li>
    ))}
  </ol>
);
registerComponent({ name: 'CardItemArray', component: CardItemArray });

// Object
const CardItemObject = ({ value: object, Components }) => {
  if (object.__typename === 'User') {
    const user = object;

    return (
      <div className="dashboard-user" style={{ whiteSpace: 'nowrap' }}>
        <Components.Avatar size="small" user={user} link />
        <Link to={user.pagePath}>{user.displayName}</Link>
      </div>
    );
  } else {
    return (
      <table className="table table-bordered">
        <tbody>
          {without(Object.keys(object), '__typename').map(key => (
            <tr key={key}>
              <td>
                <strong>{key}</strong>
              </td>
              <td>
                <Components.CardItemSwitcher
                  value={object[key]}
                  typeName={typeof object[key]}
                  Components={Components}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
};
registerComponent({ name: 'CardItemObject', component: CardItemObject });

// HTML
const CardItemHTML = ({ value }) => (
  <div className="contents-html" dangerouslySetInnerHTML={{ __html: value }} />
);
registerComponent({ name: 'CardItemHTML', component: CardItemHTML });

// Default
const CardItemDefault = ({ value }) => <span>{value.toString()}</span>;
registerComponent({ name: 'CardItemDefault', component: CardItemDefault });

// Main component
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
          return <Components.CardItemUrl {...itemProps} force={true} />;

        default:
          // still attempt to parse string as an image or URL if possible
          return <Components.CardItemImage {...itemProps} />;
      }

    default:
      return <Components.CardItemDefault {...itemProps} />;
  }
};
registerComponent({ name: 'CardItemSwitcher', component: CardItemSwitcher });

const CardItem = ({ label, value, typeName, Components, fieldName, collection }) => (
  <tr>
    <td className="datacard-label">
      <strong>{label}</strong>
    </td>
    <td className="datacard-value">
      <Components.CardItemSwitcher
        value={value}
        typeName={typeName}
        Components={Components}
        fieldName={fieldName}
        collection={collection}
      />
    </td>
  </tr>
);

const CardEdit = (props, context) => (
  <tr>
    <td colSpan="2">
      <Components.ModalTrigger
        label={context.intl.formatMessage({ id: 'cards.edit' })}
        component={
          <Components.Button variant="info">
            <FormattedMessage id="cards.edit" />
          </Components.Button>
        }>
        <CardEditForm {...props} />
      </Components.ModalTrigger>
    </td>
  </tr>
);

CardEdit.contextTypes = { intl: intlShape };

const CardEditForm = ({ collection, document, closeModal, ...editFormProps }) => (
  <Components.SmartForm
    collection={collection}
    documentId={document._id}
    showRemove={true}
    successCallback={document => {
      closeModal();
    }}
    {...editFormProps}
  />
);

const Card = (
  {
    title,
    className,
    collection,
    document,
    currentUser,
    fields,
    showEdit = true,
    Components,
    ...editFormProps
  },
  { intl }
) => {
  const fieldNames = fields ? fields : without(Object.keys(document), '__typename');
  const canEdit =
    showEdit &&
    currentUser &&
    collection &&
    collection.options.mutations.update.check(currentUser, document);

  return (
    <div
      className={classNames(className, 'datacard', collection && `datacard-${collection._name}`)}>
      {title && <div className="datacard-title">{title}</div>}
      <table className="table table-bordered" style={{ maxWidth: '100%' }}>
        <tbody>
          {canEdit ? (
            <CardEdit collection={collection} document={document} {...editFormProps} />
          ) : null}
          {fieldNames.map((fieldName, index) => (
            <CardItem
              key={index}
              value={document[fieldName]}
              fieldName={fieldName}
              collection={collection}
              label={getLabel(document[fieldName], fieldName, collection, intl)}
              Components={Components}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

Card.displayName = 'Card';

Card.propTypes = {
  className: PropTypes.string,
  collection: PropTypes.object,
  document: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  currentUser: PropTypes.object,
  fields: PropTypes.array,
  showEdit: PropTypes.bool,
  editFormProps: PropTypes.object,
};

Card.contextTypes = {
  intl: intlShape,
};

registerComponent('Card', Card, withComponents);
