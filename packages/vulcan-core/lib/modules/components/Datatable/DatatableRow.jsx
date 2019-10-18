import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import _isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import Users from 'meteor/vulcan:users';

/*

DatatableRow Component

*/
const DatatableRow = (props, { intl }) => {
  const {
    collection,
    columns,
    document,
    showEdit,
    currentUser,
    options,
    editFormOptions,
    editFormProps,
    rowClass,
    Components,
  } = props;
  // openCRUD backwards compatibility
  const canEdit =
    collection &&
    collection.options &&
    collection.options.mutations &&
    collection.options.mutations.edit &&
    collection.options.mutations.edit.check(currentUser, document, { Users });
  const canUpdate =
    collection &&
    collection.options &&
    collection.options.mutations &&
    collection.options.mutations.update &&
    collection.options.mutations.update.check(currentUser, document, { Users });
  const row = typeof rowClass === 'function' ? rowClass(document) : rowClass || '';
  const { modalProps = {} } = props;
  const defaultModalProps = { title: <code>{document._id}</code> };
  const customModalProps = {
    ...defaultModalProps,
    ...(_isFunction(modalProps) ? modalProps(document) : modalProps),
  };

  return (
    <Components.DatatableRowLayout className={`datatable-item ${row}`}>
      {columns.map((column, index) => (
        <Components.DatatableCell
          key={index}
          Components={Components}
          column={column}
          document={document}
          currentUser={currentUser}
          collection={collection}
        />
      ))}
      {showEdit && (canEdit || canUpdate) ? ( // openCRUD backwards compatibility
        <Components.DatatableCellLayout className="datatable-edit">
          <Components.EditButton
            collection={collection}
            documentId={document._id}
            currentUser={currentUser}
            mutationFragmentName={options && options.fragmentName}
            modalProps={customModalProps}
            {...editFormOptions}
            {...editFormProps}
          />
        </Components.DatatableCellLayout>
      ) : null}
    </Components.DatatableRowLayout>
  );
};
DatatableRow.propTypes = {
  Components: PropTypes.object.isRequired,
};
registerComponent('DatatableRow', DatatableRow);

DatatableRow.contextTypes = {
  intl: intlShape,
};
const DatatableRowLayout = ({ children, ...otherProps }) => <tr {...otherProps}>{children}</tr>;
registerComponent({ name: 'DatatableRowLayout', component: DatatableRowLayout });
