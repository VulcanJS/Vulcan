import expect from 'expect';
import sinon from 'sinon';
import makePageRenderer from '../../lib/server/apollo-ssr/renderPage';
//import { InjectData } from '../../lib/server/apollo-ssr';
import { initGraphQLTest } from 'meteor/vulcan:test';

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
describe('renderPage', () => {
    let renderPage;
    before(() => {
        initGraphQLTest();
        // TODO: remove the apollo client warning by initing GraphQL
        renderPage = makePageRenderer({
            computeContext: () => ({
                currentUser: null,
                SiteData: null
            })
        });
    });

    test('should render page', async () => {
        const sink = createDummySink();
        await renderPage(sink);
        expect(sink.result.body).toMatch('<div id="react-app">');
        expect(sink.result.head).toMatch('<head');
    });

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
});