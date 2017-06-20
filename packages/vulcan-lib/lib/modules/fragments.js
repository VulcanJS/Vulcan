import gql from 'graphql-tag';

export const Fragments = {}; // will be populated on startup (see vulcan:routing)

export const FragmentsExtensions = {}; // will be used on startup

export const registerFragment = fragmentText => {

  // extract name from fragment text
  const fragmentName = fragmentText.match(/fragment (.*) on/)[1];
  
  // extract subFragments from text
  const matchedSubFragments = fragmentText.match(/\.\.\.(.*)/g) || [];
  const subFragments = _.unique(matchedSubFragments.map(f => f.replace('...', '')));
  
  // console.log('// registerFragment: ', fragmentName, subFragments)

  // register fragment
  Fragments[fragmentName] = {
    fragmentText,
    subFragments
  }
};

// extend a fragment with additional properties
export const extendFragment = (fragmentName, newProperties) => {
  FragmentsExtensions[fragmentName] = newProperties;
}

// perform fragment extension
export const extendFragmentWithProperties = (fragmentName, newProperties) => {
  const fragment = Fragments[fragmentName];
  const fragmentEndPosition = fragment.fragmentText.lastIndexOf('}');
  const newFragmentText =[fragment.fragmentText.slice(0, fragmentEndPosition), newProperties, fragment.fragmentText.slice(fragmentEndPosition)].join('');
  registerFragment(newFragmentText);
}

// remove a property from a fragment
export const removeFromFragment = (fragmentName, propertyName) => {
  const fragment = Fragments[fragmentName];
  const newFragmentText = fragment.fragmentText.replace(propertyName, '');
  registerFragment(newFragmentText);  
}

// get fragment name from fragment object
export const getFragmentName = fragment => fragment && fragment.definitions[0] && fragment.definitions[0].name.value;

// get actual gql fragment
export const getFragment = fragmentName => {

  // get entire fragment as stored
  const fragment = Fragments[fragmentName];

  if (!fragment) {
    throw new Error(`Fragment "${fragmentName}" not registered.`)
  }
  if (!fragment.fragmentObject) {
    console.log('// !fragment.fragmentObject: '+fragmentName)
    initializeFragment(fragmentName);
    // throw new Error(`Fragment "${fragmentName}" not initialized.`)
  }

  // return fragment object created by gql
  return fragment.fragmentObject;  
}

// create gql fragment from fragment name, text, and subfragments
export const initializeFragment = (fragmentName) => {

  const fragmentItem = Fragments[fragmentName];

  // pad the literals array with line returns for each subFragments
  const literals = [fragmentItem.fragmentText, ...fragmentItem.subFragments.map(x => '\n')];

  // the gql function expects an array of literals as first argument, and then sub-fragments as other arguments
  const gqlArguments = [literals, ...fragmentItem.subFragments.map(subFragmentName => {
    // if subfragment hasn't been initialized yet, do it now
    if (!(Fragments[subFragmentName] && Fragments[subFragmentName].fragmentObject)) {
      initializeFragment(subFragmentName);
    }
    // return subfragment's gql fragment
    return Fragments[subFragmentName].fragmentObject;
  })];

  fragmentItem.fragmentObject = gql.apply(null, gqlArguments);
}

export const initializeFragments = () => {
  // extend fragment text
  _.forEach(FragmentsExtensions, (newProperties, fragmentName) => {
    extendFragmentWithProperties(fragmentName, newProperties);
  });
  // initialize fragments to create gql fragment object
  _.forEach(Fragments, (fragmentItem, fragmentName) => {
    initializeFragment(fragmentName);
  })
}