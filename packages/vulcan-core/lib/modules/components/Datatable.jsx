import { registerComponent, Components } from 'meteor/vulcan:lib';
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

    const options = {
      collection: this.props.collection,
      ...this.props.options
    }

    const DatatableWithList = withList(options)(Components.DatatableContents);

    return (
      <div className={`datatable datatable-${this.props.collection._name}`}>
        {this.props.showSearch ? <input className="datatable-search form-control" placeholder="Search…" type="text" name="datatableSearchQuery" value={this.state.value} onChange={this.updateQuery} /> : null}
        <DatatableWithList {...this.props} terms={{query: this.state.query}} currentUser={this.props.currentUser}/>
      </div>
    )
  }
}

Datatable.propTypes = {
  collection: PropTypes.object,
  columns: PropTypes.array,
  options: PropTypes.object,
  showEdit: PropTypes.bool,
  showSearch: PropTypes.bool,
}

Datatable.defaultProps = {
  showEdit: true,
  showSearch: true,
}
registerComponent('Datatable', Datatable, withCurrentUser);

/*

DatatableHeader Component

*/
const DatatableHeader = ({ collection, column }, { intl }) => {
  const schema = collection.simpleSchema()._schema;
  const columnName = typeof column === 'string' ? column : column.name;

  /*

  use either:
  
  1. the column name translation
  2. the column name label in the schema (if the column name matches a schema field)
  3. the raw column name.
  
  */
  const formattedLabel = intl.formatMessage({ id: `${collection._name}.${columnName}`, defaultMessage: schema[columnName] ? schema[columnName].label : columnName });
  return <th>{formattedLabel}</th>;
}

DatatableHeader.contextTypes = {
  intl: intlShape
};

registerComponent('DatatableHeader', DatatableHeader);

/*

DatatableContents Component

*/

const DatatableContents = (props) => {
  const {collection, columns, results, loading, loadMore, count, totalCount, networkStatus, showEdit, currentUser} = props;
  
  if (loading) {
    return <Components.Loading />;
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
          {results.map((document, index) => <Components.DatatableRow collection={collection} columns={columns} document={document} key={index} showEdit={showEdit} currentUser={currentUser}/>)}
        </tbody>
      </table>
      <div className="admin-users-load-more">
        {hasMore ? 
          isLoadingMore ? 
            <Components.Loading/> 
            : <Button bsStyle="primary" onClick={e => {e.preventDefault(); loadMore();}}>Load More ({count}/{totalCount})</Button> 
          : null
        }
      </div>
    </div>
  )
}
registerComponent('DatatableContents', DatatableContents);

/*

DatatableRow Component

*/
const DatatableRow = ({ collection, columns, document, showEdit, currentUser }, { intl }) => {
  return (
  <tr className="datatable-item">

    {_.sortBy(columns, column => column.order).map((column, index) => <Components.DatatableCell key={index} column={column} document={document} currentUser={currentUser} />)}
  
    {showEdit ? 
      <td>
        <Components.ModalTrigger 
          label={intl.formatMessage({id: 'datatable.edit'})} 
          component={<Button bsStyle="primary"><FormattedMessage id="datatable.edit" /></Button>}
        >
          <Components.DatatableEditForm collection={collection} document={document} />
        </Components.ModalTrigger>
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

DatatableEditForm Component

*/
const DatatableEditForm = ({ collection, document, closeModal }) =>
  <Components.SmartForm 
    collection={collection}
    documentId={document._id}
    showRemove={true}
    successCallback={document => {
      closeModal();
    }}
  />
registerComponent('DatatableEditForm', DatatableEditForm);


/*

DatatableCell Component

*/
const DatatableCell = ({ column, document, currentUser }) => {
  const Component = column.component || Components[column.componentName] || Components.DatatableDefaultCell;
  const columnName = column.name || column;
  return (
    <td className={`datatable-item-${columnName.toLowerCase()}`}><Component column={column} document={document} currentUser={currentUser} /></td>
  )
}
registerComponent('DatatableCell', DatatableCell);

/*

DatatableDefaultCell Component

*/

const DatatableDefaultCell = ({ column, document }) =>
  <div>{typeof column === 'string' ? getFieldValue(document[column]) : getFieldValue(document[column.name])}</div>

registerComponent('DatatableDefaultCell', DatatableDefaultCell);
