import _merge from 'lodash/merge';
/**
 * Compute the _id or input based on default options of the hooks
 * + dynamic props (for single) or dynamic arguments (for update)
 * @param {*} options 
 * @param {*} argsOrProps 
 */
export const computeQueryVariables = (options, argsOrProps) => {
    const { _id: optionsId, input: optionsInput = {} } = options;
    const { _id: argsId, input: argsInput = {} } = argsOrProps;
    const _id = argsId || optionsId || undefined; // use dynamic _id in priority, default _id otherwise
    const input = !_id ? _merge({}, optionsInput, argsInput) : undefined; // if _id is defined ignore input, else use dynamic input in priority
    return { _id, input };
};