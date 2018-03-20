import { registerComponent, Components, getCollection, Utils } from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withCurrentUser from '../containers/withCurrentUser.js';
import withList from '../containers/withList.js';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';
import Button from 'react-bootstrap/lib/Button';
import { getFieldValue } from './Card.jsx';

/*

Datatable Component

*/

// see: http://stackoverflow.com/questions/1909441/jquery-keyup-delay
const delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

class Datatable extends PureComponent {

  constructor() {
    super();
    this.updateQuery = this.updateQuery.bind(this);
    this.state = {
      value: '',
      query: ''
    }
  }

  updateQuery(e) {
    e.persist()
    e.preventDefault();
    this.setState({
      value: e.target.value
    });
    delay(() => {
      this.setState({
        query: e.target.value
      });
    }, 700 );
  }

  render() {

    if (this.props.data) { // static JSON datatable

      return <Components.DatatableContents {...this.props} results={this.props.data}/>;
            
    } else { // dynamic datatable with data loading
      
      const collection = this.props.collection || getCollection(this.props.collectionName);
      const options = {
        collection,
        ...this.props.options
      }

      const DatatableWithList = withList(options)(Components.DatatableContents);

      const canInsert = collection.options && collection.options.mutations && collection.options.mutations.new && collection.options.mutations.new.check(this.props.currentUser);

      return (
        <div className={`datatable datatable-${collection.options.collectionName}`}>
          <Components.DatatableAbove {...this.props} collection={collection} canInsert={canInsert} value={this.state.value} updateQuery={this.updateQuery} />
          <DatatableWithList {...this.props} collection={collection} terms={{query: this.state.query}} currentUser={this.props.currentUser}/>
        </div>
      )
    }
  }
}

Datatable.propTypes = {
  collection: PropTypes.object,
  columns: PropTypes.array,
  data: PropTypes.array,
  options: PropTypes.object,
  showEdit: PropTypes.bool,
  showNew: PropTypes.bool,
  showSearch: PropTypes.bool,
  newFormOptions: PropTypes.object,
  editFormOptions: PropTypes.object,
}

Datatable.defaultProps = {
  showNew: true,
  showEdit: true,
  showSearch: true,
}
registerComponent('Datatable', Datatable, withCurrentUser);


/*

DatatableAbove Component

*/
const DatatableAbove = (props) => {
  const { showSearch, showNew, canInsert, value, updateQuery, options, newFormOptions } = props;

  return (
    <div className="datatable-above">
      {showSearch && <input className="datatable-search form-control" placeholder="Search…" type="text" name="datatableSearchQuery" value={value} onChange={updateQuery} />}
      {showNew && canInsert && <Components.NewButton {...props} mutationFragmentName={options && options.fragmentName} {...newFormOptions}/>}
    </div>
  )
}
registerComponent('DatatableAbove', DatatableAbove);
  
/*

DatatableHeader Component

*/
const DatatableHeader = ({ collection, column }, { intl }) => {

  const columnName = typeof column === 'string' ? column : column.label || column.name;
  
  if (collection) {
    const schema = collection.simpleSchema()._schema;

    /*

    use either:

    1. the column name translation
    2. the column name label in the schema (if the column name matches a schema field)
    3. the raw column name.

    */
    const defaultMessage = schema[columnName] ? schema[columnName].label : Utils.camelToSpaces(columnName);
    const formattedLabel = intl.formatMessage({ id: `${collection._name}.${columnName}`, defaultMessage });

    return <th>{formattedLabel}</th>;

  } else {

    const formattedLabel = intl.formatMessage({ id: columnName, defaultMessage: columnName });
    return <th className={`datatable-th-${columnName.toLowerCase().replace(/\s/g,'-')}`}>{formattedLabel}</th>;

  }
}

DatatableHeader.contextTypes = {
  intl: intlShape
};

registerComponent('DatatableHeader', DatatableHeader);

/*

DatatableContents Component

*/

const DatatableContents = (props) => {

  const {collection, columns, results, loading, loadMore, count, totalCount, networkStatus, showEdit, currentUser, emptyState} = props;

  if (loading) {
    return <div className="datatable-list datatable-list-loading"><Components.Loading /></div>;
  } else if (!results.length) {
    return emptyState || null;
  }

  const isLoadingMore = networkStatus === 2;
  const hasMore = totalCount > results.length;

  return (
    <div className="datatable-list">
        <table className="table">
          <thead>
            <tr>
              {_.sortBy(columns, column => column.order).map((column, index) => <Components.DatatableHeader key={index} collection={collection} column={column}/>)}
              {showEdit ? <th><FormattedMessage id="datatable.edit"/></th> : null}
            </tr>
          </thead>
          <tbody>
            {results.map((document, index) => <Components.DatatableRow {...props} collection={collection} columns={columns} document={document} key={index} showEdit={showEdit} currentUser={currentUser}/>)}
          </tbody>
        </table>
        {hasMore &&
          <div className="datatable-list-load-more">
            {isLoadingMore ?
              <Components.Loading/> :
              <Button bsStyle="primary" onClick={e => {e.preventDefault(); loadMore();}}>Load More ({count}/{totalCount})</Button>
            }
          </div>
        }
      </div>
  )
}
registerComponent('DatatableContents', DatatableContents);

/*

DatatableRow Component

*/
const DatatableRow = (props, { intl }) => {

  const { collection, columns, document, showEdit, currentUser, options, editFormOptions } = props;
  const canEdit = collection && collection.options && collection.options.mutations && collection.options.mutations.edit && collection.options.mutations.edit.check(currentUser, document);

  return (
  <tr className="datatable-item">

    {_.sortBy(columns, column => column.order).map((column, index) => <Components.DatatableCell key={index} column={column} document={document} currentUser={currentUser} />)}

    {showEdit && canEdit ?
      <td>
        <Components.EditButton {...props} mutationFragmentName={options && options.fragmentName} {...editFormOptions}/>
      </td>
    : null}

  </tr>
  )
}
registerComponent('DatatableRow', DatatableRow);

DatatableRow.contextTypes = {
  intl: intlShape
};

/*

DatatableCell Component

*/
const DatatableCell = ({ column, document, currentUser }) => {
  const Component = column.component || Components[column.componentName] || Components.DatatableDefaultCell;
  const columnName = column.name || column;
  return (
    <td className={`datatable-item-${columnName.toLowerCase().replace(/\s/g,'-')}`}><Component column={column} document={document} currentUser={currentUser} /></td>
  )
}
registerComponent('DatatableCell', DatatableCell);

/*

DatatableDefaultCell Component

*/
const DatatableDefaultCell = ({ column, document }) =>
  <div>{typeof column === 'string' ? getFieldValue(document[column]) : getFieldValue(document[column.name])}</div>

registerComponent('DatatableDefaultCell', DatatableDefaultCell);
