import Users from './collection.js';
import intersection from 'lodash/intersection';
import compact from 'lodash/compact';
import map from 'lodash/map';
import difference from 'lodash/difference';
import get from 'lodash/get';
import unset from 'lodash/unset';
import cloneDeep from 'lodash/cloneDeep';
import { getCollection, forEachDocumentField, Utils, deprecate } from 'meteor/vulcan:lib';

/**
 * @summary Users.groups object
 */
Users.groups = {};

/**
 * @summary Group class
 */
class Group {
  constructor() {
    this.actions = [];
  }

  can(actions) {
    actions = Array.isArray(actions) ? actions : [actions];
    this.actions = this.actions.concat(actions.map(a => a.toLowerCase()));
  }

  cannot(actions) {
    actions = Array.isArray(actions) ? actions : [actions];
    this.actions = _.difference(
      this.actions,
      actions.map(a => a.toLowerCase())
    );
  }
}

////////////////////
// Helpers        //
////////////////////

/**
 * @summary create a new group
 * @param {String} groupName
 */
Users.createGroup = groupName => {
  Users.groups[groupName] = new Group();
};

/**
 * @summary get a list of a user's groups
 * @param {Object} user
 */
Users.getGroups = (user, document) => {
  let userGroups = ['guests'];

  if (user) {
    userGroups.push('members');

    if (document && Users.owns(user, document)) {
      userGroups.push('owners');
    }

    if (user.groups) {
      // custom groups
      userGroups = userGroups.concat(user.groups);
    }

    if (Users.isAdmin(user)) {
      // admin
      userGroups.push('admins');
    }
  }

  return userGroups;
};

/**
 * @summary get a list of all the actions a user can perform
 * @param {Object} user
 */
Users.getActions = user => {
  let userGroups = Users.getGroups(user);
  if (!userGroups.includes('guests')) {
    // always give everybody permission for guests actions, too
    userGroups.push('guests');
  }
  let groupActions = userGroups.map(groupName => {
    // note: make sure groupName corresponds to an actual group
    const group = Users.groups[groupName];
    return group && group.actions;
  });
  return _.unique(_.flatten(groupActions));
};

/**
 * @summary check if a user is a member of a group
 * @param {Array} user
 * @param {String} group or array of groups
 */
Users.isMemberOf = (user, groupOrGroups, document) => {
  const groups = Array.isArray(groupOrGroups) ? groupOrGroups : [groupOrGroups];
  return intersection(Users.getGroups(user, document), groups).length > 0;
};

/**
 * @summary check if a user can perform at least one of the specified actions
 * @param {Object} user
 * @param {String/Array} action or actions
 */
Users.canDo = (user, actionOrActions) => {
  const authorizedActions = Users.getActions(user);
  const actions = Array.isArray(actionOrActions) ? actionOrActions : [actionOrActions];
  return Users.isAdmin(user) || intersection(authorizedActions, actions).length > 0;
};

// DEPRECATED
// TODO: remove this
/**
 * @summary Check if a user can edit a document
 * @param {Object} user - The user performing the action
 * @param {Object} document - The document being edited
 */
// Users.canEdit = function (user, document) {

//   user = (typeof user === 'undefined') ? Meteor.user() : user;

//   // note(apollo): use of `__typename` given by react-apollo
//   //const collectionName = document.getCollectionName();
//   const collectionName = document.__typename ? Utils.getCollectionNameFromTypename(document.__typename) : document.getCollectionName();

//   if (!user || !document) {
//     return false;
//   }

//   if (document.hasOwnProperty('isDeleted') && document.isDeleted) return false;

//   if (Users.owns(user, document)) {
//     // if this is user's document, check if user can edit own documents
//     return Users.canDo(user, `${collectionName}.edit.own`);
//   } else {
//     // if this is not user's document, check if they can edit all documents
//     return Users.canDo(user, `${collectionName}.edit.all`);
//   }

// };

/**
 * @summary Check if a user owns a document
 * @param {Object|string} userOrUserId - The user or their userId
 * @param {Object} document - The document to check (post, comment, user object, etc.)
 */
