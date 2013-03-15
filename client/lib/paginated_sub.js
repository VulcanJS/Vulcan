PaginatedSubscriptionHandle = function(perPage) {
  this.perPage = perPage;
  this._limit = perPage;
  this._limitListeners = new Deps.Dependency();
  this._loaded = 0;
  this._loadedListeners = new Deps.Dependency();
}

PaginatedSubscriptionHandle.prototype.loaded = function() {
  Deps.depend(this._loadedListeners);
  return this._loaded;
}

PaginatedSubscriptionHandle.prototype.limit = function() {
  Deps.depend(this._limitListeners);
  return this._limit;
}

PaginatedSubscriptionHandle.prototype.loading = function() {
  return this.loaded() < this.limit();
}

PaginatedSubscriptionHandle.prototype.loadNextPage = function() {
  this._limit += this.perPage;
  this._limitListeners.changed();
}

PaginatedSubscriptionHandle.prototype.done = function() {
  console.log('sub done', this._loadedListeners);
  
  // XXX: check if subs that are canceled before they are ready ever fire ready?
  // if they do we need to increase loaded by perPage, not set it to limit
  this._loaded = this._limit;
  this._loadedListeners.changed();
}


paginatedSubscription = function (perPage/*, name, arguments */) {
  var handle = new PaginatedSubscriptionHandle(perPage);
  var args = Array.prototype.slice.call(arguments, 1);
  
  console.log('paginationed Sub setting up', args);
  Meteor.autorun(function() {
    console.log('paginatedSub running', args);
    var subHandle = Meteor.subscribe.apply(this, args.concat([
      handle.limit(), function() { handle.done(); }
    ]));
    handle.stop = subHandle.stop;
  });
  
  return handle;
}