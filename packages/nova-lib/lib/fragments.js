import gql from 'graphql-tag';

export const Fragments = {}; // will be populated on startup (see nova:routing)

export const registerFragment = fragmentText => {
  // extract name from fragment text
  const fragmentName = fragmentText.match(/fragment (.*) on/)[1];
  // extract subFragments from text
  const matchedSubFragments = fragmentText.match(/\.\.\.(.*)/g) || [];
  const subFragments = _.unique(matchedSubFragments.map(f => f.replace('...', '')));
  
  console.log('// registerFragment: ', fragmentName, subFragments)
  // console.log(fragmentText)

  // register fragment
  Fragments[fragmentName] = {
    fragmentText,
    subFragments
  }
};

export const getFragmentName = fragment => fragment && fragment.definitions[0] && fragment.definitions[0].name.value;

export const getFragment = name => {
  const fragment = Fragments[name];
  const literals = [fragment.fragmentText];
  // the gql function expects an array of literals as first argument, and then sub-fragments as other arguments
  const gqlArguments = fragment.subFragments ? [literals] : [literals, ...fragment.subFragments.map(getFragment)]
  
  console.log('// getFragment: ', name)
  // console.log('fragmentText: ', fragment.fragmentText)
  // console.log('subFragments:', fragment.subFragments)
  console.log(gqlArguments)
  
  return gql.apply(null, gqlArguments);
}