Users.owns = function(user, document) {
  try {
    if (!!document.userId) {
      // case 1: use userId to check
      return user._id === document.userId;
    } else if (document.user) {
      // case 2: use user._id to check
      return user._id === document.user._id;
    }else {
      // case 3: document is a user, use _id to check
      return user._id === document._id;
    }
  } catch (e) {
    return false; // user not logged in
  }
};

/**
 * @summary Check if a user is an admin
 * @param {Object|string} userOrUserId - The user or their userId
 */
Users.isAdmin = function(userOrUserId) {
  try {
    var user = Users.getUser(userOrUserId);
    return !!user && !!user.isAdmin;
  } catch (e) {
    return false; // user not logged in
  }
};
Users.isAdminById = Users.isAdmin;

export const isAdmin = Users.isAdmin;

/**
 * @summary Check if a user can view a field
 * @param {Object} user - The user performing the action
 * @param {Object} field - The schema of the requested field
 * @param {Object} field - The full document of the collection
 * @returns {Boolean} - true if the user can read the field, false if not
 */
Users.canReadField = function(user, field, document) {
  const canRead = field.canRead || field.viewableBy; //OpenCRUD backwards compatibility
  if (canRead) {
    if (typeof canRead === 'function') {
      // if canRead is a function, execute it with user and document passed. it must return a boolean
      return canRead(user, document);
    } else if (typeof canRead === 'string') {
      // if canRead is just a string, we assume it's the name of a group and pass it to isMemberOf
      return canRead === 'guests' || Users.isMemberOf(user, canRead, document);
    } else if (Array.isArray(canRead) && canRead.length > 0) {
      // if canRead is an array, we do a recursion on every item and return true if one of the items return true
      return canRead.some(group => Users.canReadField(user, { canRead: group }, document));
    }
  }
  return false;
};

/**
 * @summary Get a list of fields viewable by a user
 * @param {Object} user - The user performing the action
 * @param {Object} collection - The collection
 * @param {Object} document - Optionally, get a list for a specific document
 */
Users.getViewableFields = function(user, collection, document) {
  deprecate(
    '1.13.4',
    'getViewableFields is deprecated. Use Users.getReadableProjection to get a Mongo projection, or Users.getReadableFields if you need an array of field.'
  );
  return Users.getReadableProjection(user, collection, document);
};

Users.getReadableFields = function(user, collection, document) {
  return compact(
    map(collection.simpleSchema()._schema, (field, fieldName) => {
      if (fieldName.indexOf('.$') > -1) return null;
      return Users.canReadField(user, field, document) ? fieldName : null;
    })
  );
};

Users.getReadableProjection = function(user, collection, document) {
  return Utils.arrayToFields(Users.getReadableFields(user, collection, document));
};

/**
 * Check if field canRead include a permission that needs to be checked against the actual document and not just from the user
 */
Users.isDocumentBasedPermissionField = field => {
  const canRead = field.canRead || field.viewableBy; //OpenCRUD backwards compatibility
  if (canRead) {
    if (typeof canRead === 'function') {
      return true;
    } else if (canRead === 'owners') {
      return true;
    } else if (Array.isArray(canRead) && canRead.length > 0) {
      // recursive call on if canRead is an array
      return canRead.some(group => Users.isDocumentBasedPermissionField({ canRead: group }));
    }
  }
  return false;
};

/**
 * Retrieve fields that needs the document to be already fetched to be checked, and not just the user
 * => owners permissions, custom permissions etc.
 */
Users.getDocumentBasedPermissionFieldNames = function(collection) {
  const schema = collection.simpleSchema()._schema;
  const documentBasedFieldNames = Object.keys(schema).filter(fieldName => {
    if (fieldName.indexOf('.$') > -1) return false; // ignore arrays
    const field = schema[fieldName];
    if (Users.isDocumentBasedPermissionField(field)) return true;
    return false;
  });
  return documentBasedFieldNames;
};

// collection helper
Users.helpers({
  getViewableFields(collection, document) {
    return Users.getViewableFields(this, collection, document);
  },
});

/**
 * @summary Check if a user can access a list of fields
 * @param {Object} user - The user performing the action
 * @param {Object} collection - The collection
 * @param {Object} fields - The list of fields
 */
