// @see https://www.apollographql.com/docs/apollo-server/data/file-uploads/
const { GraphQLUpload } = require('graphql-upload');
import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';

export const defaultResolvers = {
  JSON: GraphQLJSON,
  Date: GraphQLDate,
  // This maps the `Upload` scalar to the implementation provided
  // by the `graphql-upload` package.
  Upload: GraphQLUpload,
  // TODO: is this actually needed?
  /*
  Mutation: {
    singleUpload: async (parent, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;

      // Invoking the `createReadStream` will return a Readable Stream.
      // See https://nodejs.org/api/stream.html#stream_readable_streams
      const stream = createReadStream();

      // This is purely for demonstration purposes and will overwrite the
      // local-file-output.txt in the current working directory on EACH upload.
      const out = require('fs').createWriteStream('local-file-output.txt');
      stream.pipe(out);
      await finished(out);

      return { filename, mimetype, encoding };
    },
  },
  */
};
