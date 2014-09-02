/*
 Documentation coming soon.
*/

var XML        = require('xml');

function RSS (options, items) {
    options = options || {};

    this.title          = options.title || 'Untitled RSS Feed';
    this.description    = options.description || '';
    this.feed_url       = options.feed_url;
    this.site_url       = options.site_url;
    this.image_url      = options.image_url;
    this.author         = options.author;
    this.items          = items || [];

    this.item = function (options) {
        options = options || {};
        var item = {
            title:          options.title || 'No title',
            description:    options.description || '',
            url:            options.url,
            guid:           options.guid,
            categories:     options.categories || [],
            author:         options.author,
            date:           options.date
        };

        this.items.push(item);
        return this;
    };

    this.xml = function(indent) {
        return '<?xml version="1.0" encoding="UTF-8"?>\n'
                + XML(generateXML(this), indent);
    }

}

function ifTruePush(bool, array, data) {
    if (bool) {
        array.push(data);
    }
}

function generateXML (data){
    // todo: xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"

    var channel = [];
    channel.push({ title:           { _cdata: data.title } });
    channel.push({ description:     { _cdata: data.description || data.title } });
    channel.push({ link:            data.site_url || 'http://github.com/dylan/node-rss' });
    // image_url set?
    if (data.image_url) {
        channel.push({ image:  [ {url: data.image_url}, {title: data.title},  {link: data.site_url} ] });
    }
    channel.push({ generator:       'NodeJS RSS Module' });
    channel.push({ lastBuildDate:   new Date().toGMTString() });

    ifTruePush(data.feed_url, channel, { 'atom:link':  { _attr: { href: data.feed_url, rel: 'self', type: 'application/rss+xml' } } });
    //            { updated:      new Date().toGMTString() }

    
    data.items.forEach(function(item) {
        var item_values = [
                    { title:        { _cdata: item.title } }
                ];
        ifTruePush(item.description, item_values, { description:  { _cdata: item.description } });
        ifTruePush(item.url, item_values, { link: item.url });
        ifTruePush(item.link || item.guid || item.title, item_values, { guid:         [ { _attr: { isPermaLink: !item.guid && !!item.url } }, item.guid || item.url || item.title ]  });

        ifTruePush(item.author || data.author, item_values, { 'dc:creator': { _cdata: item.author || data.author } });
        ifTruePush(item.date, item_values, { pubDate:      new Date(item.date).toGMTString() });
        channel.push({ item: item_values });
    });

    return { rss: [
        { _attr: {
            'xmlns:dc':         'http://purl.org/dc/elements/1.1/',
            'xmlns:content':    'http://purl.org/rss/1.0/modules/content/',
            'xmlns:atom':       'http://www.w3.org/2005/Atom',
            version: '2.0'
             } },
        { channel: channel }
    ] };
}



module.exports = RSS;
