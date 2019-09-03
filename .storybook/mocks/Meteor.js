// FIXME: we can't use ES6 imports in mocks, not sure why
module.exports = {
    settings: {},
    startup: () => { },
    _localStorage: window ? window.localStorage : { setItem: () => {}, getItem: () => {} },
    isClient: () => true,
    isServer: () => false,
    absoluteUrl: () => 'http://vulcanjs.org/'
}