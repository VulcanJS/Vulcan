
var XML_CHARACTER_MAP = {
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;',
    '<': '&lt;',
    '>': '&gt;'
};

function xml_safe(string) {
    return string && string.replace ? string.replace(/([&"<>'])/g, function(str, item) {
                    return XML_CHARACTER_MAP[item];
                })
            : string;
}

module.exports.xml_safe = xml_safe;
