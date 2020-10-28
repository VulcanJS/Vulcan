import { readPermissions } from "../permissions";

const schema = {

  name: {
    label: 'Name',
    type: String,
    canRead: readPermissions,
  },

  value: {
    label: 'Value',
    type: Object,
    canRead: readPermissions,
  },

  defaultValue: {
    label: 'Default Value',
    type: Object,
    canRead: readPermissions,
  },

  isPublic: {
    label: 'Public',
    type: Boolean,
    canRead: readPermissions,
  },

  description: {
    label: 'Description',
    type: String,
    canRead: readPermissions,
  },

};

export default schema;
