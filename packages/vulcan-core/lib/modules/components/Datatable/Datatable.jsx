import { Utils, registerComponent, getCollection } from 'meteor/vulcan:lib';
import React, { PureComponent, memo } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import qs from 'qs';
import { withRouter } from 'react-router';
import { compose } from 'meteor/vulcan:lib';
import _isEmpty from 'lodash/isEmpty';
import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';
import withCurrentUser from '../../containers/currentUser.js';
import withComponents from '../../containers/withComponents';
import withMulti from '../../containers/multi2.js';
import Users from 'meteor/vulcan:users';
import _get from 'lodash/get';

const ascSortOperator = 'asc';
const descSortOperator = 'desc';

const convertToBoolean = s => (s === 'true' ? true : false);

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

class Datatable extends PureComponent {
  constructor(props) {
    super(props);

    const { initialState, useUrlState } = props;

    let initState = {
      searchValue: '',
      search: '',
      currentSort: {},
      currentFilters: {},
      selectedItems: [],
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

  Take a complex filter object and convert its "leaves" to numbers or booleans when needed

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
        const fieldType = Utils.getFieldType(field);
        const filter = urlStateFilters[fieldName];
        // the "operator" can be _in, _eq, _gte, etc.
        const [operator] = Object.keys(filter);
        const value = urlStateFilters[fieldName][operator];
        let convertedValue = value;
        // for each field, check if it's supposed to be a number
        if (fieldType === Number) {
          // value can be a single value or an array, depending on filter type
          convertedValue = Array.isArray(value) ? value.map(parseFloat) : parseFloat(value);
        } else if (fieldType === Boolean) {
          // value can be a single value or an array, depending on filter type
          convertedValue = Array.isArray(value) ? value.map(convertToBoolean) : convertToBoolean(value);
        }
        _set(convertedFilters, `${fieldName}.${operator}`, convertedValue);
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
    if (_isEmpty(filters)) {
      // if there are no filter options, remove column filter from state altogether
      delete newFilters[name];
    } else {
      // else, update filters
      newFilters[name] = filters;
    }
    this.setState({ currentFilters: newFilters });
    this.updateQueryParameter('filter', _isEmpty(newFilters) ? null : newFilters);
  };

  updateSearch = e => {
    e.persist();
    e.preventDefault();
    const searchValue = e.target.value;
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

  toggleItem = id => {
    const { selectedItems } = this.state;
    const newSelectedItems = selectedItems.includes(id) ? selectedItems.filter(x => x !== id) : [...selectedItems, id];
    this.setState({
      selectedItems: newSelectedItems,
    });
  };

  render() {
    const { Components, modalProps, data, currentUser, onSubmitSelected } = this.props;

    if (this.props.data) {
      // static JSON datatable

      return (
        <Components.DatatableContents
          Components={Components}
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
      // dynamic datatable with data loading

      const collection = this.props.collection || getCollection(this.props.collectionName);
      const options = {
        collection,
        ...this.props.options,
      };

      const DatatableWithMulti = compose(withMulti(options))(Components.DatatableContents);

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
        canCreate = check && check(currentUser, {}, { Users });
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
        <Components.DatatableLayout Components={Components} collectionName={collection.options.collectionName}>
          <Components.DatatableAbove
            Components={Components}
            {...this.props}
            collection={collection}
            canInsert={canCreate}
            canCreate={canCreate}
            searchValue={this.state.searchValue}
            updateSearch={this.updateSearch}
            selectedItems={this.state.selectedItems}
            onSubmitSelected={onSubmitSelected}
          />
          <DatatableWithMulti
            Components={Components}
            {...this.props}
            collection={collection}
            input={input}
            currentUser={this.props.currentUser}
            toggleSort={this.toggleSort}
            currentSort={this.state.currentSort}
            submitFilters={this.submitFilters}
            currentFilters={this.state.currentFilters}
            toggleItem={this.toggleItem}
            selectedItems={this.state.selectedItems}
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
  showDelete: PropTypes.bool,
  showNew: PropTypes.bool,
  showSearch: PropTypes.bool,
  newFormProps: PropTypes.object,
  editFormProps: PropTypes.object,
  newFormOptions: PropTypes.object, // backwards compatibility
  editFormOptions: PropTypes.object, // backwards compatibility
  Components: PropTypes.object.isRequired,
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  rowClass: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

Datatable.defaultProps = {
  showNew: true,
  showEdit: true,
  showDelete: false,
  showSearch: true,
  useUrlState: true,
};
registerComponent({
  name: 'Datatable',
  component: Datatable,
  hocs: [withCurrentUser, withComponents, withRouter, memo],
});
export default Datatable;

const DatatableLayout = ({ collectionName, children }) => (
  <div className={`datatable datatable-${collectionName.toLowerCase()}`}>{children}</div>
);
registerComponent({ name: 'DatatableLayout', component: DatatableLayout, hocs: [memo] });

/*

DatatableAbove Component

*/
const DatatableAbove = props => {
  const { Components } = props;

  return (
    <Components.DatatableAboveLayout>
      <Components.DatatableAboveLeft {...props} />
      <Components.DatatableAboveRight {...props} />
    </Components.DatatableAboveLayout>
  );
};
DatatableAbove.propTypes = {
  Components: PropTypes.object.isRequired,
};
registerComponent({ name: 'DatatableAbove', component: DatatableAbove, hocs: [memo] });

const DatatableAboveLeft = (props, { intl }) => {
  const { showSearch, searchValue, updateSearch, Components } = props;
  return (
    <div className="datatable-above-left">
      {showSearch && (
        <Components.DatatableAboveSearchInput
          className="datatable-search form-control"
          inputProperties={{
            path: 'datatableSearchQuery',
            placeholder: `${intl.formatMessage({
              id: 'datatable.search',
              defaultMessage: 'Search',
            })}…`,
            value: searchValue,
            onChange: updateSearch,
          }}
          Components={Components}
        />
      )}
    </div>
  );
};

DatatableAboveLeft.contextTypes = {
  intl: intlShape,
};

registerComponent({ name: 'DatatableAboveLeft', component: DatatableAboveLeft, hocs: [memo] });

const DatatableAboveRight = props => {
  const {
    collection,
    currentUser,
    showNew,
    canInsert,
    options,
    newFormOptions,
    newFormProps,
    Components,
    showSelect,
    selectedItems,
    onSubmitSelected,
  } = props;
  return (
    <div className="datatable-above-right">
      {showSelect && selectedItems.length > 0 && (
        <div className="datatable-above-item">
          <Components.DatatableSubmitSelected selectedItems={selectedItems} onSubmitSelected={onSubmitSelected} />
        </div>
      )}
      {showNew && canInsert && (
        <div className="datatable-above-item">
          <Components.NewButton
            collection={collection}
            currentUser={currentUser}
            mutationFragmentName={options && options.fragmentName}
            {...newFormOptions}
            {...newFormProps}
          />
        </div>
      )}
    </div>
  );
};

registerComponent({ name: 'DatatableAboveRight', component: DatatableAboveRight, hocs: [memo] });

const DatatableAboveSearchInput = props => {
  const { Components } = props;
  return (
    <div className="datatable-above-search-input">
      <Components.FormComponentText {...props} />
    </div>
  );
};
registerComponent({ name: 'DatatableAboveSearchInput', component: DatatableAboveSearchInput, hocs: [memo] });

const DatatableAboveLayout = ({ children }) => <div className="datatable-above">{children}</div>;
registerComponent({ name: 'DatatableAboveLayout', component: DatatableAboveLayout, hocs: [memo] });
