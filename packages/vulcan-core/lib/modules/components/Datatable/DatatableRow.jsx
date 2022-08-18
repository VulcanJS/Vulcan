import { Components, registerComponent } from 'meteor/vulcan:lib';
import React, { memo } from 'react';
import _isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import Users from 'meteor/vulcan:users';
import get from 'lodash/get';

/*

DatatableRow Component

*/
const DatatableRow = (props, { intl }) => {
  const {
    collection,
    columns,
    document,
    showEdit,
    showDelete,
    currentUser,
    options,
    editFormOptions,
    editFormProps,
    rowClass,
    Components,
    showSelect,
    toggleItem,
    selectedItems,
  } = props;

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
      document,
      context: { Users },
      operationName: 'update',
    });
  } else if (check) {
    canUpdate = check && check(currentUser, document, { Users });
  }

  const row = typeof rowClass === 'function' ? rowClass(document) : rowClass || '';
  const { modalProps = {} } = props;
  const defaultModalProps = { title: <code>{document._id}</code> };
  const customModalProps = {
    ...defaultModalProps,
    ...(_isFunction(modalProps) ? modalProps(document) : modalProps),
  };

  const isSelected = selectedItems && selectedItems.includes(document._id);

  return (
    <Components.DatatableRowLayout className={`datatable-item ${row} ${isSelected ? 'datatable-item-selected' : ''}`}>
      {showSelect && (
        <Components.DatatableSelect
          Components={Components}
          document={document}
          currentUser={currentUser}
          collection={collection}
          toggleItem={toggleItem}
          selectedItems={selectedItems}
        />
      )}
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
      {showEdit && canUpdate ? ( // openCRUD backwards compatibility
        <Components.DatatableCellLayout className="datatable-edit">
          <Components.EditButton
            collection={collection}
            documentId={document._id}
            currentUser={currentUser}
            mutationFragmentName={options && options.fragmentName}
            modalProps={customModalProps}
            formProps={editFormOptions || editFormProps }
          />
        </Components.DatatableCellLayout>
      ) : null}
      {showDelete && canUpdate ? ( // openCRUD backwards compatibility
        <Components.DatatableCellLayout className="datatable-delete">
          <Components.DeleteButton
            collection={collection}
            documentId={document._id}
            currentUser={currentUser}
            mutationFragmentName={options && options.fragmentName}
          />
        </Components.DatatableCellLayout>
      ) : null}
    </Components.DatatableRowLayout>
  );
};
DatatableRow.propTypes = {
  Components: PropTypes.object.isRequired,
};
registerComponent({ name: 'DatatableRow', component: DatatableRow, hocs: [memo] });

DatatableRow.contextTypes = {
  intl: intlShape,
};
const DatatableRowLayout = ({ children, ...otherProps }) => <tr {...otherProps}>{children}</tr>;
registerComponent({ name: 'DatatableRowLayout', component: DatatableRowLayout, hocs: [memo] });
