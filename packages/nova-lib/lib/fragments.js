export const Fragments = {}; // will be populated on startup (see nova:routing)

export const registerFragment = (fragment, name) => {
  // console.log('// registerFragment:', name || getFragmentName(fragment))
  Fragments[name || getFragmentName(fragment)] = fragment;
};

export const getFragmentName = fragment => fragment && fragment.definitions[0] && fragment.definitions[0].name.value;

export const getFragment = name => {
  // console.log('// getFragment: ', name)
  return Fragments[name];
}