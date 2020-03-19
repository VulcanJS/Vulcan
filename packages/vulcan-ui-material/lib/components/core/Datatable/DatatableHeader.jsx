import React from 'react';
import {
  Components,
  replaceComponent,
  Utils,
} from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import TableCell from '@material-ui/core/TableCell';
import classNames from 'classnames';

/*

DatatableHeader Component

*/
const DatatableHeader = (
  { collection, intlNamespace, column, classes, toggleSort, currentSort },
  { intl }
) => {
  const columnName = typeof column === 'string' ? column : column.name || column.label;
  let formattedLabel = '';

  if (collection) {
    const schema = collection.simpleSchema()._schema;

    /*
    use either:

    1. the column name translation
    2. the column name label in the schema (if the column name matches a schema field)
    3. the raw column name.
    */
    const defaultMessage = schema[columnName]
      ? schema[columnName].label
      : Utils.camelToSpaces(columnName);
    formattedLabel =
      (typeof columnName === 'string' &&
        intl.formatMessage({
          id: `${collection._name}.${columnName}`,
          defaultMessage: defaultMessage,
        })) ||
      defaultMessage;

    // if sortable is a string, use it as the name of the property to sort by. If it's just `true`, use
    // column.name
    const sortPropertyName = typeof column.sortable === 'string' ? column.sortable : column.name;

    if (column.sortable) {
      return (
        <Components.DatatableSorter
          name={sortPropertyName}
          label={formattedLabel}
          toggleSort={toggleSort}
          currentSort={currentSort}
          sortable={column.sortable}
        />
      );
    }
  } else if (intlNamespace) {
    formattedLabel =
      (typeof columnName === 'string' &&
        intl.formatMessage({
          id: `${intlNamespace}.${columnName}`,
          defaultMessage: columnName,
        })) ||
      columnName;
  } else {
    formattedLabel = intl.formatMessage({ id: columnName, defaultMessage: columnName });
  }

  return (
    <TableCell className={classNames(classes.tableHeadCell, column.headerClass)}>
      {formattedLabel}
    </TableCell>
  );
};

DatatableHeader.contextTypes = {
  intl: intlShape,
};

replaceComponent('DatatableHeader', DatatableHeader);