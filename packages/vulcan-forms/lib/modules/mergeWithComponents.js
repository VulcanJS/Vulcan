/**
 * Data structure to mix global Components and local FormComponents
 * without the need to merge
 */
import { Components } from 'meteor/vulcan:core';

// Example with Proxy (might be unstable/hard to reason about)
//const mergeWithComponents = (myComponents = {}) => {
//  const handler = {
//    get: function(target, name) {
//      return name in target ? target[name] : Components[name];
//    }
//  };
//  const proxy = new Proxy(myComponents, handler);
//  return proxy;
//};
const mergeWithComponents = myComponents => (myComponents ? { ...Components, ...myComponents } : Components);

export default mergeWithComponents;
