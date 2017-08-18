const defaultFilters = [
	{
		name: '',
		type: 'String',
		fc: (a, b) => a == b
	},
	{
		name: '_not',
		type: 'String',
		fc: (a, b) => a != b
	},
	{
		name: '_in',
		type: '[String!]',
		fc: (a, b) => b.includes(a)
	},
	{
		name: '_not_in',
		type: '[String!]',
		fc: (a, b) => !b.includes(a)
	}
];
const stringFilters = [
	...defaultFilters,
	{
		name: '_contains',
		type: 'String',
		fc: (a, b) => a.includes(b)
	},
	{
		name: '_not_contains',
		type: 'String',
		fc: (a, b) => !a.includes(b)
	}
];

const allFilters = [...defaultFilters, ...stringFilters];

const checkField = (payloadNode, filterNode) => field => {
    let index,_prefixed=0,test=field;
    // if field starts with _ then slice _ out for testing
	if (test.indexOf('_') === 0) {
        test = test.slice(1);
        _prefixed = 1;
    }
    // check _ in field
    if (test.indexOf('_') === -1) {
		index = test.length + _prefixed;
	} else {
		index = test.indexOf('_') + _prefixed;
	}
	const fieldName = field.slice(0, index);
	const filterName = field.slice(index);
	const filter = allFilters.filter(filter => filter.name === filterName)[0];
	return filter.fc(payloadNode[fieldName], filterNode[field]);
};

const nodeFilter = (payloadNode, filterNode) => {
	const filterFields = Object.keys(filterNode);
	const payloadFields = Object.keys(payloadNode);
	const fieldsMatch = filterFields.map(checkField(payloadNode, filterNode)).reduce((a, i) => (i ? a : false), true);
	return fieldsMatch;
};

const mutationFilter = (payload, mutation_in) => {
	return mutation_in.includes(payload.mutation);
};
const orFilter = (payload, filters) => {
	const temp = filters.map(filter => {
		return matchFilter(payload, filter);
	});
	return temp.reduce((a, i) => (i ? true : a), false);
};
const andFilter = (payload, filters) => {
	const temp = filters.map(filter => {
		return matchFilter(payload, filter);
	});
	return temp.reduce((a, i) => (i ? a : false), true);
};

export const matchFilter = (payload, filter) => {
	let ret = true;
	if (filter.OR && !orFilter(payload, filter.OR)) {
		ret = false;
	}
	if (filter.AND && !andFilter(payload, filter.AND)) {
		ret = false;
	}
	if (filter.mutation_in && !mutationFilter(payload, filter.mutation_in)) {
		ret = false;
	}
	if (filter.node && !nodeFilter(payload.node, filter.node)) {
		ret = false;
	}

	return ret;
};

const switchTypes = (fieldName, fieldType) => {
	switch (fieldType) {
		case 'String':
			return [...defaultFilters, ...stringFilters].map(filter => fieldName + filter.name + ': ' + filter.type);
		default:
			return null;
	}
};

export const getFieldFilters = {
	resolveAsIsString: s => {
		return null;
	},
	resolveAsIsObject: resolveAs => {
		return null;
	},
	field: (fieldName, fieldType) => {
		const fieldFilters = switchTypes(fieldName, fieldType);
		if (!fieldFilters) return null;
		return fieldFilters.length ? fieldFilters.join('\n  ') : fieldFilters;
	}
};

export const addFiltersToSchema = (graphQLSchema, collectionName, filterSchema) => {
	const fooFilter = `
    input ${collectionName}Filter {
        AND: [${collectionName}Filter!]
        OR: [${collectionName}Filter!]
        ${filterSchema.length ? filterSchema.join('\n  ') : '_blank: Boolean'}
    }
    `;
	const fooSubscriptionFilterNode = `
    input ${collectionName}SubscriptionFilter {
        AND: [${collectionName}SubscriptionFilter!]
        OR: [${collectionName}SubscriptionFilter!]
        mutation_in: [_ModelMutationType!]
        node: ${collectionName}SubscriptionFilterNode
    }
    `;
	const fooSubscriptionFilter = `
    input ${collectionName}SubscriptionFilterNode {
        ${filterSchema.length ? filterSchema.join('\n  ') : '_blank: Boolean'}
    }
    `;
	const fooSubscriptionPayload = `
    type ${collectionName}SubscriptionPayload {
        mutation: _ModelMutationType!
        node: ${collectionName}
    }
    `;
	return graphQLSchema.concat(fooFilter, fooSubscriptionFilterNode, fooSubscriptionFilter, fooSubscriptionPayload);
};
