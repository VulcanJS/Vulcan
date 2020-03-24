import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import qs from 'qs';
import { replaceComponent, withCurrentUser, withMulti2, Components } from 'meteor/vulcan:core';
import compose from 'recompose/compose';
import _isEmpty from 'lodash/isEmpty';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _remove from 'lodash/remove';
import _union from 'lodash/union';
import _cloneDeep from 'lodash/cloneDeep';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import { Utils, getCollection } from 'meteor/vulcan:lib';
import Users from 'meteor/vulcan:users';

/*

Datatable Component

*/
export const baseStyles = theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scroller: {
    overflowX: 'auto',
    overflowY: 'hidden',
  },
  searchWrapper: {},
  addButtonWrapper: {
    alignItems: 'center',
  },
  addButton: {
    // Floating button won't work with multiple datatables, buttons are superposed
    // top: '9.5rem',
    // right: '2rem',
    // position: 'fixed',
    // bottom: 'auto',
  },
  table: {
    marginTop: 0,
  },
  denseTable: {},
  denserTable: {},
  flatTable: {},
  tableHead: {},
  tableBody: {},
  tableFooter: {},
  tableRow: {},
  tableHeadCell: {},
  tableCell: {},
  clickRow: {},
  editCell: {},
  editButton: {},
});

const ascSortOperator = 'asc';
const descSortOperator = 'desc';