Users.checkFields = (user, collection, fields) => {
  const viewableFields = Users.getReadableFields(user, collection);
  // Initial case without document => we ignore fields that need the document to be checked
  const ambiguousFields = Users.getDocumentBasedPermissionFieldNames(collection); // these fields need to wait for the document to be present before being checked
  const fieldsToTest = difference(fields, ambiguousFields); // we only check non-ambiguous fields (canRead: ["guests", "admins"] for instance)
  const diff = difference(fieldsToTest, viewableFields);

  if (diff.length) {
    throw new Error(
      `You don't have permission to filter collection ${collection.options.collectionName} by the following fields: ${diff.join(
        ', '
      )}. Field is not readable or do not exist.`
    );
  }
  return true;
};

/**
 * Check if user was allowed to filter this document based on some fields
 * @param {Object} user - The user performing the action
 * @param {Object} collection - The collection
 * @param {Object} fields - The list of filtered fields
 * @param {Object} document - The retrieved document
 */
Users.canFilterDocument = (user, collection, fields, document) => {
  const viewableFields = Users.getReadableFields(user, collection, document);
  const diff = difference(fields, viewableFields);
  return !diff.length; // if length is > 0, it means that this document wasn't filterable by user in the first place, based on provided filter, we must remove it
};

const restrictDocument = (document, schema, currentUser) => {
  let restrictedDocument = cloneDeep(document);
  forEachDocumentField(document, schema, ({ fieldName, fieldSchema, currentPath, isNested }) => {
    if (isNested && (!fieldSchema || !fieldSchema.canRead)) return; // ignore nested fields without permissions
    if (!fieldSchema || !Users.canReadField(currentUser, fieldSchema, document)) {
      unset(restrictedDocument, `${currentPath}${fieldName}`);
    }
  });
  return restrictedDocument;
};
/**
 * @summary For a given document or list of documents, keep only fields viewable by current user
 * @param {Object} user - The user performing the action
 * @param {Object} collection - The collection
 * @param {Object} document - The document being returned by the resolver
 */
Users.restrictViewableFields = function(user, collection, docOrDocs) {
  if (!docOrDocs) return {};
  const schema = collection.simpleSchema()._schema;
  const restrictDoc = document => restrictDocument(document, schema, user);

  return Array.isArray(docOrDocs) ? docOrDocs.map(restrictDoc) : restrictDoc(docOrDocs);
};

/**
 * @summary For a given of documents, keep only documents and fields viewable by current user (new APIs)
 * @param {Object} user - The user performing the action
 * @param {Object} collection - The collection
 * @param {Object} document - The document being returned by the resolver
 */
Users.restrictDocuments = function({ user, collection, documents }) {
  const check = get(collection, 'options.permissions.canRead');
  let readableDocuments = documents;
  if (check) {
    readableDocuments = documents.filter(document => Users.canRead({ collection, document, user }));
  }
  const restrictedDocuments = Users.restrictViewableFields(user, collection, readableDocuments);
  return restrictedDocuments;
};

/**
 * @summary Check if a user can submit a field
 * @param {Object} user - The user performing the action
 * @param {Object} field - The field being edited or inserted
 */
Users.canCreateField = function(user, field) {
  const canCreate = field.canCreate || field.insertableBy; //OpenCRUD backwards compatibility
  if (canCreate) {
    if (typeof canCreate === 'function') {
      // if canCreate is a function, execute it with user and document passed. it must return a boolean
      return canCreate(user);
    } else if (typeof canCreate === 'string') {
      // if canCreate is just a string, we assume it's the name of a group and pass it to isMemberOf
      // note: if canCreate is 'guests' then anybody can create it
      return canCreate === 'guests' || Users.isMemberOf(user, canCreate);
    } else if (Array.isArray(canCreate) && canCreate.length > 0) {
      // if canCreate is an array, we do a recursion on every item and return true if one of the items return true
      return canCreate.some(group => Users.canCreateField(user, { canCreate: group }));
    }
  }
  return false;
};

