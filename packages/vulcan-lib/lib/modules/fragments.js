import gql from 'graphql-tag';

export const Fragments = {};
export const FragmentsExtensions = {}; // will be used on startup

/*

Get a fragment's name from its text

*/
export const extractFragmentName = fragmentText => fragmentText.match(/fragment (.*) on/)[1];

/*

Register a fragment, including its text, the text of its subfragments, and the fragment object

*/
export const registerFragment = fragmentText => {
  // remove comments
  const fragmentText = fragmentTextSource.replace(/\#.*\n/g, '\n');

  // extract name from fragment text
  const fragmentName = extractFragmentName(fragmentText);
  
  // extract subFragments from text
  const matchedSubFragments = fragmentText.match(/\.{3}([_A-Za-z][_0-9A-Za-z]*)/g) || [];
  const subFragments = _.unique(matchedSubFragments.map(f => f.replace('...', '')));
  
  // register fragment
  Fragments[fragmentName] = {
    fragmentText,
    subFragments,
    fragmentObject: getFragmentObject(fragmentText, subFragments)
  }
};

/*

Create gql fragment object from text and subfragments

*/
export const getFragmentObject = (fragmentText, subFragments) => {

  // pad the literals array with line returns for each subFragments
  const literals = [fragmentText, ...subFragments.map(x => '\n')];

  // the gql function expects an array of literals as first argument, and then sub-fragments as other arguments
  const gqlArguments = [literals, ...subFragments.map(subFragmentName => {
    // return subfragment's gql fragment
    return Fragments[subFragmentName].fragmentObject;
  })];

  return gql.apply(null, gqlArguments);
}

/*

Create default "dumb" gql fragment object for a given collection

*/
export const getDefaultFragmentText = (collection, options = { onlyViewable: true }) => {
  const schema = collection.simpleSchema()._schema;
  const fieldNames = _.reject(_.keys(schema), fieldName => {
    /*

    Exclude a field from the default fragment if
    1. it has a resolver
    2. it has $ in its name
    3. it's not viewable (if onlyViewable option is true)

    */
    const field = schema[fieldName];
    return field.resolveAs || fieldName.indexOf('$') !== -1 || options.onlyViewable && !field.viewableBy
  });

  const fragmentText = `
    fragment ${collection.options.collectionName}DefaultFragment on ${collection.typeName} {
      ${fieldNames.map(fieldName => {
        return fieldName+'\n'
      }).join('')}
    }
  `;

  return fragmentText;

}
export const getDefaultFragment = collection => {
  return gql`${getDefaultFragmentText(collection)}`;
}
/*

Queue a fragment to be extended with additional properties.

Note: can be used even before the fragment has been registered. 

*/
export const extendFragment = (fragmentName, newProperties) => {
  FragmentsExtensions[fragmentName] = FragmentsExtensions[fragmentName] ? [...FragmentsExtensions[fragmentName], newProperties] : [newProperties];
}

/*

Perform fragment extension (called from initializeFragments()

Note: will call registerFragment again each time, resulting in multiple fragments
with the same name (but duplicate fragments warning is disabled).

*/
export const extendFragmentWithProperties = (fragmentName, newProperties) => {
  const fragment = Fragments[fragmentName];
  const fragmentEndPosition = fragment.fragmentText.lastIndexOf('}');
  const newFragmentText =[fragment.fragmentText.slice(0, fragmentEndPosition), newProperties, fragment.fragmentText.slice(fragmentEndPosition)].join('');
  registerFragment(newFragmentText);
}

/*

Remove a property from a fragment

Note: can only be called *after* a fragment is registered

*/
export const removeFromFragment = (fragmentName, propertyName) => {
  const fragment = Fragments[fragmentName];
  const newFragmentText = fragment.fragmentText.replace(propertyName, '');
  registerFragment(newFragmentText);  
}

/*

Get fragment name from fragment object

*/
export const getFragmentName = fragment => fragment && fragment.definitions[0] && fragment.definitions[0].name.value;

/*

Get actual gql fragment

*/
export const getFragment = fragmentName => {
  if (!Fragments[fragmentName]) {
    throw new Error(`Fragment "${fragmentName}" not registered.`)
  }
  // return fragment object created by gql
  return Fragments[fragmentName].fragmentObject;  
}

/*

Get gql fragment text

*/
export const getFragmentText = fragmentName => {
  if (!Fragments[fragmentName]) {
    throw new Error(`Fragment "${fragmentName}" not registered.`)
  }
  // return fragment object created by gql
  return Fragments[fragmentName].fragmentText;  
}

/*

Perform all fragment extensions (called from routing)

*/
export const initializeFragments = () => {
  // extend fragment text if fragment exists
  _.forEach(FragmentsExtensions, (extensions, fragmentName) => {
    if (Fragments[fragmentName]) {
      extensions.forEach(newProperties => {
        extendFragmentWithProperties(fragmentName, newProperties);
      });
    }
  });
}