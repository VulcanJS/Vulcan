import React from 'react';
import {
  Components,
  replaceComponent,
} from 'meteor/vulcan:core';
import TableCell from '@material-ui/core/TableCell';
import { getFieldValue } from '../Card';
import classNames from 'classnames';

/*

DatatableCell Component

*/
const DatatableCell = ({ column, document, currentUser, classes }) => {
  const Component =
    column.component || Components[column.componentName] || Components.DatatableDefaultCell;

  const columnName = typeof column === 'string' ? column : column.name;
  const className =
    typeof columnName === 'string' ? `datatable-item-${columnName.toLowerCase()}` : '';
  const cellClass =
    typeof column.cellClass === 'function'
      ? column.cellClass({ column, document, currentUser })
      : typeof column.cellClass === 'string'
      ? column.cellClass
      : null;

  return (
    <TableCell className={classNames(classes.tableCell, cellClass, className)}>
      <Component column={column} document={document} currentUser={currentUser} />
    </TableCell>
  );
};

replaceComponent('DatatableCell', DatatableCell);

/*

DatatableDefaultCell Component

*/
const DatatableDefaultCell = ({ column, document }) => (
  <div>
    {typeof column === 'string'
      ? getFieldValue(document[column])
      : getFieldValue(document[column.name])}
  </div>
);
replaceComponent('DatatableDefaultCell', DatatableDefaultCell);
