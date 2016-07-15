function addSearchQueryParameter (parameters, terms) {
  if(!!terms.query) {
    var parameters = Telescope.utils.deepExtend(true, parameters, {
      selector: {
        $or: [
          {title: {$regex: terms.query, $options: 'i'}},
          {url: {$regex: terms.query, $options: 'i'}},
          // note: we cannot search the body field because it's not published
          // to the client. If we did, we'd get different result sets on 
          // client and server
          {excerpt: {$regex: terms.query, $options: 'i'}}
        ]
      }
    });
  }
  return parameters;
}
Telescope.callbacks.add("postsParameters", addSearchQueryParameter);