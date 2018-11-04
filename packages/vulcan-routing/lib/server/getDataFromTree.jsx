// From apollo-client 2.0, compiled from TypeScript and then lightly edited to
// fix the imports. Placed here as a horrible hack to work around the fact that,
// being stuck on Apollo 1.x, the getDataFromTree implementation in
// apollo-client has fallen behind on changes to the React API.
import React from "react";

function getProps(element) {
    return element.props || element.attributes;
}
function isReactElement(element) {
    return !!element.type;
}
function isComponentClass(Comp) {
    return Comp.prototype && (Comp.prototype.render || Comp.prototype.isReactComponent);
}
function providesChildContext(instance) {
    return !!instance.getChildContext;
}
// Recurse a React Element tree, running visitor on each element.
// If visitor returns `false`, don't call the element's render function
// or recurse into its child elements.
function walkTree(element, context, visitor) {
    if (Array.isArray(element)) {
        element.forEach(function (item) { return walkTree(item, context, visitor); });
        return;
    }
    if (!element) {
        return;
    }
    // A stateless functional component or a class
    if (isReactElement(element)) {
        var child = void 0;
        if (typeof element.type === 'function') {
            var Comp = element.type;
            var props = Object.assign({}, Comp.defaultProps, getProps(element));
            var childContext_1 = context;
            // Are we are a react class?
            if (isComponentClass(Comp)) {
                var instance_1 = new Comp(props, context);
                // In case the user doesn't pass these to super in the constructor.
                // Note: `Component.props` are now readonly in `@types/react`, so
                // we're using `defineProperty` as a workaround (for now).
                Object.defineProperty(instance_1, 'props', {
                    value: instance_1.props || props
                });
                instance_1.context = instance_1.context || context;
                // Set the instance state to null (not undefined) if not set, to match React behaviour
                instance_1.state = instance_1.state || null;
                // Override setState to just change the state, not queue up an update
                // (we can't do the default React thing as we aren't mounted
                // "properly", however we don't need to re-render as we only support
                // setState in componentWillMount, which happens *before* render).
                instance_1.setState = function (newState) {
                    if (typeof newState === 'function') {
                        // React's TS type definitions don't contain context as a third parameter for
                        // setState's updater function.
                        // Remove this cast to `any` when that is fixed.
                        newState = newState(instance_1.state, instance_1.props, instance_1.context);
                    }
                    instance_1.state = Object.assign({}, instance_1.state, newState);
                };
                if (Comp.getDerivedStateFromProps) {
                    var result = Comp.getDerivedStateFromProps(instance_1.props, instance_1.state);
                    if (result !== null) {
                        instance_1.state = Object.assign({}, instance_1.state, result);
                    }
                }
                else if (instance_1.UNSAFE_componentWillMount) {
                    // eslint-disable-next-line babel/new-cap
                    instance_1.UNSAFE_componentWillMount();
                }
                else if (instance_1.componentWillMount) {
                    instance_1.componentWillMount();
                }
                if (providesChildContext(instance_1)) {
                    childContext_1 = Object.assign({}, context, instance_1.getChildContext());
                }
                if (visitor(element, instance_1, context, childContext_1) === false) {
                    return;
                }
                child = instance_1.render();
            }
            else {
                // Just a stateless functional
                if (visitor(element, null, context) === false) {
                    return;
                }
                // eslint-disable-next-line babel/new-cap
                child = Comp(props, context);
            }
            if (child) {
                if (Array.isArray(child)) {
                    child.forEach(function (item) { return walkTree(item, childContext_1, visitor); });
                }
                else {
                    walkTree(child, childContext_1, visitor);
                }
            }
        }
        else if (element.type._context || element.type.Consumer) {
            // A React context provider or consumer
            if (visitor(element, null, context) === false) {
                return;
            }
            if (element.type._context) {
                // A provider - sets the context value before rendering children
                element.type._context._currentValue = element.props.value;
                child = element.props.children;
            }
            else {
                // A consumer
                child = element.props.children(element.type._currentValue);
            }
            if (child) {
                if (Array.isArray(child)) {
                    child.forEach(function (item) { return walkTree(item, context, visitor); });
                }
                else {
                    walkTree(child, context, visitor);
                }
            }
        }
        else {
            // A basic string or dom element, just get children
            if (visitor(element, null, context) === false) {
                return;
            }
            if (element.props && element.props.children) {
                React.Children.forEach(element.props.children, function (child) {
                    if (child) {
                        walkTree(child, context, visitor);
                    }
                });
            }
        }
    }
    else if (typeof element === 'string' || typeof element === 'number') {
        // Just visit these, they are leaves so we don't keep traversing.
        visitor(element, null, context);
    }
    // TODO: Portals?
}
exports.walkTree = walkTree;
function hasFetchDataFunction(instance) {
    return typeof instance.fetchData === 'function';
}
function isPromise(promise) {
    return typeof promise.then === 'function';
}
function getPromisesFromTree(_a) {
    var rootElement = _a.rootElement, _b = _a.rootContext, rootContext = _b === void 0 ? {} : _b;
    var promises = [];
    walkTree(rootElement, rootContext, function (_, instance, context, childContext) {
        if (instance && hasFetchDataFunction(instance)) {
            var promise = instance.fetchData();
            if (isPromise(promise)) {
                promises.push({ promise: promise, context: childContext || context, instance: instance });
                return false;
            }
        }
    });
    return promises;
}
function getDataAndErrorsFromTree(rootElement, rootContext, storeError) {
    if (rootContext === void 0) { rootContext = {}; }
    var promises = getPromisesFromTree({ rootElement: rootElement, rootContext: rootContext });
    if (!promises.length) {
        return Promise.resolve();
    }
    var mappedPromises = promises.map(function (_a) {
        var promise = _a.promise, context = _a.context, instance = _a.instance;
        return promise
            .then(function (_) { return getDataAndErrorsFromTree(instance.render(), context, storeError); })["catch"](function (e) { return storeError(e); });
    });
    return Promise.all(mappedPromises);
}
function processErrors(errors) {
    switch (errors.length) {
        case 0:
            break;
        case 1:
            throw errors.pop();
        default:
            var wrapperError = new Error(errors.length + " errors were thrown when executing your fetchData functions.");
            wrapperError.queryErrors = errors;
            throw wrapperError;
    }
}
function getDataFromTree(rootElement, rootContext) {
    if (rootContext === void 0) { rootContext = {}; }
    var errors = [];
    var storeError = function (error) { return errors.push(error); };
    return getDataAndErrorsFromTree(rootElement, rootContext, storeError).then(function (_) {
        return processErrors(errors);
    });
}
exports["default"] = getDataFromTree;
