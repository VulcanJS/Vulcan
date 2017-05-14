import gql from 'graphql-tag';

export const Fragments = {}; // will be populated on startup (see vulcan:routing)

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

// get fragment
// note: parentFragmentName is used for debugging purposes only
export const getFragment = (fragmentName, parentFragmentName) => {
  const fragment = Fragments[fragmentName];

  if (!fragment) {
    throw new Error(`Fragment "${fragmentName}" not registered.`)
  }

  // pad the literals array with line returns for each subFragments
  const literals = [fragment.fragmentText, ...fragment.subFragments.map(x => '\n')];
  
  // console.log(`// getFragment: ${parentFragmentName ? parentFragmentName + ' > ' : ''}${fragmentName}`)
  // console.log('fragmentText: ', fragment.fragmentText)
  // console.log('subFragments:', fragment.subFragments)
  // console.log('length:', fragment.subFragments.length)

  // the gql function expects an array of literals as first argument, and then sub-fragments as other arguments
  const gqlArguments = [literals, ...fragment.subFragments.map(f => getFragment(f, fragmentName))];

  return gql.apply(null, gqlArguments);
}