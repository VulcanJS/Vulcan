import { Picker } from 'meteor/meteorhacks:picker';
import { servePostsApi } from './api.js';

// for backwards compatibility's sake, accept a "limit" segment
Picker.route('/api/:limit?', function(params, req, res, next) {
  if (typeof params.limit !== "undefined") {
    params.query.limit = params.limit;
  }
  res.end(servePostsApi(params.query));
});
