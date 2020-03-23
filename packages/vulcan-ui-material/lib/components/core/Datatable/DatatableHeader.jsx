import React from 'react';
import { Components, replaceComponent } from 'meteor/vulcan:core';
import { formatLabel } from 'meteor/vulcan:lib';
import { intlShape } from 'meteor/vulcan:i18n';
import TableCell from '@material-ui/core/TableCell';
import classNames from 'classnames';

/*

DatatableHeader Component

*/
const DatatableHeader = (
  { collection, intlNamespace, column, classes, toggleSort, currentSort, submitFilters, currentFilters },
  { intl }
) => {
  const columnName = typeof column === 'string' ? column : column.name || column.label;
  let formattedLabel = '';

  if (collection) {
    const schema = collection.simpleSchema()._schema;
    const field = schema[column.name];

    if (column.label) {
      formattedLabel = column.label;
    } else {
      /*
    use either:

    1. the column name translation
    2. the column name label in the schema (if the column name matches a schema field)
    3. the raw column name.
    */
      formattedLabel = formatLabel({
        intl,
        fieldName: column.name,
        collectionName: collection._name,
        schema: schema,
      });
    }
    // if sortable is a string, use it as the name of the property to sort by. If it's just `true`, use
    // column.name
    const sortPropertyName = typeof column.sortable === 'string' ? column.sortable : column.name;

    const fieldOptions = field && field.options;

    // for filter options, use either column.options or else the options property defined on the schema field
    const filterOptions = column.options ? column.options : fieldOptions;
    const filterQuery = field && field.query;

    return (
      <TableCell
        className="datatable-sorter"
        sortDirection={column.sortable && (!currentSort[sortPropertyName] ? false : currentSort[sortPropertyName] === 1 ? 'asc' : 'desc')}>
        <span className="datatable-header-cell-label">{formattedLabel}</span>
        {column.sortable && (
          <Components.DatatableSorter
            name={sortPropertyName}
            toggleSort={toggleSort}
            currentSort={currentSort}
            sortable={column.sortable}
          />
        )}
        {column.filterable && (
          <Components.DatatableFilter
            collection={collection}
            field={field}
            name={column.name}
            label={formattedLabel}
            query={filterQuery}
            options={filterOptions}
            submitFilters={submitFilters}
            columnFilters={currentFilters[column.name]}
            filterComponent={column.filterComponent}
            Components={Components}
          />
        )}
      </TableCell>
    );
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

  return <TableCell className={classNames(classes.tableHeadCell, column.headerClass)}>{formattedLabel}</TableCell>;
};

DatatableHeader.contextTypes = {
  intl: intlShape,
};

replaceComponent('DatatableHeader', DatatableHeader);
