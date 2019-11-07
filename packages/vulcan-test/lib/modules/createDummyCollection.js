import SimpleSchema from 'simpl-schema';
// return a collection object for unit testing
const createDummyCollection = ({
    collectionName = 'Dummies',
    mutations,
    resolvers,
    options = {},
    schema = {
        _id: {
            type: String, canRead: ['admins']
        }
    },
    // results to various calls
    results = {
        find: [],
        findOne: null,
        load: null
    },
    ...otherFields
}) => {
    const Dummies = {
        options: { collectionName, mutations, resolvers, ...options },
        simpleSchema: () => new SimpleSchema(schema),
        find: () => ({
            fetch: () => results.find,
            count: () => results.length
        }),
        loader: {
            load: () => results.load,
            prime: () => { }
        },
        ...otherFields
    };
    return Dummies;
};
export default createDummyCollection;