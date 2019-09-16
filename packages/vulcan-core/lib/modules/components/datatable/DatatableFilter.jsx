import { Components, registerComponent } from 'meteor/vulcan:lib';
import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

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

const DatatableFilter = ({
  data,
  loading,
  name,
  label,
  query,
  options,
  submitFilters,
  currentFilters = {},
}) => {
  const columnFilters = currentFilters[name];
  const [filters, setFilters] = useState(columnFilters);

  const filterProps = {
    name,
    query,
    options,
    filters,
    setFilters,
    submitFilters,
  };
  return (
    <span className="datatable-filter">
      <Components.ModalTrigger
        title={`Filter ${label}`}
        size="small"
        trigger={<Filter count={columnFilters && columnFilters.length} />}>
        {query ? (
          <Components.DatatableFilterContentsWithData {...filterProps} />
        ) : (
          <Components.DatatableFilterContents {...filterProps} />
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

const DatatableFilterContents = ({ name, options, filters, setFilters, submitFilters }) => {

  // note: convert all values to strings since they might be stored in URL
  const stringOptions = options.map(({ value, label }) => ({ value: value.toString(), label }));

  return (
    <div>
      <Components.FormComponentCheckboxGroup
        path="filter"
        itemProperties={{ layout: 'inputOnly' }}
        inputProperties={{ options: stringOptions }}
        value={filters}
        updateCurrentValues={newValues => {
          setFilters(newValues.filter);
        }}
      />
      <Components.Button
        onClick={() => {
          setFilters([]);
        }}>
        Clear All
      </Components.Button>
      <Components.Button
        onClick={() => {
          submitFilters({ name, filters });
        }}>
        Submit
      </Components.Button>
    </div>
  );
};

registerComponent('DatatableFilterContents', DatatableFilterContents);
