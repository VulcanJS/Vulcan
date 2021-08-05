import { registerComponent, Components, formatLabel } from 'meteor/vulcan:lib';
import { intlShape } from 'meteor/vulcan:i18n';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import without from 'lodash/without';
import withComponents from '../../containers/withComponents.js';
import Users from 'meteor/vulcan:users';
import get from 'lodash/get';

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

// Main component

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
            <Components.FormattedMessage id="cards.edit" />
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

const Card = ({ title, className, collection, document, currentUser, fields, showEdit = true, Components, ...editFormProps }, { intl }) => {
  
  if (!document) {
    return (
      <div>
        <Components.FormattedMessage id="error.no_document" defaultMessage="No document" />
      </div>
    );
  }

  const fieldNames = fields ? fields : without(Object.keys(document), '__typename');

  let canUpdate = false;

  // new APIs
  const permissionCheck = get(collection, 'options.permissions.canUpdate');
  // openCRUD backwards compatibility
  const check = get(collection, 'options.mutations.edit.check') || get(collection, 'options.mutations.update.check');

  if (Users.isAdmin(currentUser)) {
    canUpdate = true;
  } else if (permissionCheck) {
    canUpdate = Users.permissionCheck({
      check: permissionCheck,
      user: currentUser,
      context: { Users },
      operationName: 'update',
      document,
    });
  } else if (check) {
    canUpdate = check && check(currentUser, document, { Users });
  }

  const typeName = collection && collection.typeName.toLowerCase();
  const semantizedClassName = classNames(
    className,
    'datacard',
    typeName && `datacard-${typeName}`,
    document && document._id && `datacard-${document._id}`
  );

  return (
    <div className={semantizedClassName}>
      {title && <div className="datacard-title">{title}</div>}
      <table className="table table-bordered" style={{ maxWidth: '100%' }}>
        <tbody>
          {showEdit && canUpdate ? <CardEdit collection={collection} document={document} {...editFormProps} /> : null}
          {fieldNames.map((fieldName, index) => (
            <CardItem
              key={index}
              value={document[fieldName]}
              fieldName={fieldName}
              collection={collection}
              label={getLabel(document[fieldName], fieldName, collection, intl)}
              Components={Components}
              document={document}
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

export default Card;
