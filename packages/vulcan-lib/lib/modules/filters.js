import { Utils } from './utils.js';

// Define filters
const defaultFilters = [
	{
		name: '',
		type: 'String',
		selector: (fieldName, value) => ({ $eq: value }),
		fc: (a, b) => a == b,
	},
	{
		name: '_not',
		type: 'String',
		selector: (fieldName, value) => ({ $ne: value }),
		fc: (a, b) => a != b,
	},
	{
		name: '_in',
		type: '[String!]',
		selector: (fieldName, value) => ({ $in: value }),
		fc: (a, b) => b.includes(a),
	},
	{
		name: '_not_in',
		type: '[String!]',
		selector: (fieldName, value) => ({ $nin: value }),
		fc: (a, b) => !b.includes(a),
	},
];
const stringFilters = [
	...defaultFilters,
	{
		name: '_contains',
		type: 'String',
		selector: (fieldName, value) => new RegExp(value),
		fc: (a, b) => a.includes(b),
	},
	{
		name: '_not_contains',
		type: 'String',
		selector: (fieldName, value) => new RegExp(`/^((?!${value}).)*$/s`), // Needs something more efficient
		fc: (a, b) => !a.includes(b),
	},
];

const allFilters = [...defaultFilters, ...stringFilters];

// split _id_not_contains to { fieldName: '_id', filterName: '_not_contains'}
const splitFieldFilter = field => {
	let index,
		_prefixed = 0,
		test = field;
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
	return { fieldName, filterName };
};

// -----------------------------------------------
// Queries

// Build Mongo selector from a filterUnit
const resolver = (val, key, filter) => {
	if (key === 'OR') {
		return { key: '$or', value: val.map(getSelectorFromFilter) };
	}
	if (key === 'AND') {
		return { key: '$and', value: val.map(getSelectorFromFilter) };
	}
	const { fieldName, filterName } = splitFieldFilter(key);
	const filterSelector = allFilters.filter(filter => filterName === filter.name)[0].selector(fieldName, val);
	return { key: fieldName, value: filterSelector };
};

// Build Mongo selector filter
export const getSelectorFromFilter = obj => {
	if (!obj) return {};
	var keys = Object.keys(obj),
		length = keys.length,
		results = {};
	for (var index = 0; index < length; index++) {
		var currentKey = keys[index];
		const { key, value } = resolver(obj[currentKey], currentKey, obj);
		results = Utils.deepExtend(true, results, { [key]: value });
	}
	return results;
};

export const getOptionParameter = orderBy => {
	if (!orderBy) return {};
	const { fieldName, filterName } = splitFieldFilter(orderBy);
	return {
		sort: {
			[fieldName]: filterName === '_ASC' ? 1 : -1,
		},
	};
};
// -----------------------------------------------
// Subscriptions

// Check if filter.node.field match it's corresponding payload field
const checkField = (payloadNode, filterNode) => field => {
	const { fieldName, filterName } = splitFieldFilter(field);
	const filter = allFilters.filter(filter => filter.name === filterName)[0];
	return filter.fc(payloadNode[fieldName], filterNode[field]);
};

// Check if filter.node match the payload node
const nodeFilter = (payloadNode, filterNode) => {
	const filterFields = Object.keys(filterNode);
	const payloadFields = Object.keys(payloadNode);
	const fieldsMatch = filterFields.map(checkField(payloadNode, filterNode)).reduce((a, i) => (i ? a : false), true);
	return fieldsMatch;
};

// Check if filter.mutation_in match the payload mutation
const mutationFilter = (payload, mutation_in) => {
	return mutation_in.includes(payload.mutation);
};

// OR Recursive check
const orFilter = (payload, filters) => {
	const temp = filters.map(filter => {
		return matchFilter(payload, filter);
	});
	return temp.reduce((a, i) => (i ? true : a), false);
};

// AND Recursive check
const andFilter = (payload, filters) => {
	const temp = filters.map(filter => {
		return matchFilter(payload, filter);
	});
	return temp.reduce((a, i) => (i ? a : false), true);
};

// Check if all filters conditions are fulfilled by the payload
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

// Return the right array of filters for a given field
const switchTypes = (fieldName, fieldType) => {
	switch (fieldType) {
		case 'String':
			return [...defaultFilters, ...stringFilters].map(filter => fieldName + filter.name + ': ' + filter.type);
		default:
			return null;
	}
};

// export Object containing functions for creating field filters
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
	},
};

// Returns the graphQLSchema augmented with filtering inputs and types
export const addFiltersToSchema = (graphQLSchema, collectionName, filterSchema) => {
	// Define collection filter input
	const fooFilter = `
    input ${collectionName}Filter {
        AND: [${collectionName}Filter!]
        OR: [${collectionName}Filter!]
        ${filterSchema.length ? filterSchema.join('\n  ') : '_blank: Boolean'}
    }
    `;

	// Define collection filter input for subscriptions
	const fooSubscriptionFilterNode = `
    input ${collectionName}SubscriptionFilter {
        AND: [${collectionName}SubscriptionFilter!]
        OR: [${collectionName}SubscriptionFilter!]
        mutation_in: [_ModelMutationType!]
        node: ${collectionName}SubscriptionFilterNode
    }
    `;

	// Define collection node filter input for subscriptions
	const fooSubscriptionFilter = `
    input ${collectionName}SubscriptionFilterNode {
        ${filterSchema.length ? filterSchema.join('\n  ') : '_blank: Boolean'}
    }
    `;

	// Define collection filter payload for subscriptions
	const fooSubscriptionPayload = `
    type ${collectionName}SubscriptionPayload {
        mutation: _ModelMutationType!
        node: ${collectionName}
    }
    `;
	return graphQLSchema.concat(fooFilter, fooSubscriptionFilterNode, fooSubscriptionFilter, fooSubscriptionPayload);
};

// Returns the graphQLSchema augmented with ordering enum
export const addOrderToSchema = (graphQLSchema, collectionName, orderSchema) => {
	// Define collection ordering enum
	const fooOrderBy = `
    enum ${collectionName}OrderBy {
        ${orderSchema.length ? orderSchema.join('\n  ') : '_blank: Boolean'}
    }
    `;
	return graphQLSchema.concat(fooOrderBy);
};
