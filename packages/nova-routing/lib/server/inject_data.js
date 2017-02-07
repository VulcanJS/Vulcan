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

  pushData(res, key, value) {
    if (!res._injectPayload) {
      res._injectPayload = {};
    }

    res._injectPayload[key] = value;

    // if cors headers included if may cause some security holes
    // so we simply turn off injecting if we detect an cors header
    // read more: http://goo.gl/eGwb4e
    if (res._headers && res._headers['access-control-allow-origin']) {
      const warnMessage =
        'warn: injecting data turned off due to CORS headers. ' +
        'read more: http://goo.gl/eGwb4e';
      console.warn(warnMessage); // eslint-disable-line no-console
      return;
    }

    // inject data
    const data = this._encode(res._injectPayload);
    res._injectHtml = `<script type="text/inject-data">${data}</script>`;
  },

  getData(res, key) {
    if (res._injectPayload) {
      // same as _.clone(res._injectPayload[key]);
      const data = res._injectPayload[key];
      const clonedData = EJSON.parse(EJSON.stringify(data));
      return clonedData;
    }
    return null;
  },
};
