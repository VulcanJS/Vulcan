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
  // XXX: check if subs that are canceled before they are ready ever fire ready?
  // if they do we need to increase loaded by perPage, not set it to limit
  this._loaded = this._limit;
  this._loadedListeners.changed();
}


// XXX: somehow? support the last argument being a callback for ready?
paginatedSubscription = function (perPage/*, name, arguments */) {
  var handle = new PaginatedSubscriptionHandle(perPage);
  var args = Array.prototype.slice.call(arguments, 1);
  
  Meteor.autorun(function() {
    var ourArgs = _.map(args, function(arg) {
      return _.isFunction(arg) ? arg() : arg;
    });
    
    var subHandle = Meteor.subscribe.apply(this, ourArgs.concat([
      handle.limit(), function() { handle.done(); }
    ]));
    handle.stop = subHandle.stop;
  });
  
  return handle;
}