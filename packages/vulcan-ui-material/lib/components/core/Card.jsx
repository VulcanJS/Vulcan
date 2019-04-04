import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import { replaceComponent, Components } from 'meteor/vulcan:core';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import EditIcon from 'mdi-material-ui/Pencil';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import classNames from 'classnames';


const getLabel = (field, fieldName, collection, intl) => {
  const schema = collection.simpleSchema()._schema;
  const fieldSchema = schema[fieldName];
  if (fieldSchema) {
    return intl.formatMessage(
      { id: `${collection._name}.${fieldName}`, defaultMessage: fieldSchema.label });
  } else {
    return fieldName;
  }
};


const getTypeName = (field, fieldName, collection) => {
  const schema = collection.simpleSchema()._schema;
  const fieldSchema = schema[fieldName];
  if (fieldSchema) {
    const type = fieldSchema.type.singleType;
    const typeName = typeof type === 'function' ? type.name : type;
    return typeName;
  } else {
    return typeof field;
  }
};


const parseImageUrl = value => {
  const isImage = ['.png', '.jpg', '.gif'].indexOf(value.substr(-4)) !== -1 ||
    ['.webp', '.jpeg'].indexOf(value.substr(-5)) !== -1;
  return isImage ?
    <img style={{ width: '100%', maxWidth: 200 }} src={value} alt={value}/> :
    <LimitedString string={value}/>;
};


const LimitedString = ({ string }) =>
  <div>
    {string.indexOf(' ') === -1 && string.length > 30 ?
      <span title={string}>{string.substr(0, 30)}…</span> :
      <span>{string}</span>
    }
  </div>;


export const getFieldValue = (value, typeName, classes={}) => {
  
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  
  if (Array.isArray(value)) {
    typeName = 'Array';
  }
  
  if (typeof typeName === 'undefined') {
    typeName = typeof value;
  }
  
  switch (typeName) {
    
    case 'Boolean':
    case 'boolean':
      return <Checkbox checked={value} disabled style={{ width: '32px', height: '32px' }}/>;
    
    case 'Number':
    case 'number':
    case 'SimpleSchema.Integer':
      return <code>{value.toString()}</code>;
    
    case 'Array':
      return <ol>{value.map(
        (item, index) => <li key={index}>{getFieldValue(item, typeof item, classes)}</li>)}</ol>;
    
    case 'Object':
    case 'object':
      return (
        <Table className="table">
          <TableBody>
            {_.map(value, (value, key) =>
              <TableRow className={classNames(classes.table, 'table')} key={key}>
                <TableCell className={classNames(classes.tableHeadCell, 'datacard-label')} variant="head">{key}</TableCell>
                <TableCell className={classNames(classes.tableCell, 'datacard-value')} >{getFieldValue(value, typeof value, classes)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      );
    
    case 'Date':
      return moment(new Date(value)).format('dddd, MMMM Do YYYY, h:mm:ss');
    
    default:
      return parseImageUrl(value);
  }
};


const CardItem = ({ label, value, typeName, classes }) =>
  <TableRow className={classes.tableRow}>
    <TableCell className={classNames(classes.tableHeadCell, 'datacard-label')} variant="head">
      {label}
    </TableCell>
    <TableCell className={classNames(classes.tableCell, 'datacard-value')}>
      {getFieldValue(value, typeName, classes)}
    </TableCell>
  </TableRow>;


const CardEdit = (props, context) => {
  const classes = props.classes;
  const editTitle = context.intl.formatMessage({ id: 'cards.edit' });
  return (
    <TableRow className={classes.tableRow}>
      <TableCell className={classes.tableCell} colSpan="2">
        <Components.ModalTrigger label={editTitle}
                                 component={<IconButton aria-label={editTitle}>
                                   <EditIcon/>
                                 </IconButton>}
        >
          <CardEditForm {...props} />
        </Components.ModalTrigger>
      </TableCell>
    </TableRow>
  );
};


CardEdit.contextTypes = { intl: intlShape };


const CardEditForm = ({ collection, document, closeModal }) =>
  <Components.SmartForm
    collection={collection}
    documentId={document._id}
    showRemove={true}
    successCallback={document => {
      closeModal();
    }}
  />;


const styles = theme => ({
  root: {},
  table: {
    maxWidth: '100%'
  },
  tableBody: {},
  tableRow: {},
  tableCell: {},
  tableHeadCell: {},
});


const Card = ({ className, collection, document, currentUser, fields, classes }, { intl }) => {
  
  const fieldNames = fields ? fields : _.without(_.keys(document), '__typename');
  const canUpdate = currentUser && collection.options.mutations.update.check(currentUser, document);
  
  return (
    <div className={classNames(classes.root, 'datacard', `datacard-${collection._name}`, className)}>
      <Table className={classNames(classes.table, 'table')} style={{ maxWidth: '100%' }}>
        <TableBody>
          {canUpdate ? <CardEdit collection={collection} document={document} classes={classes}/> : null}
          {fieldNames.map((fieldName, index) =>
            <CardItem key={index}
                      value={document[fieldName]}
                      typeName={getTypeName(document[fieldName], fieldName, collection)}
                      label={getLabel(document[fieldName], fieldName, collection, intl)}
                      classes={classes}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
};


Card.displayName = 'Card';


Card.propTypes = {
  className: PropTypes.string,
  collection: PropTypes.object,
  document: PropTypes.object,
  currentUser: PropTypes.object,
  fields: PropTypes.array,
  classes: PropTypes.object.isRequired,
};


Card.contextTypes = {
  intl: intlShape
};


replaceComponent('Card', Card, [withStyles, styles]);
