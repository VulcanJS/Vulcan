import expect from 'expect';
import sinon from 'sinon';
import makePageRenderer from '../../lib/server/apollo-ssr/renderPage';
import { InjectData } from '../../lib/server/inject_data';

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
        console.log(this);
        this.result.body += content;
    }
});
describe('renderPage', () => {
    const renderPage = makePageRenderer({ computeContext: () => ({}) });

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

});