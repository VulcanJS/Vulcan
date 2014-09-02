/*
    Use nodeunit to run tests
*/

var XML = require('../index');


module.exports = {

    empty: function(test) {
        test.equal(XML(), '');
        test.equal(XML([]), '');
        test.equal(XML('test'), 'test');
        test.equal(XML('test'), 'test');
        test.equal(XML('scotch & whisky'), 'scotch &amp; whisky');
        test.equal(XML('bob\'s escape character'), 'bob&apos;s escape character');
        test.done();
    },


    simple: function(test) {
        test.equal(XML([ { a: {} }]), '<a/>');
        test.equal(XML([ { a: [] }]), '<a></a>');
        test.equal(XML([ { a: -1 }]), '<a>-1</a>');
        test.equal(XML([ { a: false }]), '<a>false</a>');
        test.equal(XML([ { a: 'test' }]), '<a>test</a>');
        test.equal(XML( { a: {} }), '<a/>');
        test.equal(XML( { a: [] }), '<a></a>');
        test.equal(XML( { a: -1 }), '<a>-1</a>');
        test.equal(XML( { a: false }), '<a>false</a>');
        test.equal(XML( { a: 'test' }), '<a>test</a>');
        test.equal(XML([ { a: 'test' }, { b: 123 }, { c: -0.5 } ]), '<a>test</a><b>123</b><c>-0.5</c>');
        test.done();
    },

    deep: function(test) {
        test.equal(XML([ { a: [ { b: [ { c: 1 }, { c: 2 }, { c: 3 } ] } ] }]), '<a><b><c>1</c><c>2</c><c>3</c></b></a>');
        test.done();
    },

    indent: function(test) {
        test.equal(XML([ { a: [ { b: [ { c: 1 }, { c: 2 }, { c: 3 } ] } ] }], true), '<a>\n    <b>\n        <c>1</c>\n        <c>2</c>\n        <c>3</c>\n    </b>\n</a>');
        test.equal(XML([ { a: [ { b: [ { c: 1 }, { c: 2 }, { c: 3 } ] } ] }], '  '), '<a>\n  <b>\n    <c>1</c>\n    <c>2</c>\n    <c>3</c>\n  </b>\n</a>');
        test.equal(XML([ { a: [ { b: [ { c: 1 }, { c: 2 }, { c: 3 } ] } ] }], '\t'), '<a>\n\t<b>\n\t\t<c>1</c>\n\t\t<c>2</c>\n\t\t<c>3</c>\n\t</b>\n</a>');
        test.done();
    },


    attributes: function(test) {
        test.equal(XML([ { b: { _attr: {} } } ]), '<b/>');
        test.equal(XML([ { a: { _attr: { attribute1: 'some value', attribute2: 12345 } } } ]), '<a attribute1="some value" attribute2="12345"/>');
        test.equal(XML([ { a: [{ _attr: { attribute1: 'some value', attribute2: 12345 } }] } ]), '<a attribute1="some value" attribute2="12345"></a>');
        test.equal(XML([ { a: [{ _attr: { attribute1: 'some value', attribute2: 12345 } }, 'content'] } ]), '<a attribute1="some value" attribute2="12345">content</a>');
        test.done();
    },

    cdata: function(test) {
        test.equal(XML([ { a: { _cdata: 'This is some <strong>CDATA</strong>' } } ]), '<a><![CDATA[This is some <strong>CDATA</strong>]]></a>');
        test.equal(XML([ { a: { _attr: { attribute1: 'some value', attribute2: 12345 },  _cdata: 'This is some <strong>CDATA</strong>' } } ]), '<a attribute1="some value" attribute2="12345"><![CDATA[This is some <strong>CDATA</strong>]]></a>');
        test.done();
    },

    encoding: function(test) {
        test.equal(XML([ { a: [ {  _attr: { anglebrackets: 'this is <strong>strong</strong>', url: 'http://google.com?s=opower&y=fun' } }, 'text'] } ]), '<a anglebrackets="this is &lt;strong&gt;strong&lt;/strong&gt;" url="http://google.com?s=opower&amp;y=fun">text</a>');
        test.done();
    },

    stream: function (test) {
        var elem = XML.Element({ _attr: { decade: '80s', locale: 'US'} });
        var xmlstream = XML({ toys: elem });
        var results = ['<toys decade="80s" locale="US">','<toy>Transformers</toy>','<toy><name>He-man</name></toy>','<toy>GI Joe</toy>','</toys>'];

        xmlstream.on('data', function (stanza) {
            test.equal(stanza, results.shift());
        });
        xmlstream.on('close', function () {
            test.deepEqual(results, []);
            test.done();
        });

        elem.push({ toy: 'Transformers' });
        elem.push({ toy: [ { name: 'He-man' } ] });
        setTimeout(function () {
            elem.push({ toy: 'GI Joe' });
            elem.close();
        }, 1);
    }

};