/** @function
 * Check if a user can edit a field
 * @param {Object} user - The user performing the action
 * @param {Object} field - The field being edited or inserted
 * @param {Object} document - The document being edited or inserted
 */
Users.canUpdateField = function(user, field, document) {
  const canUpdate = field.canUpdate || field.editableBy; //OpenCRUD backwards compatibility

  if (canUpdate) {
    if (typeof canUpdate === 'function') {
      // if canUpdate is a function, execute it with user and document passed. it must return a boolean
      return canUpdate(user, document);
    } else if (typeof canUpdate === 'string') {
      // if canUpdate is just a string, we assume it's the name of a group and pass it to isMemberOf
      // note: if canUpdate is 'guests' then anybody can create it
      return canUpdate === 'guests' || Users.isMemberOf(user, canUpdate, document);
    } else if (Array.isArray(canUpdate) && canUpdate.length > 0) {
      // if canUpdate is an array, we look at every item and return true if one of the items return true
      return canUpdate.some(group => Users.canUpdateField(user, { canUpdate: group }, document));
    }
  }
  return false;
};

/** @function
 * Check if a user passes a permission check (new API)
 * @param {Object} check - The permission check being tested
 * @param {Object} user - The user performing the action
 * @param {Object} document - The document being edited or inserted
 */
// TODO: functions should take priority over admins status?
Users.permissionCheck = options => {
  const { check, user, document } = options;
  if (Users.isAdmin(user)) {
    // admins always pass all permission checks
    return true;
  } else if (typeof check === 'function') {
    return check(options);
  } else if (Array.isArray(check)) {
    return Users.isMemberOf(user, check, document);
  }
};

Users.canRead = options => {
  const { collectionName, collection = getCollection(collectionName) } = options;
  const check = get(collection, 'options.permissions.canRead');
  if (!check) {
    // eslint-disable-next-line no-console
    console.warn(
      `Users.canRead() was called but no [canRead] permission was defined for collection [${collection.options.collectionName}]`
    );
  }
  return check && Users.permissionCheck({ ...options, check, operationName: 'read' });
};

Users.canCreate = options => {
  const { collectionName, collection = getCollection(collectionName) } = options;
  const check = get(collection, 'options.permissions.canCreate');
  if (!check) {
    // eslint-disable-next-line no-console
    console.warn(
      `Users.canCreate() was called but no [canCreate] permission was defined for collection [${collection.options.collectionName}]`
    );
  }
  return check && Users.permissionCheck({ ...options, check, operationName: 'create' });
};

Users.canUpdate = options => {
  const { collectionName, collection = getCollection(collectionName) } = options;
  const check = get(collection, 'options.permissions.canUpdate');
  if (!check) {
    // eslint-disable-next-line no-console
    console.warn(
      `Users.canUpdate() was called but no [canUpdate] permission was defined for collection [${collection.options.collectionName}]`
    );
  }
  return check && Users.permissionCheck({ ...options, check, operationName: 'update' });
};

Users.canDelete = options => {
  const { collectionName, collection = getCollection(collectionName) } = options;
  const check = get(collection, 'options.permissions.canDelete');
  if (!check) {
    // eslint-disable-next-line no-console
    console.warn(
      `Users.canDelete() was called but no [canDelete] permission was defined for collection [${collection.options.collectionName}]`
    );
  }
  return check && Users.permissionCheck({ ...options, check, operationName: 'delete' });
};

////////////////////
// Initialize     //
////////////////////

/**
 * @summary initialize the 3 out-of-the-box groups
 */
Users.createGroup('guests'); // non-logged-in users
Users.createGroup('members'); // regular users

const membersActions = [
  'user.create',
  'user.update.own',
  // OpenCRUD backwards compatibility
  'users.new',
  'users.edit.own',
  'users.remove.own',
];
Users.groups.members.can(membersActions);

Users.createGroup('admins'); // admin users

const adminActions = [
  'user.create',
  'user.update.all',
  'user.delete.all',
  'setting.update',
  // OpenCRUD backwards compatibility
  'users.new',
  'users.edit.all',
  'users.remove.all',
  'settings.edit',
];
Users.groups.admins.can(adminActions);
