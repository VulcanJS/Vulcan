import { registerComponent, formatLabel } from 'meteor/vulcan:lib';
import React from 'react';
import { intlShape } from 'meteor/vulcan:i18n';
import PropTypes from 'prop-types';

const getColumnName = column => (typeof column === 'string' ? column : column.label || column.name);

/*

DatatableHeader Component

*/
const DatatableHeader = (
  { collection, column, toggleSort, currentSort, submitFilters, currentFilters, Components },
  { intl }
) => {
  const columnName = getColumnName(column);

  if (collection) {
    const schema = collection.simpleSchema()._schema;

    /*

    use either:

    1. the column name translation : collectionName.columnName, global.columnName, columnName
    2. the column name label in the schema (if the column name matches a schema field)
    3. the raw column name.

    */
    const formattedLabel = formatLabel({
      intl,
      fieldName: columnName,
      collectionName: collection._name,
      schema: schema,
    });

    // if sortable is a string, use it as the name of the property to sort by. If it's just `true`, use column.name
    const sortPropertyName = typeof column.sortable === 'string' ? column.sortable : column.name;

    // if filterable is a string, use it as the name of the property to filter by. If it's just `true`, use column.name
    const filterablePropertyName =
      typeof column.filterable === 'string' ? column.filterable : column.name;

    const fieldOptions = schema[filterablePropertyName] && schema[filterablePropertyName].options;

    // for filter options, use either column.options or else the options property defined on the schema field
    const filterOptions = column.options ? column.options : fieldOptions;
    const filterQuery = schema[filterablePropertyName] && schema[filterablePropertyName].query;

    return (
      <Components.DatatableHeaderCellLayout>
        <span className="datatable-header-cell-label">{formattedLabel}</span>
        {column.sortable && (
          <Components.DatatableSorter
            name={sortPropertyName}
            label={formattedLabel}
            toggleSort={toggleSort}
            currentSort={currentSort}
            sortable={column.sortable}
            Components={Components}
          />
        )}
        {column.filterable && (
          <Components.DatatableFilter
            name={filterablePropertyName}
            label={formattedLabel}
            query={filterQuery}
            options={filterOptions}
            submitFilters={submitFilters}
            currentFilters={currentFilters}
            Components={Components}
          />
        )}
      </Components.DatatableHeaderCellLayout>
    );
  } else {
    const formattedLabel = intl.formatMessage({ id: columnName, defaultMessage: columnName });
    return (
      <Components.DatatableHeaderCellLayout
        className={`datatable-th-${columnName.toLowerCase().replace(/\s/g, '-')}`}>
        {formattedLabel}
      </Components.DatatableHeaderCellLayout>
    );
  }
};
DatatableHeader.contextTypes = {
  intl: intlShape,
};
DatatableHeader.propTypes = {
  Components: PropTypes.object.isRequired,
};
registerComponent('DatatableHeader', DatatableHeader);

const DatatableHeaderCellLayout = ({ children, ...otherProps }) => (
  <th {...otherProps}>
    <div className="datatable-header-cell-inner">{children}</div>
  </th>
);
registerComponent({ name: 'DatatableHeaderCellLayout', component: DatatableHeaderCellLayout });
