export const convertToGraphQL = (fields, indentation) => {
  return fields.length > 0 ? fields.map(f => fieldTemplate(f, indentation)).join('\n') : '';
};

export const arrayToGraphQL = fields => fields.map(f => `${f.name}: ${f.type}`).join(', ');

/*

For backwards-compatibility reasons, args can either be a string or an array of objects

*/
export const getArguments = args => {
  if (Array.isArray(args) && args.length > 0) {
    return `(${arrayToGraphQL(args)})`;
  } else if (typeof args === 'string') {
    return `(${args})`;
  } else {
    return '';
  }
};

/* ------------------------------------- Generic Field Template ------------------------------------- */

// export const fieldTemplate = ({ name, type, args, directive, description, required }, indentation = '') =>
// `${description ?  `${indentation}# ${description}\n` : ''}${indentation}${name}${getArguments(args)}: ${type}${required ? '!' : ''} ${directive ? directive : ''}`;

// version that does not make any fields required
export const fieldTemplate = ({ name, type, args, directive, description, required }, indentation = '') =>
  `${description ? `${indentation}# ${description}\n` : ''}${indentation}${name}${getArguments(args)}: ${type} ${
    directive ? directive : ''
  }`;

/* ------------------------------------- Main Type ------------------------------------- */

/*

The main type

type Movie{
  _id: String
  title: String
  description: String
  createdAt: Date
}

*/
export const mainTypeTemplate = ({ typeName, description, interfaces, fields }) =>
  `${description ? `# ${description}` : ''}
type ${typeName} ${interfaces.length ? `implements ${interfaces.join(' & ')} ` : ''}{
${convertToGraphQL(fields, '  ')}
}
`;
