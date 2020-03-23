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
  { collection, columns, document, refetch, showEdit, editComponent, currentUser, rowClass, handleRowClick, classes, modalProps = {} },
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

  const defaultModalProps = { title: <code>{document._id}</code> };
  const customModalProps = {
    ...defaultModalProps,
    ...(_isFunction(modalProps) ? modalProps(document) : modalProps),
  };

  return (
    <TableRow
      className={classNames('datatable-item', classes.tableRow, rowClass, handleRowClick && classes.clickRow)}
      onClick={handleRowClick && (event => handleRowClick(event, document))}
      hover>
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
            />
          )}
        </TableCell>
      )}
    </TableRow>
  );
};

replaceComponent('DatatableRow', DatatableRow, [withStyles, datatableRowStyles]);

DatatableRow.contextTypes = {
  intl: intlShape,
};
