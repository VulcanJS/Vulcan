import gql from 'graphql-tag';

export const Fragments = {};
export const FragmentsExtensions = {}; // will be used on startup

/**
 * @param {*} collectionOrName A collection name, or a whole collection
 */
export const getDefaultFragmentName = (collectionOrName) => {
  const collectionName = typeof collectionOrName === 'string' ? collectionOrName : collectionOrName.options.collectionName;
  return `${collectionName}DefaultFragment`;
};

/*

Get a fragment's name from its text

*/
export const extractFragmentName = fragmentText => fragmentText.match(/fragment (.*) on/)[1];

/*

Get a query resolver's name from its text

*/
export const extractResolverName = resolverText => resolverText.trim().substr(0, resolverText.trim().indexOf('{'));


/*

Register a fragment, including its text, the text of its subfragments, and the fragment object

*/
export const registerFragment = fragmentTextSource => {
  // remove comments
  const fragmentText = fragmentTextSource.replace(/\#.*\n/g, '\n');

  // extract name from fragment text
  const fragmentName = extractFragmentName(fragmentText);

  // extract subFragments from text
  const matchedSubFragments = fragmentText.match(/\.{3}([_A-Za-z][_0-9A-Za-z]*)/g) || [];
  const subFragments = _.unique(matchedSubFragments.map(f => f.replace('...', '')));
  
  // register fragment
  Fragments[fragmentName] = {
    fragmentText
  };

  // also add subfragments if there are any
  if(subFragments && subFragments.length) {
    Fragments[fragmentName].subFragments = subFragments;
  }

};

/*

Create gql fragment object from text and subfragments

*/
export const getFragmentObject = (fragmentText, subFragments) => {
  // pad the literals array with line returns for each subFragments
  const literals = subFragments ? [fragmentText, ...subFragments.map(x => '\n')] : [fragmentText];

  // the gql function expects an array of literals as first argument, and then sub-fragments as other arguments
  const gqlArguments = subFragments ? [literals, ...subFragments.map(subFragmentName => {
    // return subfragment's gql fragment
    if (!Fragments[subFragmentName] || !Fragments[subFragmentName].fragmentObject) {
      throw new Error(`Subfragment “${subFragmentName}” of fragment “${extractFragmentName(fragmentText)}” has not been initialized yet.`);
    }
    return Fragments[subFragmentName].fragmentObject;
  })] : [literals];

  return gql.apply(null, gqlArguments);
};

/*

Create default "dumb" gql fragment object for a given collection

*/
export const getDefaultFragmentText = (collection, options = { onlyViewable: true }) => {
  const schema = collection.simpleSchema()._schema;
  const fieldNames = _.reject(_.keys(schema), fieldName => {
    /*

    Exclude a field from the default fragment if
    1. it has a resolver and addOriginalField is false
    2. it has $ in its name
    3. it's not viewable (if onlyViewable option is true)

    */
    const field = schema[fieldName];
    // OpenCRUD backwards compatibility
    return (field.resolveAs && !field.resolveAs.addOriginalField) || fieldName.includes('$') || fieldName.includes('.') || options.onlyViewable && !(field.canRead || field.viewableBy);
  });

  if (fieldNames.length) {
    const fragmentText = `
      fragment ${collection.options.collectionName}DefaultFragment on ${collection.typeName} {
        ${fieldNames.map(fieldName => {
          return fieldName+'\n';
        }).join('')}
      }
    `;

    return fragmentText;
  } else {
    return null;
  }

};
export const getDefaultFragment = collection => {
  const fragmentText = getDefaultFragmentText(collection);
  return fragmentText ? gql`${fragmentText}` : null;
};
/*

Queue a fragment to be extended with additional properties.

Note: can be used even before the fragment has been registered. 

*/
export const extendFragment = (fragmentName, newProperties) => {
  FragmentsExtensions[fragmentName] = FragmentsExtensions[fragmentName] ? [...FragmentsExtensions[fragmentName], newProperties] : [newProperties];
};

/*

Perform fragment extension (called from initializeFragments()

Note: will call registerFragment again each time, resulting in multiple fragments
with the same name (but duplicate fragments warning is disabled).

*/
export const extendFragmentWithProperties = (fragmentName, newProperties) => {
  const fragment = Fragments[fragmentName];
  const fragmentEndPosition = fragment.fragmentText.lastIndexOf('}');
  const newFragmentText = [
    fragment.fragmentText.slice(0, fragmentEndPosition), 
    newProperties, 
    fragment.fragmentText.slice(fragmentEndPosition)
  ].join('');
  registerFragment(newFragmentText);
};

/*

Remove a property from a fragment

Note: can only be called *after* a fragment is registered

*/
export const removeFromFragment = (fragmentName, propertyName) => {
  const fragment = Fragments[fragmentName];
  const newFragmentText = fragment.fragmentText.replace(propertyName, '');
  registerFragment(newFragmentText);  
};

/*

Get fragment name from fragment object

*/
export const getFragmentName = fragment => fragment && fragment.definitions[0] && fragment.definitions[0].name.value;

/*

Get actual gql fragment

*/
export const getFragment = fragmentName => {
  if (!Fragments[fragmentName]) {
    throw new Error(`Fragment "${fragmentName}" not registered.`);
  }
  if (!Fragments[fragmentName].fragmentObject) {
    initializeFragments([fragmentName]);
  }
  // return fragment object created by gql
  return Fragments[fragmentName].fragmentObject;  
};

/*

Get gql fragment text

*/
export const getFragmentText = fragmentName => {
  if (!Fragments[fragmentName]) {
    throw new Error(`Fragment "${fragmentName}" not registered.`);
  }
  // return fragment object created by gql
  return Fragments[fragmentName].fragmentText;  
};

/*

Get names of non initialized fragments.

*/
export const getNonInitializedFragmentNames = () =>
  _.keys(Fragments).filter(name => !Fragments[name].fragmentObject);

/*

Perform all fragment extensions (called from routing)

*/
export const initializeFragments = (fragments = getNonInitializedFragmentNames()) => {

  const errorFragmentKeys = [];

  // extend fragment texts (if extended fragment exists)
  _.forEach(FragmentsExtensions, (extensions, fragmentName) => {
    if (Fragments[fragmentName]) {
      extensions.forEach(newProperties => {
        extendFragmentWithProperties(fragmentName, newProperties);
      });
    }
  });
  
  // create fragment objects

  // initialize fragments *with no subfragments* first to avoid unresolved dependencies
  const keysWithoutSubFragments = _.filter(fragments, fragmentName => !Fragments[fragmentName].subFragments);
  _.forEach(keysWithoutSubFragments, fragmentName => {
    const fragment = Fragments[fragmentName];
    fragment.fragmentObject = getFragmentObject(fragment.fragmentText, fragment.subFragments);
  });

  // next, initialize fragments that *have* subfragments
  const keysWithSubFragments = _.filter(_.keys(Fragments), fragmentName => !!Fragments[fragmentName].subFragments);
  _.forEach(keysWithSubFragments, fragmentName => {
    const fragment = Fragments[fragmentName];
    try {
      fragment.fragmentObject = getFragmentObject(fragment.fragmentText, fragment.subFragments);
    } catch (error) {
      // if fragment initialization triggers an error, store fragment and try again later
      // common error causes include cross-dependencies
      errorFragmentKeys.push(fragmentName);
    }
  });

  // finally, try initializing any fragment that triggered an error again
  _.forEach(errorFragmentKeys, fragmentName => {
    const fragment = Fragments[fragmentName];
    fragment.fragmentObject = getFragmentObject(fragment.fragmentText, fragment.subFragments);
  });

};