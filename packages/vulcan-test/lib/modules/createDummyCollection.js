import SimpleSchema from 'simpl-schema';
// return a collection object for unit testing
const createDummyCollection = ({
    collectionName = 'Dummies',
    typeName = 'Dummy',
    mutations,
    resolvers,
    options = {
        permissions: {
            canRead: ['admins', 'members', 'guests'],
            canUpdate: ['members', 'admins'],
            canCreate: ['members', 'admins'],
            canDelete: ['members', 'admins']
        }
    },
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
        typeName,
        options: { collectionName, typeName, mutations, resolvers, ...options },
        simpleSchema: () => new SimpleSchema(schema),
        find: () => ({
            fetch: () => results.find,
            count: () => results.length
        }),
        findOne: () => results.findOne,
        loader: {
            load: () => results.load,
            prime: () => { }
        },
        remove: () => 1,
        ...otherFields
    };
    return Dummies;
};
export default createDummyCollection;