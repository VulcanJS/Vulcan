import { Components, registerComponent, Utils } from 'meteor/vulcan:lib';
import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import moment from 'moment';

const getCount = columnFilters => {
  if (!columnFilters) {
    return 0;
  } else if (Array.isArray(columnFilters)) {
    return columnFilters.length;
  } else if (columnFilters.after || columnFilters.before) {
    if (columnFilters.after && columnFilters.before) {
      return 2;
    } else { 
      return 1;
    }
  }
  return 0;
};

const Filter = ({ count }) => (
  <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path
      fill="#000"
      d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"
    />
    {count ? (
      <text
        x="50%"
        y="55%"
        fill="#000"
        fontSize="300px"
        textAnchor="middle"
        alignmentBaseline="middle">
        {count}
      </text>
    ) : (
      <path
        fill="#000"
        d="M224 200v-16c0-13.3-10.7-24-24-24h-24v-20c0-6.6-5.4-12-12-12h-8c-6.6 0-12 5.4-12 12v20h-24c-13.3 0-24 10.7-24 24v16c0 13.3 10.7 24 24 24h24v148c0 6.6 5.4 12 12 12h8c6.6 0 12-5.4 12-12V224h24c13.3 0 24-10.7 24-24zM352 328v-16c0-13.3-10.7-24-24-24h-24V140c0-6.6-5.4-12-12-12h-8c-6.6 0-12 5.4-12 12v148h-24c-13.3 0-24 10.7-24 24v16c0 13.3 10.7 24 24 24h24v20c0 6.6 5.4 12 12 12h8c6.6 0 12-5.4 12-12v-20h24c13.3 0 24-10.7 24-24z"
      />
    )}
  </svg>
);

const DatatableFilter = props => {
  const { columnFilters, label, query, Components } = props;

  return (
    <span className="datatable-filter">
      <Components.ModalTrigger
        title={
          <FormattedMessage
            id="datatable.filter_column"
            values={{ label }}
            defaultMessage={`Filter ${label}`}
          />
        }
        size="small"
        trigger={<Filter count={getCount(columnFilters)} />}>
        {query ? (
          <Components.DatatableFilterContentsWithData {...props} />
        ) : (
          <Components.DatatableFilterContents {...props} />
        )}
      </Components.ModalTrigger>
    </span>
  );
};

registerComponent('DatatableFilter', DatatableFilter);

/*

DatatableFilterContents Components

*/

const DatatableFilterContentsWithData = props => {
  const { query, options } = props;

  const filterQuery = gql`
    query ${name}FilterQuery {
      ${query}
    }
  `;

  const { loading, error, data } = useQuery(filterQuery);

  if (loading) {
    return <Components.Loading />;
  } else if (error) {
    return <p>error</p>;
  } else {
    // note: options function expects the entire props object
    const queryOptions = options({ data });
    return <Components.DatatableFilterContents {...props} options={queryOptions} />;
  }
};

registerComponent('DatatableFilterContentsWithData', DatatableFilterContentsWithData);

const DatatableFilterContents = props => {
  const { name, field, options, columnFilters, submitFilters } = props;
  const fieldType = Utils.getFieldType(field);

  const [filters, setFilters] = useState(columnFilters);

  const filterProps = { ...props, filters, setFilters };

  let contents;

  if (options) {
    contents = <Components.DatatableFilterCheckboxes {...filterProps} />;
  } else {
    switch (fieldType) {
      case Date:
        contents = <Components.DatatableFilterDates {...filterProps} />;
        break;

      default:
        contents = <p>Please specify an options property on your schema field.</p>;
    }
  }

  return (
    <div>
      {contents}
      <a
        style={{ display: 'inline-block', marginRight: 10 }}
        className="datatable_filter_clear"
        href="javascript:void(0)"
        onClick={() => {
          setFilters([]);
        }}>
        <FormattedMessage id="datatable.clear_all" defaultMessage="Clear All" />
      </a>
      <Components.Button
        className="datatable_filter_submit"
        onClick={() => {
          submitFilters({ name, filters });
        }}>
        <FormattedMessage id="datatable.submit" defaultMessage="Submit" />
      </Components.Button>
    </div>
  );
};

registerComponent('DatatableFilterContents', DatatableFilterContents);

const DatatableFilterCheckboxes = ({ options, filters, setFilters }) => (
  <Components.FormComponentCheckboxGroup
    path="filter"
    itemProperties={{ layout: 'inputOnly' }}
    inputProperties={{ options }}
    value={filters}
    updateCurrentValues={newValues => {
      setFilters(newValues.filter);
    }}
  />
);

registerComponent('DatatableFilterCheckboxes', DatatableFilterCheckboxes);

const DatatableFilterDates = ({ filters, setFilters }) => (
  <div>
    <Components.FormComponentDate
      path="after"
      itemProperties={{ label: 'After', layout: 'horizontal' }}
      inputProperties={{}}
      value={filters && moment(filters.after, 'YYYY-MM-DD')}
      updateCurrentValues={newValues => {
        if (!newValues.after || newValues.after === '') {
          const newFilters = Object.assign({}, filters);
          delete newFilters.after;
          setFilters(newFilters);
        } else {
          setFilters({...filters, after: newValues.after.format('YYYY-MM-DD')});
        }
      }}
    />
    <Components.FormComponentDate
      path="before"
      itemProperties={{ label: 'Before', layout: 'horizontal' }}
      inputProperties={{}}
      value={filters && moment(filters.before, 'YYYY-MM-DD')}
      updateCurrentValues={newValues => {
        if (!newValues.before || newValues.before === '') {
          const newFilters = Object.assign({}, filters);
          delete newFilters.before;
          setFilters(newFilters);
        } else {
          setFilters({...filters, before: newValues.before.format('YYYY-MM-DD')});
        }
      }}
    />
  </div>
);

registerComponent('DatatableFilterDates', DatatableFilterDates);
