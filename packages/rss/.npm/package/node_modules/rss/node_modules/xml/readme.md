# XML for Node

  Fast and simple Javascript-based XML generator/builder for Node projects.

## Install

   $ npm install xml

## Examples

 There are examples in the examples directory.

## Tests

 Use [nodeunit](https://github.com/caolan/nodeunit) to run the tests.

    $ npm install nodeunit
    $ nodeunit test

Everything should pass:

    test
    ✔ empty
    ✔ simple
    ✔ deep
    ✔ indent
    ✔ attributes
    ✔ cdata
    ✔ encoding
    ✔ stream

    OK: 33 assertions (7ms)

## API
    XML(object, [indent || options])

  * `object` See Usage for how this can work.
  * `indent` Falsy value: No indent or line breaks (default). True: 4 spaces. `\t`: Single tab. `  `: Two spaces.  Etc.
  * `options` 'indent': same as `indent`, 'stream': force result to be a stream

## Examples

    var XML = require('xml');

**Simple Example**

    var example1 = [ { url: 'http://www.google.com/search?aq=f&sourceid=chrome&ie=UTF-8&q=opower' } ];
    console.log(XML(example1));
    //<url>http://www.google.com/search?aq=f&amp;sourceid=chrome&amp;ie=UTF-8&amp;q=opower</url>

**Example with attributes**

    var example2 = [ { url: { _attr: { hostname: 'www.google.com', path: '/search?aq=f&sourceid=chrome&ie=UTF-8&q=opower' }  } } ];
    console.log(XML(example2));
    //<url hostname="www.google.com" path="/search?aq=f&amp;sourceid=chrome&amp;ie=UTF-8&amp;q=opower"/>

**Example with array of same-named elements and nice formating**

    var example3 = [ { toys: [ { toy: 'Transformers' } , { toy: 'GI Joe' }, { toy: 'He-man' } ] } ];
    console.log(XML(example3));
    //<toys><toy>Transformers</toy><toy>GI Joe</toy><toy>He-man</toy></toys>
    console.log(XML(example3, true));
    /*
    <toys>
        <toy>Transformers</toy>
        <toy>GI Joe</toy>
        <toy>He-man</toy>
    </toys>
    */

**More complex example**

    var example4 = [ { toys: [ { _attr: { decade: '80s', locale: 'US'} }, { toy: 'Transformers' } , { toy: 'GI Joe' }, { toy: 'He-man' } ] } ];
    console.log(XML(example4, true));
    /*
    <toys decade="80s" locale="US">
        <toy>Transformers</toy>
        <toy>GI Joe</toy>
        <toy>He-man</toy>
    </toys>
    */

**Even more complex example**

    var example5 = [ { toys: [ { _attr: { decade: '80s', locale: 'US'} }, { toy: 'Transformers' } , { toy: [ { _attr: { knowing: 'half the battle' } }, 'GI Joe'] }, { toy: [ { name: 'He-man' }, { description: { _cdata: '<strong>Master of the Universe!</strong>'} } ] } ] } ];
    console.log(XML(example5, true));
    /*
    <toys><toy>Transformers</toy><toy>GI Joe</toy><toy>He-man</toy></toys>
    <toys>
        <toy>Transformers</toy>
        <toy>GI Joe</toy>
        <toy>He-man</toy>
    </toys>
    <toys decade="80s" locale="US">
        <toy>Transformers</toy>
        <toy>GI Joe</toy>
        <toy>He-man</toy>
    </toys>
    <toys decade="80s" locale="US">
        <toy>Transformers</toy>
        <toy knowing="half the battle">
            GI Joe
        </toy>
        <toy>
            <name>He-man</name>
            <description><![CDATA[<strong>Master of the Universe!</strong>]]></description>
        </toy>
    </toys>
    */

**Stream Example**

    var elem = XML.Element({ _attr: { decade: '80s', locale: 'US'} });
    var xml = XML({ toys: elem }, true);
    xml.on('data', function (chunk) {console.log("data:", chunk)});
    elem.push({ toy: 'Transformers' });
    elem.push({ toy: 'GI Joe' });
    elem.push({ toy: [{name:'He-man'}] });
    elem.close();

    /*
    data: <toys decade="80s" locale="US">
    data:     <toy>Transformers</toy>
    data:     <toy>GI Joe</toy>
    data:     <toy>
            <name>He-man</name>
        </toy>
    data: </toys>
    */


## Keywords

 * `_attr`: set attributes using a hash of key/value pairs.
 * `_cdata`: Value of _cdata is wrapped in xml CDATA so the data does not need to be escaped.


# Contributing

Contributions to the project are welcome. Feel free to fork and improve. I accept pull requests and issues,
especially when tests are included.

# License

(The MIT License)

Copyright (c) 2011 Dylan Greene <dylang@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.