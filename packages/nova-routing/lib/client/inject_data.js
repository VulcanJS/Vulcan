import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson';

export const InjectData = {
  _data: {},

  _encode(ejson) {
    const ejsonString = EJSON.stringify(ejson);
    return encodeURIComponent(ejsonString);
  },

  _decode(encodedEjson) {
    const decodedEjsonString = decodeURIComponent(encodedEjson);
    if (!decodedEjsonString) return null;
    return EJSON.parse(decodedEjsonString);
  },

  getData(key, callback) {
    Meteor.startup(() => {
      callback(this._data[key]);
    });
  },
};

Meteor.startup(() => {
  const dom = document.querySelector('script[type="text/inject-data"]');
  const injectedDataString = dom ? dom.textContent.trim() : '';
  InjectData._data = InjectData._decode(injectedDataString) || {};
});
