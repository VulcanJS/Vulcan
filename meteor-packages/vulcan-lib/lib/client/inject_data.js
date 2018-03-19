import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson';

// InjectData object
export const InjectData = {
  // data object
  _data: {},

  // encode object to string
  _encode(ejson) {
    const ejsonString = EJSON.stringify(ejson);
    return encodeURIComponent(ejsonString);
  },

  // decode string to object
  _decode(encodedEjson) {
    const decodedEjsonString = decodeURIComponent(encodedEjson);
    if (!decodedEjsonString) return null;
    return EJSON.parse(decodedEjsonString);
  },

  // get data when DOM loaded
  getData(key, callback) {
    Meteor.startup(() => {
      callback(this._data[key]);
    });
  },
};

// when DOM loaded, decode string from <script> and save the data
Meteor.startup(() => {
  const dom = document.querySelector('script[type="text/inject-data"]');
  const injectedDataString = dom ? dom.textContent.trim() : '';
  InjectData._data = InjectData._decode(injectedDataString) || {};
});
