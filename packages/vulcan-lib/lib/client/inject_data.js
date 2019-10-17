import { EJSON } from 'meteor/ejson';
import { onPageLoad } from 'meteor/server-render';

// InjectData object
export const InjectData = {
  // data object
  _data: {},
  _ready: false,

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

  _checkReady() {
    if (!this._ready) {
      const dom = document.querySelector('script[type="text/inject-data"]');
      const injectedDataString = dom ? dom.textContent.trim() : '';
      this._data = InjectData._decode(injectedDataString) || {};
      this._ready = true;
    }
  },
  // sync version
  // Must always be called inside an onPageLoad callback
  getDataSync(key) {
    this._checkReady();
    return this._data[key];
  },

  // get data when DOM loaded
  getData(key, callback) {
    // promisified version
    if (!callback) {
      return new Promise((resolve, reject) => {
        onPageLoad(() => {
          this._checkReady();
          resolve(this._data[key]);
        });
      });
    }
    onPageLoad(() => {
      this._checkReady();
      callback(this._data[key]);
    });
  },
};