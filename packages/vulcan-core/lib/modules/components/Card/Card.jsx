import { registerComponent, Components, formatLabel } from 'meteor/vulcan:lib';
import { intlShape, FormattedMessage } from 'meteor/vulcan:i18n';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import without from 'lodash/without';
import withComponents from '../../containers/withComponents';

const getLabel = (field, fieldName, collection, intl) => {
  const schema = collection && collection.simpleSchema()._schema;
  return formatLabel({
    intl,
    fieldName: fieldName,
    collectionName: collection && collection._name,
    schema: schema,
  });
};

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

registerComponent({
  name: 'Card',
  component: Card,
  hocs: [withComponents],
});