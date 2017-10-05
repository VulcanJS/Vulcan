import { registerComponent, Components } from 'meteor/vulcan:lib';
import { intlShape, FormattedMessage } from 'meteor/vulcan:i18n';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import Button from 'react-bootstrap/lib/Button';

const getLabel = (field, fieldName, collection, intl) => {
  const schema = collection.simpleSchema()._schema;
  const fieldSchema = schema[fieldName];
  if (fieldSchema) {
    return intl.formatMessage({id: `${collection._name}.${fieldName}`, defaultMessage: fieldSchema.label});
  } else {
    return fieldName;
  }
}

const getTypeName = (field, fieldName, collection) => {
  const schema = collection.simpleSchema()._schema;
  const fieldSchema = schema[fieldName];
  if (fieldSchema) {
    const type = fieldSchema.type.singleType;
    const typeName = typeof type === 'function' ? type.name : type;
    return typeName;
  } else {
    return typeof field;
  }
}

const parseImageUrl = value => {
  const isImage = ['.png', '.jpg', '.gif'].indexOf(value.substr(-4)) !== -1 || ['.webp', '.jpeg' ].indexOf(value.substr(-5)) !== -1;
  return isImage ? 
    <img style={{width: '100%', maxWidth: 200}} src={value} alt={value}/> : 
    <LimitedString string={value}/>;
}

const LimitedString = ({ string }) =>
  <div>
    {string.indexOf(' ') === -1 && string.length > 30 ? 
      <span title={string}>{string.substr(0,30)}…</span> : 
      <span>{string}</span>
    }
  </div>

export const getFieldValue = (value, typeName) => {

  if (typeof value === 'undefined' || value === null) {
    return ''
  }

  if (Array.isArray(value)) {
    typeName = 'Array';
  }

  if (typeof typeName === 'undefined') {
    typeName = typeof value;
  }

  switch (typeName) {

    case 'Boolean':
    case 'boolean':
    case 'Number':
    case 'number':
    case 'SimpleSchema.Integer':
      return <code>{value.toString()}</code>;

    case 'Array':
      return <ol>{value.map((item, index) => <li key={index}>{getFieldValue(item, typeof item)}</li>)}</ol>

    case 'Object':
    case 'object':
      return (
        <table className="table">
          <tbody>
            {_.map(value, (value, key) => 
              <tr key={key}>
                <td><strong>{key}</strong></td>
                <td>{getFieldValue(value, typeof value)}</td>
              </tr>
            )}
          </tbody>
        </table>
      )

    case 'Date':
      return moment(new Date(value)).format('dddd, MMMM Do YYYY, h:mm:ss');

    default:
      return parseImageUrl(value);
  }  
}

const CardItem = ({label, value, typeName}) => 
  <tr>
    <td className="datacard-label"><strong>{label}</strong></td>
    <td className="datacard-value">{getFieldValue(value, typeName)}</td>
  </tr>

const CardEdit = (props, context) =>
  <tr>
    <td colSpan="2">
      <Components.ModalTrigger label={context.intl.formatMessage({id: 'cards.edit'})} component={<Button bsStyle="info"><FormattedMessage id="cards.edit" /></Button>}>
        <CardEditForm {...props} />
      </Components.ModalTrigger>
    </td>
  </tr>

CardEdit.contextTypes = { intl: intlShape };

const CardEditForm = ({ collection, document, closeModal }) =>
  <Components.SmartForm 
    collection={collection}
    documentId={document._id}
    showRemove={true}
    successCallback={document => {
      closeModal();
    }}
  />

const Card = ({className, collection, document, currentUser, fields}, {intl}) => {

  const fieldNames = fields ? fields : _.without(_.keys(document), '__typename');
  const canEdit = currentUser && collection.options.mutations.edit.check(currentUser, document);

  return (
    <div className={classNames(className, 'datacard', `datacard-${collection._name}`)}>
      <table className="table table-bordered" style={{maxWidth: '100%'}}>
        <tbody>
          {canEdit ? <CardEdit collection={collection} document={document} /> : null}
          {fieldNames.map((fieldName, index) => 
            <CardItem key={index} value={document[fieldName]} typeName={getTypeName(document[fieldName], fieldName, collection)} label={getLabel(document[fieldName], fieldName, collection, intl)}/>
          )}
        </tbody>
      </table>
    </div>
  );
};

Card.displayName = "Card";

Card.propTypes = {
  className: PropTypes.string,
  collection: PropTypes.object,
  document: PropTypes.object,
  currentUser: PropTypes.object,
  fields: PropTypes.array,
}

Card.contextTypes = {
  intl: intlShape
}

registerComponent('Card', Card);