PaginatedSubscriptionHandle = function(perPage) {
  this.perPage = perPage;
  this._limit = perPage;
  this._limitListeners = new Meteor.deps._ContextSet();
  this._loaded = 0;
  this._loadedListeners = new Meteor.deps._ContextSet();
}

PaginatedSubscriptionHandle.prototype.loaded = function() {
  this._loadedListeners.addCurrentContext();
  return this._loaded;
}

PaginatedSubscriptionHandle.prototype.limit = function() {
  this._limitListeners.addCurrentContext();
  return this._limit;
}

PaginatedSubscriptionHandle.prototype.loading = function() {
  return this.loaded() < this.limit();
}

PaginatedSubscriptionHandle.prototype.loadNextPage = function() {
  this._limit += this.perPage;
  this._limitListeners.invalidateAll();
}

PaginatedSubscriptionHandle.prototype.done = function() {
  // XXX: check if subs that are canceled before they are ready ever fire ready?
  // if they do we need to increase loaded by perPage, not set it to limit
  this._loaded = this._limit;
  this._loadedListeners.invalidateAll();
}


paginatedSubscription = function (perPage/*, name, arguments */) {
  var handle = new PaginatedSubscriptionHandle(perPage);
  var args = Array.prototype.slice.call(arguments, 1);
  
  Meteor.autosubscribe(function() {
    var subHandle = Meteor.subscribe.apply(this, args.concat([
      handle.limit(), function() { handle.done(); }
    ]));
    handle.stop = subHandle.stop;
  });
  
  return handle;
}