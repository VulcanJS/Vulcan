import { Utils, registerComponent, getCollection } from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import qs from 'qs';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import _isEmpty from 'lodash/isEmpty';
import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';
import withCurrentUser from '../../containers/currentUser.js';
import withComponents from '../../containers/withComponents';
import withMulti from '../../containers/multi2.js';
import Users from 'meteor/vulcan:users';

const ascSortOperator = 'asc';
const descSortOperator = 'desc';

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
    };

    // initial state can be defined via props
    // note: this prop-originating initial state will *not* be reflected in the URL
    if (initialState) {
      if (initialState.search) {
        initState.searchValue = initialState.search;
        initState.search = initialState.search;
      }
      if (initialState.orderBy) {
        initState.currentSort = initialState.orderBy;
      }
      if (initialState.filters) {
        initState.currentFilters = initialState.filters;
      }
    }

    // only load urlState if useUrlState is enabled
    if (useUrlState) {
      const urlState = this.getUrlState(props);
      if (urlState.search) {
        initState.searchValue = urlState.search;
        initState.search = urlState.search;
      }
      if (urlState.orderBy) {
        const [sortKey, sortValue] = urlState.orderBy.split('|');
        initState.currentSort = { [sortKey]: parseInt(sortValue) };
      }
      if (urlState.filters) {
        // all URL values are stored as strings, so convert them back to numbers if needed
        initState.currentFilters = this.convertToNumbers(urlState.filters, props);
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
    this.updateQueryParameter('orderBy', urlValue);
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
    this.updateQueryParameter('filters', _isEmpty(newFilters) ? null : newFilters);
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

  render() {
    const { Components, modalProps, data } = this.props;

    if (this.props.data) {
      // static JSON datatable

      return (
        <Components.DatatableContents
          Components={Components}
          {...this.props}
          datatableData={data}
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

      const DatatableWithMulti = compose(withMulti(options))(Components.DatatableContents);

      // openCRUD backwards compatibility
      const canInsert =
        collection.options &&
        collection.options.mutations &&
        collection.options.mutations.new &&
        collection.options.mutations.new.check(this.props.currentUser, null, { Users });
      const canCreate =
        collection.options &&
        collection.options.mutations &&
        collection.options.mutations.create &&
        collection.options.mutations.create.check(this.props.currentUser, null, { Users });

      const input = {};
      if (!_isEmpty(this.state.search)) {
        input.search = this.state.search;
      }
      if (!_isEmpty(this.state.currentSort)) {
        input.orderBy = this.state.currentSort;
      }
      if (!_isEmpty(this.state.currentFilters)) {
        input.where = this.state.currentFilters;
      }

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
            searchValue={this.state.searchValue}
            updateSearch={this.updateSearch}
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
    searchValue,
    updateSearch,
    options,
    newFormOptions,
    Components,
  } = props;

  return (
    <Components.DatatableAboveLayout>
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

const DatatableAboveSearchInput = props => {
  const { Components } = props;
  return <Components.FormComponentText {...props} />;
};
registerComponent({ name: 'DatatableAboveSearchInput', component: DatatableAboveSearchInput });

const DatatableAboveLayout = ({ children }) => <div className="datatable-above">{children}</div>;
registerComponent({ name: 'DatatableAboveLayout', component: DatatableAboveLayout });
