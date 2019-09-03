import { registerComponent, getCollection, formatLabel } from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withCurrentUser from '../containers/withCurrentUser.js';
import withComponents from '../containers/withComponents';
import withMulti from '../containers/withMulti.js';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';
import { getFieldValue } from './Card.jsx';
import _isFunction from 'lodash/isFunction';
import _sortBy from 'lodash/sortBy';
import qs from 'qs';
import { withRouter } from 'react-router';

/*

Datatable Component

*/

// see: http://stackoverflow.com/questions/1909441/jquery-keyup-delay
const delay = (function() {
  var timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

const getColumnName = column => (typeof column === 'string' ? column : column.label || column.name);

class Datatable extends PureComponent {
  constructor(props) {
    super(props);

    let initState = {
      value: '',
      query: '',
      currentSort: {},
    };

    // only load urlState if useUrlState is enabled
    if (props.useUrlState) {
      const urlState = this.getUrlState(props);
      if (urlState.query) {
        initState.value = urlState.query;
        initState.query = urlState.query;
      }
      if (urlState.sort) {
        const [sortKey, sortValue] = urlState.sort.split('|');
        initState.currentSort = { [sortKey]: parseInt(sortValue) };
      }
    }

    this.state = initState;
  }

  getUrlState = props => {
    const p = props || this.props;
    return qs.parse(p.location.search, { ignoreQueryPrefix: true });
  };

  /*

  If useUrlState is not enabled, do nothing

  */
  updateQueryParameter = (key, value) => {
    if (this.props.useUrlState) {
      const urlState = this.getUrlState();

      if (value === null || value === '') {
        // when value is null or empty, remove key from URL state
        delete urlState[key];
      } else {
        urlState[key] = value;
      }
      const queryString = qs.stringify(urlState);
      this.props.history.push({
        search: `?${queryString}`,
      });
    }
  };

  toggleSort = column => {
    let currentSort;
    let urlValue;
    if (!this.state.currentSort[column]) {
      currentSort = { [column]: 1 };
      urlValue = `${column}|1`;
    } else if (this.state.currentSort[column] === 1) {
      currentSort = { [column]: -1 };
      urlValue = `${column}|-1`;
    } else {
      currentSort = {};
      urlValue = null;
    }
    this.setState({ currentSort });
    this.updateQueryParameter('sort', urlValue);
  };

  updateQuery = e => {
    e.persist();
    e.preventDefault();
    const value = e.target.value;
    this.setState({
      value,
    });
    delay(() => {
      this.setState({
        query: value,
      });
      this.updateQueryParameter('query', value);
    }, 700);
  };

  render() {
    const { Components, modalProps } = this.props;

    if (this.props.data) {
      // static JSON datatable

      return (
        <Components.DatatableContents
          Components={Components}
          columns={Object.keys(this.props.data[0])}
          {...this.props}
          results={this.props.data}
          showEdit={false}
          showNew={false}
          modalProps={modalProps}
        />
      );
    } else {
      // dynamic datatable with data loading

      const collection = this.props.collection || getCollection(this.props.collectionName);
      const options = {
        collection,
        ...this.props.options,
      };

      const DatatableWithMulti = withMulti(options)(Components.DatatableContents);
      // openCRUD backwards compatibility
      const canInsert =
        collection.options &&
        collection.options.mutations &&
        collection.options.mutations.new &&
        collection.options.mutations.new.check(this.props.currentUser);
      const canCreate =
        collection.options &&
        collection.options.mutations &&
        collection.options.mutations.create &&
        collection.options.mutations.create.check(this.props.currentUser);
      // add _id to orderBy when we want to sort a column, to avoid breaking the graphql() hoc;
      // see https://github.com/VulcanJS/Vulcan/issues/2090#issuecomment-433860782
      // this.state.currentSort !== {} is always false, even when console.log(this.state.currentSort) displays {}. So we test on the length of keys for this object.
      const orderBy =
        Object.keys(this.state.currentSort).length == 0
          ? {}
          : { ...this.state.currentSort, _id: -1 };

      return (
        <Components.DatatableLayout
          Components={Components}
          collectionName={collection.options.collectionName}>
          <Components.DatatableAbove
            Components={Components}
            {...this.props}
            collection={collection}
            canInsert={canInsert || canCreate}
            canUpdate={canInsert || canCreate}
            value={this.state.value}
            updateQuery={this.updateQuery}
          />
          <DatatableWithMulti
            Components={Components}
            {...this.props}
            collection={collection}
            terms={{ query: this.state.query, orderBy: orderBy }}
            currentUser={this.props.currentUser}
            toggleSort={this.toggleSort}
            currentSort={this.state.currentSort}
          />
        </Components.DatatableLayout>
      );
    }
  }
}

Datatable.propTypes = {
  title: PropTypes.string,
  collection: PropTypes.object,
  columns: PropTypes.array,
  data: PropTypes.array,
  options: PropTypes.object,
  showEdit: PropTypes.bool,
  showNew: PropTypes.bool,
  showSearch: PropTypes.bool,
  newFormOptions: PropTypes.object,
  editFormOptions: PropTypes.object,
  emptyState: PropTypes.object,
  Components: PropTypes.object.isRequired,
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
};

Datatable.defaultProps = {
  showNew: true,
  showEdit: true,
  showSearch: true,
  useUrlState: true,
};
registerComponent({
  name: 'Datatable',
  component: Datatable,
  hocs: [withCurrentUser, withComponents, withRouter],
});
export default Datatable;

const DatatableLayout = ({ collectionName, children }) => (
  <div className={`datatable datatable-${collectionName}`}>{children}</div>
);
registerComponent({ name: 'DatatableLayout', component: DatatableLayout });

/*

DatatableAbove Component

*/
const DatatableAbove = (props, { intl }) => {
  const {
    collection,
    currentUser,
    showSearch,
    showNew,
    canInsert,
    value,
    updateQuery,
    options,
    newFormOptions,
    Components,
  } = props;

  return (
    <Components.DatatableAboveLayout>
      {showSearch && (
        <Components.DatatableAboveSearchInput
          className="datatable-search form-control"
          placeholder={`${intl.formatMessage({
            id: 'datatable.search',
            defaultMessage: 'Search',
          })}…`}
          type="text"
          name="datatableSearchQuery"
          value={value}
          onChange={updateQuery}
        />
      )}
      {showNew && canInsert && (
        <Components.NewButton
          collection={collection}
          currentUser={currentUser}
          mutationFragmentName={options && options.fragmentName}
          {...newFormOptions}
        />
      )}
    </Components.DatatableAboveLayout>
  );
};
DatatableAbove.contextTypes = {
  intl: intlShape,
};
DatatableAbove.propTypes = {
  Components: PropTypes.object.isRequired,
};
registerComponent('DatatableAbove', DatatableAbove);

const DatatableAboveSearchInput = props => <input {...props} />;
registerComponent({ name: 'DatatableAboveSearchInput', component: DatatableAboveSearchInput });

const DatatableAboveLayout = ({ children }) => <div className="datatable-above">{children}</div>;
registerComponent({ name: 'DatatableAboveLayout', component: DatatableAboveLayout });

/*

DatatableHeader Component

*/
const DatatableHeader = ({ collection, column, toggleSort, currentSort, Components }, { intl }) => {
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
    return column.sortable ? (
      <Components.DatatableSorter
        name={sortPropertyName}
        label={formattedLabel}
        toggleSort={toggleSort}
        currentSort={currentSort}
        sortable={column.sortable}
      />
    ) : (
      <Components.DatatableHeaderCellLayout>{formattedLabel}</Components.DatatableHeaderCellLayout>
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
  <th {...otherProps}>{children}</th>
);
registerComponent({ name: 'DatatableHeaderCellLayout', component: DatatableHeaderCellLayout });

const SortNone = () => (
  <svg width="16" height="16" viewBox="0 0 438 438" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M25.7368 247.243H280.263C303.149 247.243 314.592 274.958 298.444 291.116L171.18 418.456C161.128 428.515 144.872 428.515 134.926 418.456L7.55631 291.116C-8.59221 274.958 2.85078 247.243 25.7368 247.243ZM298.444 134.884L171.18 7.54408C161.128 -2.51469 144.872 -2.51469 134.926 7.54408L7.55631 134.884C-8.59221 151.042 2.85078 178.757 25.7368 178.757H280.263C303.149 178.757 314.592 151.042 298.444 134.884Z"
      transform="translate(66 6)"
      fill="#000"
      fillOpacity="0.2"
    />
  </svg>
);

const SortDesc = () => (
  <svg width="16" height="16" viewBox="0 0 438 438" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M25.7368 0H280.263C303.149 0 314.592 27.7151 298.444 43.8734L171.18 171.213C161.128 181.272 144.872 181.272 134.926 171.213L7.55631 43.8734C-8.59221 27.7151 2.85078 0 25.7368 0Z"
      transform="translate(66 253.243)"
      fill="black"
      fillOpacity="0.7"
    />
    <path
      d="M171.18 7.54408L298.444 134.884C314.592 151.042 303.149 178.757 280.263 178.757H25.7368C2.85078 178.757 -8.59221 151.042 7.55631 134.884L134.926 7.54408C144.872 -2.51469 161.128 -2.51469 171.18 7.54408Z"
      transform="translate(66 6)"
      fill="black"
      fillOpacity="0.2"
    />
  </svg>
);

const SortAsc = () => (
  <svg width="16" height="16" viewBox="0 0 438 438" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M298.444 134.884L171.18 7.54408C161.128 -2.51469 144.872 -2.51469 134.926 7.54408L7.55631 134.884C-8.59221 151.042 2.85078 178.757 25.7368 178.757H280.263C303.149 178.757 314.592 151.042 298.444 134.884Z"
      transform="translate(66 6)"
      fill="black"
      fillOpacity="0.7"
    />
    <path
      d="M280.263 0H25.7368C2.85078 0 -8.59221 27.7151 7.55631 43.8734L134.926 171.213C144.872 181.272 161.128 181.272 171.18 171.213L298.444 43.8734C314.592 27.7151 303.149 0 280.263 0Z"
      transform="translate(66 253.243)"
      fill="black"
      fillOpacity="0.2"
    />
  </svg>
);

const DatatableSorter = ({ name, label, toggleSort, currentSort }) => (
  <th>
    <div
      className="datatable-sorter"
      onClick={() => {
        toggleSort(name);
      }}>
      <span className="datatable-sorter-label">{label}</span>
      <span className="sort-icon">
        {!currentSort[name] ? <SortNone /> : currentSort[name] === 1 ? <SortAsc /> : <SortDesc />}
      </span>
    </div>
  </th>
);

registerComponent('DatatableSorter', DatatableSorter);

/*

DatatableContents Component

*/

const DatatableContents = props => {
  let {
    title,
    collection,
    results,
    columns,
    loading,
    loadMore,
    count,
    totalCount,
    networkStatus,
    showEdit,
    currentUser,
    emptyState,
    toggleSort,
    currentSort,
    modalProps,
    Components,
    error,
  } = props;

  if (loading) {
    return (
      <div className="datatable-list datatable-list-loading">
        <Components.Loading />
      </div>
    );
  } else if (!results || !results.length) {
    return emptyState || null;
  }

  // if no columns are provided, default to using keys of first array item
  if (!columns) {
    columns = Object.keys(results[0]);
  }

  const isLoadingMore = networkStatus === 2;
  const hasMore = totalCount > results.length;
  const sortedColumns = _sortBy(columns, column => column.order);
  return (
    <Components.DatatableContentsLayout>
      {/* note: we want to be able to show potential errors while still showing the data below */}
      {error && <Components.Alert variant="danger">{error.message}</Components.Alert>}
      {title && <Components.DatatableTitle title={title} />}
      <Components.DatatableContentsInnerLayout>
        <Components.DatatableContentsHeadLayout>
          {sortedColumns.map((column, index) => (
            <Components.DatatableHeader
              Components={Components}
              key={index}
              collection={collection}
              column={column}
              toggleSort={toggleSort}
              currentSort={currentSort}
            />
          ))}
          {showEdit ? (
            <th>
              <FormattedMessage id="datatable.edit" />
            </th>
          ) : null}
        </Components.DatatableContentsHeadLayout>
        <Components.DatatableContentsBodyLayout>
          {results.map((document, index) => (
            <Components.DatatableRow
              {...props}
              collection={collection}
              columns={columns}
              document={document}
              key={index}
              showEdit={showEdit}
              currentUser={currentUser}
              modalProps={modalProps}
            />
          ))}
        </Components.DatatableContentsBodyLayout>
      </Components.DatatableContentsInnerLayout>
      {hasMore && (
        <Components.DatatableContentsMoreLayout>
          {isLoadingMore ? (
            <Components.Loading />
          ) : (
            <Components.DatatableLoadMoreButton
              Components={Components}
              onClick={e => {
                e.preventDefault();
                loadMore();
              }}>
              Load More ({count}/{totalCount})
            </Components.DatatableLoadMoreButton>
          )}
        </Components.DatatableContentsMoreLayout>
      )}
    </Components.DatatableContentsLayout>
  );
};
DatatableContents.propTypes = {
  Components: PropTypes.object.isRequired,
};
registerComponent('DatatableContents', DatatableContents);

const DatatableContentsLayout = ({ children }) => <div className="datatable-list">{children}</div>;
registerComponent({ name: 'DatatableContentsLayout', component: DatatableContentsLayout });
const DatatableContentsInnerLayout = ({ children }) => <table className="table">{children}</table>;
registerComponent({
  name: 'DatatableContentsInnerLayout',
  component: DatatableContentsInnerLayout,
});
const DatatableContentsHeadLayout = ({ children }) => (
  <thead>
    <tr>{children}</tr>
  </thead>
);
registerComponent({ name: 'DatatableContentsHeadLayout', component: DatatableContentsHeadLayout });
const DatatableContentsBodyLayout = ({ children }) => <tbody>{children}</tbody>;
registerComponent({ name: 'DatatableContentsBodyLayout', component: DatatableContentsBodyLayout });
const DatatableContentsMoreLayout = ({ children }) => (
  <div className="datatable-list-load-more">{children}</div>
);
registerComponent({ name: 'DatatableContentsMoreLayout', component: DatatableContentsMoreLayout });
const DatatableLoadMoreButton = ({ count, totalCount, Components, children, ...otherProps }) => (
  <Components.Button variant="primary" {...otherProps}>
    {children}
  </Components.Button>
);
registerComponent({ name: 'DatatableLoadMoreButton', component: DatatableLoadMoreButton });

/*

DatatableTitle Component

*/
const DatatableTitle = ({ title }) => <div className="datatable-title">{title}</div>;

registerComponent('DatatableTitle', DatatableTitle);

/*

DatatableRow Component

*/
const DatatableRow = (props, { intl }) => {
  const {
    collection,
    columns,
    document,
    showEdit,
    currentUser,
    options,
    editFormOptions,
    rowClass,
    Components,
  } = props;
  // openCRUD backwards compatibility
  const canEdit =
    collection &&
    collection.options &&
    collection.options.mutations &&
    collection.options.mutations.edit &&
    collection.options.mutations.edit.check(currentUser, document);
  const canUpdate =
    collection &&
    collection.options &&
    collection.options.mutations &&
    collection.options.mutations.update &&
    collection.options.mutations.update.check(currentUser, document);
  const row = typeof rowClass === 'function' ? rowClass(document) : rowClass || '';
  const { modalProps = {} } = props;
  const defaultModalProps = { title: <code>{document._id}</code> };
  const customModalProps = {
    ...defaultModalProps,
    ...(_isFunction(modalProps) ? modalProps(document) : modalProps),
  };
  const sortedColumns = _sortBy(columns, column => column.order);

  return (
    <Components.DatatableRowLayout className={`datatable-item ${row}`}>
      {sortedColumns.map((column, index) => (
        <Components.DatatableCell
          key={index}
          Components={Components}
          column={column}
          document={document}
          currentUser={currentUser}
        />
      ))}
      {showEdit && (canEdit || canUpdate) ? ( // openCRUD backwards compatibility
        <Components.DatatableCellLayout>
          <Components.EditButton
            collection={collection}
            documentId={document._id}
            currentUser={currentUser}
            mutationFragmentName={options && options.fragmentName}
            modalProps={customModalProps}
            {...editFormOptions}
          />
        </Components.DatatableCellLayout>
      ) : null}
    </Components.DatatableRowLayout>
  );
};
DatatableRow.propTypes = {
  Components: PropTypes.object.isRequired,
};
registerComponent('DatatableRow', DatatableRow);

DatatableRow.contextTypes = {
  intl: intlShape,
};
const DatatableRowLayout = ({ children, ...otherProps }) => <tr {...otherProps}>{children}</tr>;
registerComponent({ name: 'DatatableRowLayout', component: DatatableRowLayout });

/*

DatatableCell Component

*/
const DatatableCell = ({ column, document, currentUser, Components }) => {
  const Component =
    column.component ||
    (column.componentName && Components[column.componentName]) ||
    Components.DatatableDefaultCell;
  const columnName = getColumnName(column);
  return (
    <Components.DatatableCellLayout
      className={`datatable-item-${columnName.toLowerCase().replace(/\s/g, '-')}`}>
      <Component column={column} document={document} currentUser={currentUser} />
    </Components.DatatableCellLayout>
  );
};
DatatableCell.propTypes = {
  Components: PropTypes.object.isRequired,
};
registerComponent('DatatableCell', DatatableCell);

const DatatableCellLayout = ({ children, ...otherProps }) => <td {...otherProps}>{children}</td>;
registerComponent({ name: 'DatatableCellLayout', component: DatatableCellLayout });

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

registerComponent('DatatableDefaultCell', DatatableDefaultCell);
