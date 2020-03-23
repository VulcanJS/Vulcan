import { Components } from 'meteor/vulcan:lib';
import React from 'react';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import FilterVariant from 'mdi-material-ui/FilterVariant';
import moment from 'moment';
import { replaceComponent } from 'meteor/vulcan:core';

const getCount = columnFilters => {
  if (!columnFilters) {
    return 0;
  } else if (Array.isArray(columnFilters._in)) {
    return columnFilters._in.length;
  } else if (columnFilters._gte || columnFilters._lte) {
    if (columnFilters._gte && columnFilters._lte) {
      return 2;
    } else {
      return 1;
    }
  }
  return 0;
};

const DatatableFilter = props => {
  const { columnFilters, label, query, Components } = props;

  return (
    <span className="datatable-filter">
      <Components.ModalTrigger
        title={<FormattedMessage id="datatable.filter_column" values={{ label }} defaultMessage={`Filter “${label}”`} />}
        size="small"
        trigger={
          <Components.TooltipButton
            icon={
              <>
                <FilterVariant />
                {!!getCount(columnFilters) && getCount(columnFilters)}
              </>
            }
          />
        }>
        {query ? <Components.DatatableFilterContentsWithData {...props} /> : <Components.DatatableFilterContents {...props} />}
      </Components.ModalTrigger>
    </span>
  );
};

replaceComponent('DatatableFilter', DatatableFilter);

/*

Filter Types Components

Note: the operators used here should match the ones handled server-side by
the filtering API (_in, _gte, _lte, etc.)

*/

/*

Checkboxes

Operator: _in

*/
const checkboxOperator = '_in';
const DatatableFilterCheckboxes = ({ options, filters = { [checkboxOperator]: [] }, setFilters }) => (
  <Components.FormComponentCheckboxGroup
    layout="elementOnly"
    inputProperties={{ options, value: filters[checkboxOperator] }}
    onChange={newValues => {
      setFilters({ [checkboxOperator]: newValues });
    }}
  />
);

replaceComponent('DatatableFilterCheckboxes', DatatableFilterCheckboxes);

/*

Dates

Operators: _gte and _lte

*/
const DatatableFilterDates = ({ filters, setFilters }) => (
  <div>
    <Components.FormComponentDate
      path="_gte"
      // layout="horizontal"
      //label="After"
      value={filters && moment(filters._gte).format('YYYY-MM-DD')}
      onChange={newValues => {
        if (!newValues || newValues === '') {
          const newFilters = Object.assign({}, filters);
          delete newFilters._gte;
          setFilters(newFilters);
        } else {
          setFilters({ ...filters, _gte: newValues });
        }
      }}
    />
    <Components.FormComponentDate
      path="_lte"
      // layout="horizontal"
      //label="Before"
      value={filters && moment(filters._lte).format('YYYY-MM-DD')}
      onChange={newValues => {
        if (!newValues || newValues === '') {
          const newFilters = Object.assign({}, filters);
          delete newFilters._lte;
          setFilters(newFilters);
        } else {
          setFilters({ ...filters, _lte: newValues });
        }
      }}
    />
  </div>
);

replaceComponent('DatatableFilterDates', DatatableFilterDates);

/*

Numbers

Operators: _gte and _lte

*/
const DatatableFilterNumbers = ({ filters, setFilters }) => (
  <div>
    <Components.FormComponentNumber
      label="Min"
      // layout="horizontal"
      value={filters && parseFloat(filters._gte)}
      onChange={value => {
        if (!value || value === '') {
          const newFilters = Object.assign({}, filters);
          delete newFilters._gte;
          setFilters(newFilters);
        } else {
          setFilters({ ...filters, _gte: parseFloat(value) });
        }
      }}
    />
    <Components.FormComponentNumber
      label="Max"
      // layout="horizontal"
      value={filters && parseFloat(filters._lte)}
      onChange={value => {
        if (!value) {
          const newFilters = Object.assign({}, filters);
          delete newFilters._lte;
          setFilters(newFilters);
        } else {
          setFilters({ ...filters, _lte: parseFloat(value) });
        }
      }}
    />
  </div>
);

replaceComponent('DatatableFilterNumbers', DatatableFilterNumbers);