const delay = (function() {
  var timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

class Datatable extends PureComponent {
  constructor(props) {
    super(props);

    const { initialState, useUrlState } = props;

    let initState = {
      searchValue: '',
      search: '',
      currentSort: {},
      currentFilters: {},
      currentSelection: [],
    };

    // initial state can be defined via props
    // note: this prop-originating initial state will *not* be reflected in the URL
    if (initialState) {
      if (initialState.search) {
        initState.searchValue = initialState.search;
        initState.search = initialState.search;
      }
      if (initialState.sort) {
        initState.currentSort = initialState.sort;
      }
      if (initialState.filter) {
        initState.currentFilters = initialState.filter;
      }
    }

    // only load urlState if useUrlState is enabled
    if (useUrlState) {
      const urlState = this.getUrlState(props);
      if (urlState.search) {
        initState.searchValue = urlState.search;
        initState.search = urlState.search;
      }
      if (urlState.sort) {
        const [sortKey, sortValue] = urlState.sort.split('|');
        initState.currentSort = { [sortKey]: sortValue };
      }
      if (urlState.filter) {
        // all URL values are stored as strings, so convert them back to numbers if needed
        initState.currentFilters = this.convertToNumbers(urlState.filter, props);
      }
    }

    this.state = initState;
  }

  /*

  Take a complex filter object and convert its "leaves" to numbers when needed

  */
  convertToNumbers = (urlStateFilters, props) => {
    const convertedFilters = _cloneDeep(urlStateFilters);
    const p = props || this.props;
    const { collection } = p;

    // only try to convert when we have a collection schema
    if (collection) {
      const schema = collection.simpleSchema()._schema;

      Object.keys(urlStateFilters).forEach(fieldName => {
        const field = schema[fieldName];
        // for each field, check if it's supposed to be a number
        if (Utils.getFieldType(field) === Number) {
          const filter = urlStateFilters[fieldName];
          // the "operator" can be _in, _eq, _gte, etc.
          const [operator] = Object.keys(filter);
          const value = urlStateFilters[fieldName][operator];
          // value can be a single value or an array, depending on filter type
          const convertedValue = Array.isArray(value) ? value.map(parseFloat) : parseFloat(value);
          _set(convertedFilters, `${fieldName}.${operator}`, convertedValue);
        }
      });
    }
    return convertedFilters;
  };

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

  /*

  Note: when state is asc, toggling goes to desc;
  but when state is desc toggling again removes sort.

  */
  toggleSort = column => {
    let currentSort;
    let urlValue;
    if (!this.state.currentSort[column]) {
      currentSort = { [column]: ascSortOperator };
      urlValue = `${column}|${ascSortOperator}`;
    } else if (this.state.currentSort[column] === ascSortOperator) {
      currentSort = { [column]: descSortOperator };
      urlValue = `${column}|${descSortOperator}`;
    } else {
      currentSort = {};
      urlValue = null;
    }
    this.setState({ currentSort });
    this.updateQueryParameter('sort', urlValue);
  };

  submitFilters = ({ name, filters }) => {
    // clone state filters object
    let newFilters = Object.assign({}, this.state.currentFilters);
    if (_isEmpty(filters) || Object.values(filters).every(value => _isEmpty(value) && typeof value !== 'number')) {
      // if there are no filter options, remove column filter from state altogether
      delete newFilters[name];
    } else {
      // else, update filters
      newFilters[name] = filters;
    }
    this.setState({ currentFilters: newFilters });
    this.updateQueryParameter('filter', _isEmpty(newFilters) ? null : newFilters);
  };

  updateSearch = searchValue => {
    this.setState({
      searchValue,
    });
    delay(() => {
      this.setState({
        search: searchValue,
      });
      this.updateQueryParameter('search', searchValue);
    }, 700);
  };

  toggleSelection = (element, remove) => {
    const elementsArray = Array.isArray(element) ? element : [element];
    let currentSelection = [...this.state.currentSelection];
    if (remove) {
      _remove(currentSelection, o => elementsArray.includes(o));
    } else {
      currentSelection = _union(currentSelection, elementsArray);
    }
    this.setState({ currentSelection });
  };

  render() {
    const { modalProps, data, currentUser } = this.props;

    if (this.props.data) {
      return (
        <Components.DatatableContents
          {...this.props}
          datatableData={data}
          results={this.props.data}
          showEdit={false}
          showDelete={false}
          showNew={false}
          modalProps={modalProps}
        />
      );
    } else {
      const { className, options, classes } = this.props;

      const collection = this.props.collection || getCollection(this.props.collectionName);

      const listOptions = {
        collection: collection,
        ...options,
      };

      const DatatableWithMulti = compose(withMulti2(listOptions))(Components.DatatableContents);

      let canCreate = false;

      // new APIs
      const permissionCheck = _get(collection, 'options.permissions.canCreate');

      // openCRUD backwards compatibility
      const check = _get(collection, 'options.mutations.new.check') || _get(collection, 'options.mutations.create.check');

      if (Users.isAdmin(currentUser)) {
        canCreate = true;
      } else if (permissionCheck) {
        canCreate = Users.permissionCheck({
          check: permissionCheck,
          user: currentUser,
          context: { Users },
          operationName: 'create',
        });
      } else if (check) {
        canCreate = check && check(currentUser, document, { Users });
      }

      const input = {};
      if (!_isEmpty(this.state.search)) {
        input.search = this.state.search;
      }
      if (!_isEmpty(this.state.currentSort)) {
        input.sort = this.state.currentSort;
      }
      if (!_isEmpty(this.state.currentFilters)) {
        input.filter = this.state.currentFilters;
      }
      return (
        <div className={classNames('datatable', `datatable-${collection._name}`, classes.root, className)}>
          <Components.DatatableAbove
            {...this.props}
            collection={collection}
            canInsert={canCreate}
            canCreate={canCreate}
            searchValue={this.state.searchValue}
            updateSearch={this.updateSearch}
            input={input}
            currentSelection={this.state.currentSelection}
          />

          <div className={classes.scroller}>
            <DatatableWithMulti
              {...this.props}
              collection={collection}
              input={input}
              currentUser={this.props.currentUser}
              toggleSort={this.toggleSort}
              currentSort={this.state.currentSort}
              currentSelection={this.state.currentSelection}
              toggleSelection={this.toggleSelection}
              submitFilters={this.submitFilters}
              currentFilters={this.state.currentFilters}
            />
          </div>
        </div>
      );
    }
  }
}

Datatable.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  collection: PropTypes.object,
  options: PropTypes.object,
  columns: PropTypes.array,
  showEdit: PropTypes.bool,
  editComponent: PropTypes.func,
  showNew: PropTypes.bool,
  showSearch: PropTypes.bool,
  newFormProps: PropTypes.object,
  editFormProps: PropTypes.object,
  newFormOptions: PropTypes.object, // backwards compatibility
  editFormOptions: PropTypes.object, // backwards compatibility
  emptyState: PropTypes.node,
  currentUser: PropTypes.object,
  classes: PropTypes.object,
  data: PropTypes.array,
  footerData: PropTypes.array,
  dense: PropTypes.string,
  queryDataRef: PropTypes.func,
  rowClass: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  handleRowClick: PropTypes.func,
  intlNamespace: PropTypes.string,
  toggleSort: PropTypes.func,
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  currentSort: PropTypes.object,
  // paginate: PropTypes.bool,
  aboveComponents: PropTypes.array,
};

Datatable.defaultProps = {
  showNew: true,
  showEdit: true,
  showSearch: true,
  // paginate: false,
  useUrlState: true,
};

replaceComponent('Datatable', Datatable, withCurrentUser, [withStyles, baseStyles]);

/*

DatatableAbove Component

*/
const DatatableAbove = (props, { intl }) => {
  const {
    collection,
    currentUser,
    currentSelection,
    showSearch,
    showNew,
    showExport,
    showDelete,
    canInsert,
    searchValue,
    updateSearch,
    options,
    newFormOptions,
    newFormProps,
    input: _input,
    aboveComponents,
    classes,
  } = props;
  const isSelected = currentSelection && currentSelection.length;
  const input = isSelected ? { filter: { _id: { _in: currentSelection } } } : _input;
  return (
    <div className={classes.header}>
      {showSearch && (
        <Components.SearchInput
          value={searchValue}
          updateQuery={updateSearch}
          className={classes.search}
          labelId={'datatable.search'}
          //should include placeholder
        />
      )}
      {showNew && canInsert && (
        <Components.NewButton
          collection={collection}
          variant="fab"
          color="primary"
          currentUser={currentUser}
          mutationFragmentName={options && options.fragmentName}
          className={classes.addButton}
          {...newFormOptions}
          {...newFormProps}
        />
      )}
      {showExport && (
        <Components.CSVExportButton
          collection={collection}
          options={{ ...options, limit: 10000 }}
          input={input}
          className={classes.csvExportButton}
        />
      )}
      {showDelete && isSelected ? (
        <Components.DeleteButton
          collection={collection}
          currentUser={currentUser}
          fragmentName={options && options.fragmentName}
          className={classes.deleteButton}
          //input={input}
          documentIds={currentSelection}
        />
      ) : null}
      {aboveComponents
        ? aboveComponents.map(component => {
            const Component = typeof component === 'string' ? Components[component] : component;
            return (
              <Component
                collection={collection}
                input={_input}
                options={options}
                currentSelection={currentSelection}
                currentUser={currentUser}
                key={component}
              />
            );
          })
        : null}
    </div>
  );
};
DatatableAbove.contextTypes = {
  intl: intlShape,
};
replaceComponent('DatatableAbove', DatatableAbove);
