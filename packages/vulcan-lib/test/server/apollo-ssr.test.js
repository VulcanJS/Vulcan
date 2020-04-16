import expect from 'expect';
import sinon from 'sinon';
import makePageRenderer from '../../lib/server/apollo-ssr/renderPage';
import React from 'react';
import ApolloState from '../../lib/server/apollo-ssr/components/ApolloState';
//import { InjectData } from '../../lib/server/apollo-ssr';
import { initGraphQLTest } from 'meteor/vulcan:test';
import { mount } from 'enzyme';

const test = it;

const createDummySink = () => ({
    result: {
        body: '',
        head: ''
    },
    request: {
        url: 'foobar.com'
    },
    appendToHead(content) {
        this.result.head += content;
    },
    appendToBody(content) {
        this.result.body += content;
    }
});
describe('vulcan:lib/renderPage', () => {
    let renderPage;
    before(() => {
        initGraphQLTest();
        // TODO: remove the apollo client warning by initing GraphQL
        renderPage = makePageRenderer({
            computeContext: () => ({
                currentUser: null,
                siteData: null
            })
        });
    });

    test('should render page', async () => {
        const sink = createDummySink();
        await renderPage(sink);
        expect(sink.result.body).toMatch('<div id="react-app">');
        expect(sink.result.head).toMatch('<title');
        expect(sink.result.head).not.toMatch('<head');
    });
    test('should NOT render an additional <head> tag', async () => {
        const sink = createDummySink();
        await renderPage(sink);
        expect(sink.result.head).not.toMatch('<head');
    })

    test('should inject default data', async () => {
        const sink = createDummySink();
        await renderPage(sink);
        expect(sink.result.head).toMatch(/<script type="text\/inject-data">(.*?)<\/script>/);
    });

    test('do not inject data if cors are set', async () => {
        const sink = createDummySink();
        sink.responseHeaders = {
            'access-control-allow-origin': 'whatever'
        };
        await renderPage(sink);
        expect(sink.result.head).not.toMatch('type="text/inject-data');
    });

    describe('ApolloState', () => {
        // TODO: a better test would be replacing the App component
        // temporarily with a component that add <script>window.HACKED=1</script>
        // to apollo state, and run renderPage directly
        // That would mean creating a helper to replace App easily when rendering
        //@see https://medium.com/node-security/the-most-common-xss-vulnerability-in-react-js-applications-2bdffbcc1fa0
        test('serialize apollo state', async () => {
            const wrapper = mount(<ApolloState initialState={
                {
                    hack: '<script>window.HACKED=1</script>'
                }
            } />);
            expect(wrapper.find('script')).toHaveLength(1);
            const script = wrapper.find('script');
            expect(script.text()).not.toMatch('<script');
            expect(script.text()).not.toMatch('<');
        });
    });
});