import { readPermissions } from "../permissions";

const schema = {

  name: {
    type: String,
    canRead: readPermissions,
  },

  template: {
    type: String,
    canRead: readPermissions,
  },

  subject: {
    type: String,
    canRead: readPermissions,
  },

  testPath: {
    type: String,
    canRead: readPermissions,
  },

};

export default schema;
