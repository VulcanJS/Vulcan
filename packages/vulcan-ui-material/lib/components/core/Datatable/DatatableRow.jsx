import React from 'react';
import { Components, replaceComponent } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
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
  { collection, columns, document, refetch, showEdit, editComponent, currentUser, rowClass, handleRowClick, classes },
  { intl }
) => {
  const EditComponent = editComponent;

  if (typeof rowClass === 'function') {
    rowClass = rowClass(document);
  }

  return (
    <TableRow
      className={classNames('datatable-item', classes.tableRow, rowClass, handleRowClick && classes.clickRow)}
      onClick={handleRowClick && (event => handleRowClick(event, document))}
      hover>
      {_sortBy(columns, column => column.order).map((column, index) => (
        <Components.DatatableCell key={index} column={column} document={document} currentUser={currentUser} classes={classes} />
      ))}

      {(showEdit || editComponent) && (
        <TableCell className={classes.editCell}>
          {EditComponent && <EditComponent collection={collection} document={document} refetch={refetch} />}
          {showEdit && <Components.EditButton collection={collection} document={document} buttonClasses={{ button: classes.editButton }} />}
        </TableCell>
      )}
    </TableRow>
  );
};

replaceComponent('DatatableRow', DatatableRow, [withStyles, datatableRowStyles]);

DatatableRow.contextTypes = {
  intl: intlShape,
};
