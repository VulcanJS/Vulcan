import Events from './collection.js';
import './helpers';
import './callbacks.js';

// note: do we still need that?
Events.log = function (event) {

  // if event is supposed to be unique, check if it has already been logged
  if (!!event.unique && !!Events.findOne({name: event.name})) {
    return;
  }

  event.createdAt = new Date();

  Events.insert(event);

};

export default Events;
