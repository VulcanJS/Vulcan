import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
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
    showSelect,
    showEdit,
    showDelete,
    currentUser,
    currentSelection,
    options,
    editFormOptions,
    editFormProps,
    rowClass,
    toggleSelection,
    Components,
  } = props;

  let canUpdate = false;

  // new APIs
  const permissionCheck = get(collection, 'options.permissions.canUpdate');
  // openCRUD backwards compatibility
  const check =
    get(collection, 'options.mutations.edit.check') ||
    get(collection, 'options.mutations.update.check');

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

  let canDelete = false;

  // new APIs
  const deletePermissionCheck = get(collection, 'options.permissions.canDelete');
  // openCRUD backwards compatibility
  const deleteCheck =
    get(collection, 'options.mutations.delete.check') ||
    get(collection, 'options.mutations.remove.check');

  if (Users.isAdmin(currentUser)) {
    canDelete = true;
  } else if (deletePermissionCheck) {
    canDelete = Users.permissionCheck({
      check: deletePermissionCheck,
      user: currentUser,
      document,
      context: { Users },
      operationName: 'delete',
    });
  } else if (deleteCheck) {
    canDelete = deleteCheck && deleteCheck(currentUser, document, { Users });
  }

  const row = typeof rowClass === 'function' ? rowClass(document) : rowClass || '';
  const { modalProps = {} } = props;
  const defaultModalProps = { title: <code>{document._id}</code> };
  const customModalProps = {
    ...defaultModalProps,
    ...(_isFunction(modalProps) ? modalProps(document) : modalProps),
  };

  const isSelected = (currentSelection.includes("all") || currentSelection.includes("allVisible")) ? !currentSelection.includes(document._id) : currentSelection.includes(document._id)

  return (
    <Components.DatatableRowLayout className={`datatable-item ${row}`}>
      {showSelect ? (
        <Components.DatatableCellLayout className="datatable-edit">
          <Components.FormComponentCheckbox
            path="select"
            inputProperties={{value:isSelected}}
            itemProperties={{}}
            variant="checkbox"
            optional
            onChange={()=>{toggleSelection(document._id, isSelected)}}
          />
        </Components.DatatableCellLayout>
      ) : null}
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
            {...editFormOptions}
            {...editFormProps}
          />
        </Components.DatatableCellLayout>
      ) : null}
      {showDelete && canDelete ? ( // openCRUD backwards compatibility
        <Components.DatatableCellLayout className="datatable-delete">
          <Components.DeleteButton
            collection={collection}
            documentId={document._id}
            currentUser={currentUser}
            modalProps={customModalProps}
            fragmentName={options && options.fragmentName}
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
