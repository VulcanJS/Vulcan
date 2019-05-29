/**
 * Generic page for a collection
 * Must be handled by the parent :
 * - providing the documents and callbacks
 */

import React from 'react';
import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import Users from "meteor/vulcan:users";
import _difference from "lodash/difference";

const getCollectionSchema = collection => collection.options.schema;

const getDefaultColumns = (collection, currentUser) => {
  const schema = getCollectionSchema(collection);
  const possibleColumnsMap = Users.getViewableFields(currentUser, collection);
  let validColumns = Object.keys(possibleColumnsMap);
  validColumns = validColumns
    // remove array fields
    .filter(colName => !colName.match(/\.\$$/));
  // remove unwanted columns
  validColumns = _difference(validColumns, ["_id", "userId"]);
  // remove columns that are not viewable
  //validColumns = Users.restrict

  return validColumns;
};

const setSortable = (sortableColumns, columns) => {
  const sortableMap = sortableColumns.reduce((res, col) => ({...res, [col]: true }), {});
  return  columns.map(item => (item.name in sortableMap ? {...item, sortable: true} : item));
}

const buildDefaultColumns = (schema, columns) => {
  // TODO: use schema processing to specify component
  return columns.map( col => {
    if (typeof col === 'string') {
      return {
        name: col,  
      }
    }
    return col; 
  })
}

export const CollectionList = ({
  //loading,
  collection,
  sort,
  paginate,
  currentUser,
  /*
  basePath, // eg /customers
  editPath = "/edit", // relative to the baseRoute
  newPath= "/new",
  detailsPath,
  */
  basicColumns, // to replace all columns
  customColumns = [], // already customized columns
  sortableColumns = [],
}) => (
  <Components.Datatable
    collection={collection}
    sort={sort}
    paginate={paginate}
    columns={setSortable(sortableColumns, [
      // generate the default columns for non specific columns
      ...buildDefaultColumns(
        collection.options.schema,
        basicColumns || getDefaultColumns(collection, currentUser)
      ),
      ...customColumns
    ])}
  />
);

export default CollectionList;
registerComponent({
  name: 'VulcanBackofficeCollectionList',
  component: CollectionList,
  hocs: [withCurrentUser]
});
