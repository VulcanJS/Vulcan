import React from 'react';
import _isFunction from 'lodash/isFunction';
import { Components, replaceComponent } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import Users from 'meteor/vulcan:users';
import get from 'lodash/get';
import withStyles from '@material-ui/core/styles/withStyles';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import _assign from 'lodash/assign';
import _sortBy from 'lodash/sortBy';
import classNames from 'classnames';
import { baseStyles } from './Datatable';

/*

DatatableRow Component

*/
const datatableRowStyles = theme =>
  _assign({}, baseStyles(theme), {
    clickRow: {
      cursor: 'pointer',
    },
    editCell: {
      paddingTop: '0 !important',
      paddingBottom: '0 !important',
      textAlign: 'right',
    },
  });

const DatatableRow = (
  {
    collection,
    columns,
    document,
    refetch,
    showEdit,
    editComponent,
    currentUser,
    rowClass,
    handleRowClick,
    classes,
    modalProps = {},
    currentSelection,
    options,
    showSelect,
    showDelete,
    toggleSelection,
    editFormProps,
    editFormOptions,
  },
  { intl }
) => {
  const EditComponent = editComponent;
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

  let canDelete = false;

  // new APIs
  const deletePermissionCheck = get(collection, 'options.permissions.canDelete');
  // openCRUD backwards compatibility
  const deleteCheck = get(collection, 'options.mutations.delete.check') || get(collection, 'options.mutations.remove.check');

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

  const defaultModalProps = { title: <code>{document._id}</code> };
  const customModalProps = {
    ...defaultModalProps,
    ...(_isFunction(modalProps) ? modalProps(document) : modalProps),
  };

  const isSelected =
    currentSelection.includes('all') || currentSelection.includes('allVisible')
      ? !currentSelection.includes(document._id)
      : currentSelection.includes(document._id);

  return (
    <TableRow
      className={classNames('datatable-item', classes.tableRow, rowClass, handleRowClick && classes.clickRow)}
      onClick={handleRowClick && (event => handleRowClick(event, document))}
      hover>
      {showSelect ? (
        <TableCell className={classes.selectCell}>
          <Components.FormComponentCheckbox
            path="select"
            inputProperties={{ value: isSelected }}
            itemProperties={{}}
            variant="checkbox"
            optional
            onChange={() => {
              toggleSelection(document._id, isSelected);
            }}
          />
        </TableCell>
      ) : null}

      {columns.map((column, index) => (
        <Components.DatatableCell key={index} column={column} document={document} currentUser={currentUser} classes={classes} />
      ))}

      {(showEdit || editComponent) && canUpdate && (
        <TableCell className={classes.editCell}>
          {EditComponent && <EditComponent collection={collection} document={document} refetch={refetch} />}
          {showEdit && (
            <Components.EditButton
              collection={collection}
              document={document}
              modalProps={customModalProps}
              buttonClasses={{ button: classes.editButton }}
              mutationFragmentName={options && options.fragmentName}
              {...editFormOptions}
              {...editFormProps}
            />
          )}
        </TableCell>
      )}
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
    </TableRow>
  );
};

replaceComponent('DatatableRow', DatatableRow, [withStyles, datatableRowStyles]);

DatatableRow.contextTypes = {
  intl: intlShape,
};
