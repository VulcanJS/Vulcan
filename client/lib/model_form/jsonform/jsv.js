// This is a build of https://github.com/garycourt/JSV at 0aa11852537069b0830569ef1eab11a36b65b3ab with jsv.js, schema03 and URI.js appended.
(function(global, require) {
var exports = {};



/**
 * URI.js
 * 
 * @fileoverview An RFC 3986 compliant, scheme extendable URI parsing/validating/resolving library for JavaScript.
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @version 1.2
 * @see http://github.com/garycourt/uri-js
 * @license URI.js v1.2 (c) 2010 Gary Court. License: http://github.com/garycourt/uri-js
 */

/**
 * Copyright 2010 Gary Court. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 * 
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 * 
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY GARY COURT ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GARY COURT OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * The views and conclusions contained in the software and documentation are those of the
 * authors and should not be interpreted as representing official policies, either expressed
 * or implied, of Gary Court.
 */

/*jslint white: true, sub: true, onevar: true, undef: true, eqeqeq: true, newcap: true, immed: true, indent: 4 */
/*global exports:true, require:true */

if (typeof exports === "undefined") {
	exports = {}; 
}
if (typeof require !== "function") {
	require = function (id) {
		return exports;
	};
}
(function () {
	var	
		/**
		 * @param {...string} sets
		 * @return {string}
		 */
		mergeSet = function (sets) {
			var set = arguments[0],
				x = 1,
				nextSet = arguments[x];

			while (nextSet) {
				set = set.slice(0, -1) + nextSet.slice(1);
				nextSet = arguments[++x];
			}

			return set;
		},

		/**
		 * @param {string} str
		 * @return {string}
		 */
		subexp = function (str) {
			return "(?:" + str + ")";
		},

		ALPHA$$ = "[A-Za-z]",
		CR$ = "[\\x0D]",
		DIGIT$$ = "[0-9]",
		DQUOTE$$ = "[\\x22]",
		HEXDIG$$ = mergeSet(DIGIT$$, "[A-Fa-f]"),  //case-insensitive
		LF$$ = "[\\x0A]",
		SP$$ = "[\\x20]",
		PCT_ENCODED$ = subexp("%" + HEXDIG$$ + HEXDIG$$),
		GEN_DELIMS$$ = "[\\:\\/\\?\\#\\[\\]\\@]",
		SUB_DELIMS$$ = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]",
		RESERVED$$ = mergeSet(GEN_DELIMS$$, SUB_DELIMS$$),
		UNRESERVED$$ = mergeSet(ALPHA$$, DIGIT$$, "[\\-\\.\\_\\~]"),
		SCHEME$ = subexp(ALPHA$$ + mergeSet(ALPHA$$, DIGIT$$, "[\\+\\-\\.]") + "*"),
		USERINFO$ = subexp(subexp(PCT_ENCODED$ + "|" + mergeSet(UNRESERVED$$, SUB_DELIMS$$, "[\\:]")) + "*"),
		DEC_OCTET$ = subexp(subexp("25[0-5]") + "|" + subexp("2[0-4]" + DIGIT$$) + "|" + subexp("1" + DIGIT$$ + DIGIT$$) + "|" + subexp("[1-9]" + DIGIT$$) + "|" + DIGIT$$),
		IPV4ADDRESS$ = subexp(DEC_OCTET$ + "\\." + DEC_OCTET$ + "\\." + DEC_OCTET$ + "\\." + DEC_OCTET$),
		H16$ = subexp(HEXDIG$$ + "{1,4}"),
		LS32$ = subexp(subexp(H16$ + "\\:" + H16$) + "|" + IPV4ADDRESS$),
		IPV6ADDRESS$ = subexp(mergeSet(UNRESERVED$$, SUB_DELIMS$$, "[\\:]") + "+"),  //FIXME
		IPVFUTURE$ = subexp("v" + HEXDIG$$ + "+\\." + mergeSet(UNRESERVED$$, SUB_DELIMS$$, "[\\:]") + "+"),
		IP_LITERAL$ = subexp("\\[" + subexp(IPV6ADDRESS$ + "|" + IPVFUTURE$) + "\\]"),
		REG_NAME$ = subexp(subexp(PCT_ENCODED$ + "|" + mergeSet(UNRESERVED$$, SUB_DELIMS$$)) + "*"),
		HOST$ = subexp(IP_LITERAL$ + "|" + IPV4ADDRESS$ + "|" + REG_NAME$),
		PORT$ = subexp(DIGIT$$ + "*"),
		AUTHORITY$ = subexp(subexp(USERINFO$ + "@") + "?" + HOST$ + subexp("\\:" + PORT$) + "?"),
		PCHAR$ = subexp(PCT_ENCODED$ + "|" + mergeSet(UNRESERVED$$, SUB_DELIMS$$, "[\\:\\@]")),
		SEGMENT$ = subexp(PCHAR$ + "*"),
		SEGMENT_NZ$ = subexp(PCHAR$ + "+"),
		SEGMENT_NZ_NC$ = subexp(subexp(PCT_ENCODED$ + "|" + mergeSet(UNRESERVED$$, SUB_DELIMS$$, "[\\@]")) + "+"),
		PATH_ABEMPTY$ = subexp(subexp("\\/" + SEGMENT$) + "*"),
		PATH_ABSOLUTE$ = subexp("\\/" + subexp(SEGMENT_NZ$ + PATH_ABEMPTY$) + "?"),  //simplified
		PATH_NOSCHEME$ = subexp(SEGMENT_NZ_NC$ + PATH_ABEMPTY$),  //simplified
		PATH_ROOTLESS$ = subexp(SEGMENT_NZ$ + PATH_ABEMPTY$),  //simplified
		PATH_EMPTY$ = subexp(""),  //simplified
		PATH$ = subexp(PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_NOSCHEME$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$),
		QUERY$ = subexp(subexp(PCHAR$ + "|[\\/\\?]") + "*"),
		FRAGMENT$ = subexp(subexp(PCHAR$ + "|[\\/\\?]") + "*"),
		HIER_PART$ = subexp(subexp("\\/\\/" + AUTHORITY$ + PATH_ABEMPTY$) + "|" + PATH_ABSOLUTE$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$),
		URI$ = subexp(SCHEME$ + "\\:" + HIER_PART$ + subexp("\\?" + QUERY$) + "?" + subexp("\\#" + FRAGMENT$) + "?"),
		RELATIVE_PART$ = subexp(subexp("\\/\\/" + AUTHORITY$ + PATH_ABEMPTY$) + "|" + PATH_ABSOLUTE$ + "|" + PATH_NOSCHEME$ + "|" + PATH_EMPTY$),
		RELATIVE_REF$ = subexp(RELATIVE_PART$ + subexp("\\?" + QUERY$) + "?" + subexp("\\#" + FRAGMENT$) + "?"),
		URI_REFERENCE$ = subexp(URI$ + "|" + RELATIVE_REF$),
		ABSOLUTE_URI$ = subexp(SCHEME$ + "\\:" + HIER_PART$ + subexp("\\?" + QUERY$) + "?"),

		URI_REF = new RegExp("^" + subexp("(" + URI$ + ")|(" + RELATIVE_REF$ + ")") + "$"),
		GENERIC_REF  = new RegExp("^(" + SCHEME$ + ")\\:" + subexp(subexp("\\/\\/(" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?)") + "?(" + PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$ + ")") + subexp("\\?(" + QUERY$ + ")") + "?" + subexp("\\#(" + FRAGMENT$ + ")") + "?$"),
		RELATIVE_REF = new RegExp("^(){0}" + subexp(subexp("\\/\\/(" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?)") + "?(" + PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_NOSCHEME$ + "|" + PATH_EMPTY$ + ")") + subexp("\\?(" + QUERY$ + ")") + "?" + subexp("\\#(" + FRAGMENT$ + ")") + "?$"),
		ABSOLUTE_REF = new RegExp("^(" + SCHEME$ + ")\\:" + subexp(subexp("\\/\\/(" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?)") + "?(" + PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$ + ")") + subexp("\\?(" + QUERY$ + ")") + "?$"),
		SAMEDOC_REF = new RegExp("^" + subexp("\\#(" + FRAGMENT$ + ")") + "?$"),
		AUTHORITY = new RegExp("^" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?$"),

		NOT_SCHEME = new RegExp(mergeSet("[^]", ALPHA$$, DIGIT$$, "[\\+\\-\\.]"), "g"),
		NOT_USERINFO = new RegExp(mergeSet("[^\\%\\:]", UNRESERVED$$, SUB_DELIMS$$), "g"),
		NOT_HOST = new RegExp(mergeSet("[^\\%]", UNRESERVED$$, SUB_DELIMS$$), "g"),
		NOT_PATH = new RegExp(mergeSet("[^\\%\\/\\:\\@]", UNRESERVED$$, SUB_DELIMS$$), "g"),
		NOT_PATH_NOSCHEME = new RegExp(mergeSet("[^\\%\\/\\@]", UNRESERVED$$, SUB_DELIMS$$), "g"),
		NOT_QUERY = new RegExp(mergeSet("[^\\%]", UNRESERVED$$, SUB_DELIMS$$, "[\\:\\@\\/\\?]"), "g"),
		NOT_FRAGMENT = NOT_QUERY,
		ESCAPE = new RegExp(mergeSet("[^]", UNRESERVED$$, SUB_DELIMS$$), "g"),
		UNRESERVED = new RegExp(UNRESERVED$$, "g"),
		OTHER_CHARS = new RegExp(mergeSet("[^\\%]", UNRESERVED$$, RESERVED$$), "g"),
		PCT_ENCODEDS = new RegExp(PCT_ENCODED$ + "+", "g"),
		URI_PARSE = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?([^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/i,
		RDS1 = /^\.\.?\//,
		RDS2 = /^\/\.(\/|$)/,
		RDS3 = /^\/\.\.(\/|$)/,
		RDS4 = /^\.\.?$/,
		RDS5 = /^\/?.*?(?=\/|$)/,
		NO_MATCH_IS_UNDEFINED = ("").match(/(){0}/)[1] === undefined,

		/**
		 * @param {string} chr
		 * @return {string}
		 */
		pctEncChar = function (chr) {
			var c = chr.charCodeAt(0);
 
			if (c < 128) {
				return "%" + c.toString(16).toUpperCase();
			}
			else if ((c > 127) && (c < 2048)) {
				return "%" + ((c >> 6) | 192).toString(16).toUpperCase() + "%" + ((c & 63) | 128).toString(16).toUpperCase();
			}
			else {
				return "%" + ((c >> 12) | 224).toString(16).toUpperCase() + "%" + (((c >> 6) & 63) | 128).toString(16).toUpperCase() + "%" + ((c & 63) | 128).toString(16).toUpperCase();
			}
		},

		/**
		 * @param {string} str
		 * @return {string}
		 */
		pctDecUnreserved = function (str) {
			var newStr = "", 
				i = 0,
				c, s;

			while (i < str.length) {
				c = parseInt(str.substr(i + 1, 2), 16);

				if (c < 128) {
					s = String.fromCharCode(c);
					if (s.match(UNRESERVED)) {
						newStr += s;
					} else {
						newStr += str.substr(i, 3);
					}
					i += 3;
				}
				else if ((c > 191) && (c < 224)) {
					newStr += str.substr(i, 6);
					i += 6;
				}
				else {
					newStr += str.substr(i, 9);
					i += 9;
				}
			}

			return newStr;
		},

		/**
		 * @param {string} str
		 * @return {string}
		 */
		pctDecChars = function (str) {
			var newStr = "", 
				i = 0,
				c, c2, c3;

			while (i < str.length) {
				c = parseInt(str.substr(i + 1, 2), 16);

				if (c < 128) {
					newStr += String.fromCharCode(c);
					i += 3;
				}
				else if ((c > 191) && (c < 224)) {
					c2 = parseInt(str.substr(i + 4, 2), 16);
					newStr += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 6;
				}
				else {
					c2 = parseInt(str.substr(i + 4, 2), 16);
					c3 = parseInt(str.substr(i + 7, 2), 16);
					newStr += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 9;
				}
			}

			return newStr;
		},

		/**
		 * @return {string}
		 */
		typeOf = function (o) {
			return o === undefined ? "undefined" : (o === null ? "null" : Object.prototype.toString.call(o).split(" ").pop().split("]").shift().toLowerCase());
		},

		/**
		 * @constructor
		 * @implements URIComponents
		 */
		Components = function () {
			this.errors = [];
		}, 

		/** @namespace */ 
		URI = {};

	/**
	 * Components
	 */

	Components.prototype = {
		/**
		 * @type String
		 */

		scheme : undefined,

		/**
		 * @type String
		 */

		authority : undefined,

		/**
		 * @type String
		 */

		userinfo : undefined,

		/**
		 * @type String
		 */

		host : undefined,

		/**
		 * @type number
		 */

		port : undefined,

		/**
		 * @type string
		 */

		path : undefined,

		/**
		 * @type string
		 */

		query : undefined,

		/**
		 * @type string
		 */

		fragment : undefined,

		/**
		 * @type string
		 * @values "uri", "absolute", "relative", "same-document"
		 */

		reference : undefined,

		/**
		 * @type Array
		 */

		errors : undefined
	};

	/**
	 * URI
	 */

	/**
	 * @namespace
	 */

	URI.SCHEMES = {};

	/**
	 * @param {string} uriString
	 * @param {Options} [options]
	 * @returns {URIComponents}
	 */

	URI.parse = function (uriString, options) {
		var matches, 
			components = new Components(),
			schemeHandler;

		uriString = uriString ? uriString.toString() : "";
		options = options || {};

		if (options.reference === "suffix") {
			uriString = (options.scheme ? options.scheme + ":" : "") + "//" + uriString;
		}

		matches = uriString.match(URI_REF);

		if (matches) {
			if (matches[1]) {
				//generic URI
				matches = uriString.match(GENERIC_REF);
			} else {
				//relative URI
				matches = uriString.match(RELATIVE_REF);
			}
		} 

		if (!matches) {
			if (!options.tolerant) {
				components.errors.push("URI is not strictly valid.");
			}
			matches = uriString.match(URI_PARSE);
		}

		if (matches) {
			if (NO_MATCH_IS_UNDEFINED) {
				//store each component
				components.scheme = matches[1];
				components.authority = matches[2];
				components.userinfo = matches[3];
				components.host = matches[4];
				components.port = parseInt(matches[5], 10);
				components.path = matches[6] || "";
				components.query = matches[7];
				components.fragment = matches[8];

				//fix port number
				if (isNaN(components.port)) {
					components.port = matches[5];
				}
			} else {  //IE FIX for improper RegExp matching
				//store each component
				components.scheme = matches[1] || undefined;
				components.authority = (uriString.indexOf("//") !== -1 ? matches[2] : undefined);
				components.userinfo = (uriString.indexOf("@") !== -1 ? matches[3] : undefined);
				components.host = (uriString.indexOf("//") !== -1 ? matches[4] : undefined);
				components.port = parseInt(matches[5], 10);
				components.path = matches[6] || "";
				components.query = (uriString.indexOf("?") !== -1 ? matches[7] : undefined);
				components.fragment = (uriString.indexOf("#") !== -1 ? matches[8] : undefined);

				//fix port number
				if (isNaN(components.port)) {
					components.port = (uriString.match(/\/\/.*\:(?:\/|\?|\#|$)/) ? matches[4] : undefined);
				}
			}

			//determine reference type
			if (!components.scheme && !components.authority && !components.path && !components.query) {
				components.reference = "same-document";
			} else if (!components.scheme) {
				components.reference = "relative";
			} else if (!components.fragment) {
				components.reference = "absolute";
			} else {
				components.reference = "uri";
			}

			//check for reference errors
			if (options.reference && options.reference !== "suffix" && options.reference !== components.reference) {
				components.errors.push("URI is not a " + options.reference + " reference.");
			}

			//check if a handler for the scheme exists
			schemeHandler = URI.SCHEMES[components.scheme || options.scheme];
			if (schemeHandler && schemeHandler.parse) {
				//perform extra parsing
				schemeHandler.parse(components, options);
			}
		} else {
			components.errors.push("URI can not be parsed.");
		}

		return components;
	};

	/**
	 * @private
	 * @param {URIComponents} components
	 * @returns {string|undefined}
	 */

	URI._recomposeAuthority = function (components) {
		var uriTokens = [];

		if (components.userinfo !== undefined || components.host !== undefined || typeof components.port === "number") {
			if (components.userinfo !== undefined) {
				uriTokens.push(components.userinfo.toString().replace(NOT_USERINFO, pctEncChar));
				uriTokens.push("@");
			}
			if (components.host !== undefined) {
				uriTokens.push(components.host.toString().toLowerCase().replace(NOT_HOST, pctEncChar));
			}
			if (typeof components.port === "number") {
				uriTokens.push(":");
				uriTokens.push(components.port.toString(10));
			}
		}

		return uriTokens.length ? uriTokens.join("") : undefined;
	};

	/**
	 * @param {string} input
	 * @returns {string}
	 */

	URI.removeDotSegments = function (input) {
		var output = [], s;

		while (input.length) {
			if (input.match(RDS1)) {
				input = input.replace(RDS1, "");
			} else if (input.match(RDS2)) {
				input = input.replace(RDS2, "/");
			} else if (input.match(RDS3)) {
				input = input.replace(RDS3, "/");
				output.pop();
			} else if (input === "." || input === "..") {
				input = "";
			} else {
				s = input.match(RDS5)[0];
				input = input.slice(s.length);
				output.push(s);
			}
		}

		return output.join("");
	};

	/**
	 * @param {URIComponents} components
	 * @param {Options} [options]
	 * @returns {string}
	 */

	URI.serialize = function (components, options) {
		var uriTokens = [], 
			schemeHandler, 
			s;
		options = options || {};

		//check if a handler for the scheme exists
		schemeHandler = URI.SCHEMES[components.scheme || options.scheme];
		if (schemeHandler && schemeHandler.serialize) {
			//perform extra serialization
			schemeHandler.serialize(components, options);
		}

		if (options.reference !== "suffix" && components.scheme) {
			uriTokens.push(components.scheme.toString().toLowerCase().replace(NOT_SCHEME, ""));
			uriTokens.push(":");
		}

		components.authority = URI._recomposeAuthority(components);
		if (components.authority !== undefined) {
			if (options.reference !== "suffix") {
				uriTokens.push("//");
			}

			uriTokens.push(components.authority);

			if (components.path && components.path.charAt(0) !== "/") {
				uriTokens.push("/");
			}
		}

		if (components.path) {
			s = URI.removeDotSegments(components.path.toString().replace(/%2E/ig, "."));

			if (components.scheme) {
				s = s.replace(NOT_PATH, pctEncChar);
			} else {
				s = s.replace(NOT_PATH_NOSCHEME, pctEncChar);
			}

			if (components.authority === undefined) {
				s = s.replace(/^\/\//, "/%2F");  //don't allow the path to start with "//"
			}
			uriTokens.push(s);
		}

		if (components.query) {
			uriTokens.push("?");
			uriTokens.push(components.query.toString().replace(NOT_QUERY, pctEncChar));
		}

		if (components.fragment) {
			uriTokens.push("#");
			uriTokens.push(components.fragment.toString().replace(NOT_FRAGMENT, pctEncChar));
		}

		return uriTokens
			.join('')  //merge tokens into a string
			.replace(PCT_ENCODEDS, pctDecUnreserved)  //undecode unreserved characters
			//.replace(OTHER_CHARS, pctEncChar)  //replace non-URI characters
			.replace(/%[0-9A-Fa-f]{2}/g, function (str) {  //uppercase percent encoded characters
				return str.toUpperCase();
			})
		;
	};

	/**
	 * @param {URIComponents} base
	 * @param {URIComponents} relative
	 * @param {Options} [options]
	 * @param {boolean} [skipNormalization]
	 * @returns {URIComponents}
	 */

	URI.resolveComponents = function (base, relative, options, skipNormalization) {
		var target = new Components();

		if (!skipNormalization) {
			base = URI.parse(URI.serialize(base, options), options);  //normalize base components
			relative = URI.parse(URI.serialize(relative, options), options);  //normalize relative components
		}
		options = options || {};

		if (!options.tolerant && relative.scheme) {
			target.scheme = relative.scheme;
			target.authority = relative.authority;
			target.userinfo = relative.userinfo;
			target.host = relative.host;
			target.port = relative.port;
			target.path = URI.removeDotSegments(relative.path);
			target.query = relative.query;
		} else {
			if (relative.authority !== undefined) {
				target.authority = relative.authority;
				target.userinfo = relative.userinfo;
				target.host = relative.host;
				target.port = relative.port;
				target.path = URI.removeDotSegments(relative.path);
				target.query = relative.query;
			} else {
				if (!relative.path) {
					target.path = base.path;
					if (relative.query !== undefined) {
						target.query = relative.query;
					} else {
						target.query = base.query;
					}
				} else {
					if (relative.path.charAt(0) === "/") {
						target.path = URI.removeDotSegments(relative.path);
					} else {
						if (base.authority !== undefined && !base.path) {
							target.path = "/" + relative.path;
						} else if (!base.path) {
							target.path = relative.path;
						} else {
							target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
						}
						target.path = URI.removeDotSegments(target.path);
					}
					target.query = relative.query;
				}
				target.authority = base.authority;
				target.userinfo = base.userinfo;
				target.host = base.host;
				target.port = base.port;
			}
			target.scheme = base.scheme;
		}

		target.fragment = relative.fragment;

		return target;
	};

	/**
	 * @param {string} baseURI
	 * @param {string} relativeURI
	 * @param {Options} [options]
	 * @returns {string}
	 */

	URI.resolve = function (baseURI, relativeURI, options) {
		return URI.serialize(URI.resolveComponents(URI.parse(baseURI, options), URI.parse(relativeURI, options), options, true), options);
	};

	/**
	 * @param {string|URIComponents} uri
	 * @param {Options} options
	 * @returns {string|URIComponents}
	 */

	URI.normalize = function (uri, options) {
		if (typeof uri === "string") {
			return URI.serialize(URI.parse(uri, options), options);
		} else if (typeOf(uri) === "object") {
			return URI.parse(URI.serialize(uri, options), options);
		}

		return uri;
	};

	/**
	 * @param {string|URIComponents} uriA
	 * @param {string|URIComponents} uriB
	 * @param {Options} options
	 */

	URI.equal = function (uriA, uriB, options) {
		if (typeof uriA === "string") {
			uriA = URI.serialize(URI.parse(uriA, options), options);
		} else if (typeOf(uriA) === "object") {
			uriA = URI.serialize(uriA, options);
		}

		if (typeof uriB === "string") {
			uriB = URI.serialize(URI.parse(uriB, options), options);
		} else if (typeOf(uriB) === "object") {
			uriB = URI.serialize(uriB, options);
		}

		return uriA === uriB;
	};

	/**
	 * @param {string} str
	 * @returns {string}
	 */

	URI.escapeComponent = function (str) {
		return str && str.toString().replace(ESCAPE, pctEncChar);
	};

	/**
	 * @param {string} str
	 * @returns {string}
	 */

	URI.unescapeComponent = function (str) {
		return str && str.toString().replace(PCT_ENCODEDS, pctDecChars);
	};

	//export API
	exports.Components = Components;
	exports.URI = URI;

	//name-safe export API
	exports["URI"] = {
		"SCHEMES" : URI.SCHEMES,
		"parse" : URI.parse,
		"removeDotSegments" : URI.removeDotSegments,
		"serialize" : URI.serialize,
		"resolveComponents" : URI.resolveComponents,
		"resolve" : URI.resolve,
		"normalize" : URI.normalize,
		"equal" : URI.equal,
		"escapeComponent" : URI.escapeComponent,
		"unescapeComponent" : URI.unescapeComponent
	};

}());



	/**
 * JSV: JSON Schema Validator
 * 
 * @fileOverview A JavaScript implementation of a extendable, fully compliant JSON Schema validator.
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @version 3.5
 * @see http://github.com/garycourt/JSV
 */

/*
 * Copyright 2010 Gary Court. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 * 
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 * 
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY GARY COURT ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GARY COURT OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * The views and conclusions contained in the software and documentation are those of the
 * authors and should not be interpreted as representing official policies, either expressed
 * or implied, of Gary Court or the JSON Schema specification.
 */

/*jslint white: true, sub: true, onevar: true, undef: true, eqeqeq: true, newcap: true, immed: true, indent: 4 */

var exports = exports || this,
	require = require || function () {
		return exports;
	};

(function () {

	var URI = require("./uri/uri").URI,
		O = {},
		I2H = "0123456789abcdef".split(""),
		mapArray, filterArray, searchArray,

		JSV;

	//
	// Utility functions
	//

	function typeOf(o) {
		return o === undefined ? "undefined" : (o === null ? "null" : Object.prototype.toString.call(o).split(" ").pop().split("]").shift().toLowerCase());
	}

	/** @inner */
	function F() {}

	function createObject(proto) {
		F.prototype = proto || {};
		return new F();
	}

	function mapObject(obj, func, scope) {
		var newObj = {}, key;
		for (key in obj) {
			if (obj[key] !== O[key]) {
				newObj[key] = func.call(scope, obj[key], key, obj);
			}
		}
		return newObj;
	}

	/** @ignore */
	mapArray = function (arr, func, scope) {
		var x = 0, xl = arr.length, newArr = new Array(xl);
		for (; x < xl; ++x) {
			newArr[x] = func.call(scope, arr[x], x, arr);
		}
		return newArr;
	};

	if (Array.prototype.map) {
		/** @ignore */
		mapArray = function (arr, func, scope) {
			return Array.prototype.map.call(arr, func, scope);
		};
	}

	/** @ignore */
	filterArray = function (arr, func, scope) {
		var x = 0, xl = arr.length, newArr = [];
		for (; x < xl; ++x) {
			if (func.call(scope, arr[x], x, arr)) {
				newArr[newArr.length] = arr[x];
			}
		}
		return newArr;
	};

	if (Array.prototype.filter) {
		/** @ignore */
		filterArray = function (arr, func, scope) {
			return Array.prototype.filter.call(arr, func, scope);
		};
	}

	/** @ignore */
	searchArray = function (arr, o) {
		var x = 0, xl = arr.length;
		for (; x < xl; ++x) {
			if (arr[x] === o) {
				return x;
			}
		}
		return -1;
	};

	if (Array.prototype.indexOf) {
		/** @ignore */
		searchArray = function (arr, o) {
			return Array.prototype.indexOf.call(arr, o);
		};
	}

	function toArray(o) {
		return o !== undefined && o !== null ? (o instanceof Array && !o.callee ? o : (typeof o.length !== "number" || o.split || o.setInterval || o.call ? [ o ] : Array.prototype.slice.call(o))) : [];
	}

	function keys(o) {
		var result = [], key;

		switch (typeOf(o)) {
		case "object":
			for (key in o) {
				if (o[key] !== O[key]) {
					result[result.length] = key;
				}
			}
			break;
		case "array":
			for (key = o.length - 1; key >= 0; --key) {
				result[key] = key;
			}
			break;
		}

		return result;
	}

	function pushUnique(arr, o) {
		if (searchArray(arr, o) === -1) {
			arr.push(o);
		}
		return arr;
	}

	function popFirst(arr, o) {
		var index = searchArray(arr, o);
		if (index > -1) {
			arr.splice(index, 1);
		}
		return arr;
	}

	function randomUUID() {
		return [
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			"-",
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			"-4",  //set 4 high bits of time_high field to version
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			"-",
			I2H[(Math.floor(Math.random() * 0x10) & 0x3) | 0x8],  //specify 2 high bits of clock sequence
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			"-",
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)]
		].join("");
	}

	function escapeURIComponent(str) {
		return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');
	}

	function formatURI(uri) {
		if (typeof uri === "string" && uri.indexOf("#") === -1) {
			uri += "#";
		}
		return uri;
	}

	/**
	 * Defines an error, found by a schema, with an instance.
	 * This class can only be instantiated by {@link Report#addError}. 
	 * 
	 * @name ValidationError
	 * @class
	 * @see Report#addError
	 */

	/**
	 * The URI of the instance that has the error.
	 * 
	 * @name ValidationError.prototype.uri
	 * @type String
	 */

	/**
	 * The URI of the schema that generated the error.
	 * 
	 * @name ValidationError.prototype.schemaUri
	 * @type String
	 */

	/**
	 * The name of the schema attribute that generated the error.
	 * 
	 * @name ValidationError.prototype.attribute
	 * @type String
	 */

	/**
	 * An user-friendly (English) message about what failed to validate.
	 * 
	 * @name ValidationError.prototype.message
	 * @type String
	 */

	/**
	 * The value of the schema attribute that generated the error.
	 * 
	 * @name ValidationError.prototype.details
	 * @type Any
	 */

	/**
	 * Reports are returned from validation methods to describe the result of a validation.
	 * 
	 * @name Report
	 * @class
	 * @see JSONSchema#validate
	 * @see Environment#validate
	 */

	function Report() {
		/**
		 * An array of {@link ValidationError} objects that define all the errors generated by the schema against the instance.
		 * 
		 * @name Report.prototype.errors
		 * @type Array
		 * @see Report#addError
		 */
		this.errors = [];

		/**
		 * A hash table of every instance and what schemas were validated against it.
		 * <p>
		 * The key of each item in the table is the URI of the instance that was validated.
		 * The value of this key is an array of strings of URIs of the schema that validated it.
		 * </p>
		 * 
		 * @name Report.prototype.validated
		 * @type Object
		 * @see Report#registerValidation
		 * @see Report#isValidatedBy
		 */
		this.validated = {};

		/**
		 * If the report is generated by {@link Environment#validate}, this field is the generated instance.
		 * 
		 * @name Report.prototype.instance
		 * @type JSONInstance
		 * @see Environment#validate
		 */

		/**
		 * If the report is generated by {@link Environment#validate}, this field is the generated schema.
		 * 
		 * @name Report.prototype.schema
		 * @type JSONSchema
		 * @see Environment#validate
		 */

		/**
		 * If the report is generated by {@link Environment#validate}, this field is the schema's schema.
		 * This value is the same as calling <code>schema.getSchema()</code>.
		 * 
		 * @name Report.prototype.schemaSchema
		 * @type JSONSchema
		 * @see Environment#validate
		 * @see JSONSchema#getSchema
		 */
	}

	/**
	 * Adds a {@link ValidationError} object to the <a href="#errors"><code>errors</code></a> field.
	 * 
	 * @param {JSONInstance|String} instance The instance (or instance URI) that is invalid
	 * @param {JSONSchema|String} schema The schema (or schema URI) that was validating the instance
	 * @param {String} attr The attribute that failed to validated
	 * @param {String} message A user-friendly message on why the schema attribute failed to validate the instance
	 * @param {Any} details The value of the schema attribute
	 */

	Report.prototype.addError = function (instance, schema, attr, message, details) {
		this.errors.push({
			uri : instance instanceof JSONInstance ? instance.getURI() : instance,
			schemaUri : schema instanceof JSONInstance ? schema.getURI() : schema,
			attribute : attr,
			message : message,
			details : details
		});
	};

	/**
	 * Registers that the provided instance URI has been validated by the provided schema URI. 
	 * This is recorded in the <a href="#validated"><code>validated</code></a> field.
	 * 
	 * @param {String} uri The URI of the instance that was validated
	 * @param {String} schemaUri The URI of the schema that validated the instance
	 */

	Report.prototype.registerValidation = function (uri, schemaUri) {
		if (!this.validated[uri]) {
			this.validated[uri] = [ schemaUri ];
		} else {
			this.validated[uri].push(schemaUri);
		}
	};

	/**
	 * Returns if an instance with the provided URI has been validated by the schema with the provided URI. 
	 * 
	 * @param {String} uri The URI of the instance
	 * @param {String} schemaUri The URI of a schema
	 * @returns {Boolean} If the instance has been validated by the schema.
	 */

	Report.prototype.isValidatedBy = function (uri, schemaUri) {
		return !!this.validated[uri] && searchArray(this.validated[uri], schemaUri) !== -1;
	};

	/**
	 * A wrapper class for binding an Environment, URI and helper methods to an instance. 
	 * This class is most commonly instantiated with {@link Environment#createInstance}.
	 * 
	 * @name JSONInstance
	 * @class
	 * @param {Environment} env The environment this instance belongs to
	 * @param {JSONInstance|Any} json The value of the instance
	 * @param {String} [uri] The URI of the instance. If undefined, the URI will be a randomly generated UUID. 
	 * @param {String} [fd] The fragment delimiter for properties. If undefined, uses the environment default.
	 */

	function JSONInstance(env, json, uri, fd) {
		if (json instanceof JSONInstance) {
			if (typeof fd !== "string") {
				fd = json._fd;
			}
			if (typeof uri !== "string") {
				uri = json._uri;
			}
			json = json._value;
		}

		if (typeof uri !== "string") {
			uri = "urn:uuid:" + randomUUID() + "#";
		} else if (uri.indexOf(":") === -1) {
			uri = formatURI(URI.resolve("urn:uuid:" + randomUUID() + "#", uri));
		}

		this._env = env;
		this._value = json;
		this._uri = uri;
		this._fd = fd || this._env._options["defaultFragmentDelimiter"];
	}

	/**
	 * Returns the environment the instance is bound to.
	 * 
	 * @returns {Environment} The environment of the instance
	 */

	JSONInstance.prototype.getEnvironment = function () {
		return this._env;
	};

	/**
	 * Returns the name of the type of the instance.
	 * 
	 * @returns {String} The name of the type of the instance
	 */

	JSONInstance.prototype.getType = function () {
		return typeOf(this._value);
	};

	/**
	 * Returns the JSON value of the instance.
	 * 
	 * @returns {Any} The actual JavaScript value of the instance
	 */

	JSONInstance.prototype.getValue = function () {
		return this._value;
	};

	/**
	 * Returns the URI of the instance.
	 * 
	 * @returns {String} The URI of the instance
	 */

	JSONInstance.prototype.getURI = function () {
		return this._uri;
	};

	/**
	 * Returns a resolved URI of a provided relative URI against the URI of the instance.
	 * 
	 * @param {String} uri The relative URI to resolve
	 * @returns {String} The resolved URI
	 */

	JSONInstance.prototype.resolveURI = function (uri) {
		return formatURI(URI.resolve(this._uri, uri));
	};

	/**
	 * Returns an array of the names of all the properties.
	 * 
	 * @returns {Array} An array of strings which are the names of all the properties
	 */

	JSONInstance.prototype.getPropertyNames = function () {
		return keys(this._value);
	};

	/**
	 * Returns a {@link JSONInstance} of the value of the provided property name. 
	 * 
	 * @param {String} key The name of the property to fetch
	 * @returns {JSONInstance} The instance of the property value
	 */

	JSONInstance.prototype.getProperty = function (key) {
		var value = this._value ? this._value[key] : undefined;
		if (value instanceof JSONInstance) {
			return value;
		}
		//else
		return new JSONInstance(this._env, value, this._uri + this._fd + escapeURIComponent(key), this._fd);
	};

	/**
	 * Returns all the property instances of the target instance.
	 * <p>
	 * If the target instance is an Object, then the method will return a hash table of {@link JSONInstance}s of all the properties. 
	 * If the target instance is an Array, then the method will return an array of {@link JSONInstance}s of all the items.
	 * </p> 
	 * 
	 * @returns {Object|Array|undefined} The list of instances for all the properties
	 */

	JSONInstance.prototype.getProperties = function () {
		var type = typeOf(this._value),
			self = this;

		if (type === "object") {
			return mapObject(this._value, function (value, key) {
				if (value instanceof JSONInstance) {
					return value;
				}
				return new JSONInstance(self._env, value, self._uri + self._fd + escapeURIComponent(key), self._fd);
			});
		} else if (type === "array") {
			return mapArray(this._value, function (value, key) {
				if (value instanceof JSONInstance) {
					return value;
				}
				return new JSONInstance(self._env, value, self._uri + self._fd + escapeURIComponent(key), self._fd);
			});
		}
	};

	/**
	 * Returns the JSON value of the provided property name. 
	 * This method is a faster version of calling <code>instance.getProperty(key).getValue()</code>.
	 * 
	 * @param {String} key The name of the property
	 * @returns {Any} The JavaScript value of the instance
	 * @see JSONInstance#getProperty
	 * @see JSONInstance#getValue
	 */

	JSONInstance.prototype.getValueOfProperty = function (key) {
		if (this._value) {
			if (this._value[key] instanceof JSONInstance) {
				return this._value[key]._value;
			}
			return this._value[key];
		}
	};

	/**
	 * Return if the provided value is the same as the value of the instance.
	 * 
	 * @param {JSONInstance|Any} instance The value to compare
	 * @returns {Boolean} If both the instance and the value match
	 */

	JSONInstance.prototype.equals = function (instance) {
		if (instance instanceof JSONInstance) {
			return this._value === instance._value;
		}
		//else
		return this._value === instance;
	};

	/**
	 * Warning: Not a generic clone function
	 * Produces a JSV acceptable clone
	 */

	function clone(obj, deep) {
		var newObj, x;

		if (obj instanceof JSONInstance) {
			obj = obj.getValue();
		}

		switch (typeOf(obj)) {
		case "object":
			if (deep) {
				newObj = {};
				for (x in obj) {
					if (obj[x] !== O[x]) {
						newObj[x] = clone(obj[x], deep);
					}
				}
				return newObj;
			} else {
				return createObject(obj);
			}
			break;
		case "array":
			if (deep) {
				newObj = new Array(obj.length);
				x = obj.length;
				while (--x >= 0) {
					newObj[x] = clone(obj[x], deep);
				}
				return newObj;
			} else {
				return Array.prototype.slice.call(obj);
			}
			break;
		default:
			return obj;
		}
	}

	/**
	 * This class binds a {@link JSONInstance} with a {@link JSONSchema} to provided context aware methods. 
	 * 
	 * @name JSONSchema
	 * @class
	 * @param {Environment} env The environment this schema belongs to
	 * @param {JSONInstance|Any} json The value of the schema
	 * @param {String} [uri] The URI of the schema. If undefined, the URI will be a randomly generated UUID. 
	 * @param {JSONSchema|Boolean} [schema] The schema to bind to the instance. If <code>undefined</code>, the environment's default schema will be used. If <code>true</code>, the instance's schema will be itself.
	 * @extends JSONInstance
	 */

	function JSONSchema(env, json, uri, schema) {
		var fr;
		JSONInstance.call(this, env, json, uri);

		if (schema === true) {
			this._schema = this;
		} else if (json instanceof JSONSchema && !(schema instanceof JSONSchema)) {
			this._schema = json._schema;  //TODO: Make sure cross environments don't mess everything up
		} else {
			this._schema = schema instanceof JSONSchema ? schema : this._env.getDefaultSchema() || JSONSchema.createEmptySchema(this._env);
		}

		//determine fragment delimiter from schema
		fr = this._schema.getValueOfProperty("fragmentResolution");
		if (fr === "dot-delimited") {
			this._fd = ".";
		} else if (fr === "slash-delimited") {
			this._fd = "/";
		}
	}

	JSONSchema.prototype = createObject(JSONInstance.prototype);

	/**
	 * Creates an empty schema.
	 * 
	 * @param {Environment} env The environment of the schema
	 * @returns {JSONSchema} The empty schema, who's schema is itself.
	 */

	JSONSchema.createEmptySchema = function (env) {
		var schema = createObject(JSONSchema.prototype);
		JSONInstance.call(schema, env, {}, undefined, undefined);
		schema._schema = schema;
		return schema;
	};

	/**
	 * Returns the schema of the schema.
	 * 
	 * @returns {JSONSchema} The schema of the schema
	 */

	JSONSchema.prototype.getSchema = function () {
		return this._schema;
	};

	/**
	 * Returns the value of the provided attribute name.
	 * <p>
	 * This method is different from {@link JSONInstance#getProperty} as the named property 
	 * is converted using a parser defined by the schema's schema before being returned. This
	 * makes the return value of this method attribute dependent.
	 * </p>
	 * 
	 * @param {String} key The name of the attribute
	 * @param {Any} [arg] Some attribute parsers accept special arguments for returning resolved values. This is attribute dependent.
	 * @returns {JSONSchema|Any} The value of the attribute
	 */

	JSONSchema.prototype.getAttribute = function (key, arg) {
		var schemaProperty, parser, property, result;

		if (!arg && this._attributes && this._attributes.hasOwnProperty(key)) {
			return this._attributes[key];
		}

		schemaProperty = this._schema.getProperty("properties").getProperty(key);
		parser = schemaProperty.getValueOfProperty("parser");
		property = this.getProperty(key);
		if (typeof parser === "function") {
			result = parser(property, schemaProperty, arg);
			if (!arg && this._attributes) {
				this._attributes[key] = result;
			}
			return result;
		}
		//else
		return property.getValue();
	};

	/**
	 * Returns all the attributes of the schema.
	 * 
	 * @returns {Object} A map of all parsed attribute values
	 */

	JSONSchema.prototype.getAttributes = function () {
		var properties, schemaProperties, key, schemaProperty, parser;

		if (!this._attributes && this.getType() === "object") {
			properties = this.getProperties();
			schemaProperties = this._schema.getProperty("properties");
			this._attributes = {};
			for (key in properties) {
				if (properties[key] !== O[key]) {
					schemaProperty = schemaProperties && schemaProperties.getProperty(key);
					parser = schemaProperty && schemaProperty.getValueOfProperty("parser");
					if (typeof parser === "function") {
						this._attributes[key] = parser(properties[key], schemaProperty);
					} else {
						this._attributes[key] = properties[key].getValue();
					}
				}
			}
		}

		return clone(this._attributes, false);
	};

	/**
	 * Convenience method for retrieving a link or link object from a schema. 
	 * This method is the same as calling <code>schema.getAttribute("links", [rel, instance])[0];</code>.
	 * 
	 * @param {String} rel The link relationship
	 * @param {JSONInstance} [instance] The instance to resolve any URIs from
	 * @returns {String|Object|undefined} If <code>instance</code> is provided, a string containing the resolve URI of the link is returned.
	 *   If <code>instance</code> is not provided, a link object is returned with details of the link.
	 *   If no link with the provided relationship exists, <code>undefined</code> is returned.
	 * @see JSONSchema#getAttribute
	 */

	JSONSchema.prototype.getLink = function (rel, instance) {
		var schemaLinks = this.getAttribute("links", [rel, instance]);
		if (schemaLinks && schemaLinks.length && schemaLinks[schemaLinks.length - 1]) {
			return schemaLinks[schemaLinks.length - 1];
		}
	};

	/**
	 * Validates the provided instance against the target schema and returns a {@link Report}.
	 * 
	 * @param {JSONInstance|Any} instance The instance to validate; may be a {@link JSONInstance} or any JavaScript value
	 * @param {Report} [report] A {@link Report} to concatenate the result of the validation to. If <code>undefined</code>, a new {@link Report} is created. 
	 * @param {JSONInstance} [parent] The parent/containing instance of the provided instance
	 * @param {JSONSchema} [parentSchema] The schema of the parent/containing instance
	 * @param {String} [name] The name of the parent object's property that references the instance
	 * @returns {Report} The result of the validation
	 */

	JSONSchema.prototype.validate = function (instance, report, parent, parentSchema, name) {
		var validator = this._schema.getValueOfProperty("validator");

		if (!(instance instanceof JSONInstance)) {
			instance = this.getEnvironment().createInstance(instance);
		}

		if (!(report instanceof Report)) {
			report = new Report();
		}

		if (typeof validator === "function" && !report.isValidatedBy(instance.getURI(), this.getURI())) {
			report.registerValidation(instance.getURI(), this.getURI());
			validator(instance, this, this._schema, report, parent, parentSchema, name);
		}

		return report;
	};

	/**
	 * Merges two schemas/instances together.
	 */

	function inherits(base, extra, extension) {
		var baseType = typeOf(base),
			extraType = typeOf(extra),
			child, x;

		if (extraType === "undefined") {
			return clone(base, true);
		} else if (baseType === "undefined" || extraType !== baseType) {
			return clone(extra, true);
		} else if (extraType === "object") {
			if (base instanceof JSONSchema) {
				base = base.getAttributes();
			}
			if (extra instanceof JSONSchema) {
				extra = extra.getAttributes();
				if (extra["extends"] && extension && extra["extends"] instanceof JSONSchema) {
					extra["extends"] = [ extra["extends"] ];
				}
			}
			child = clone(base, true);  //this could be optimized as some properties get overwritten
			for (x in extra) {
				if (extra[x] !== O[x]) {
					child[x] = inherits(base[x], extra[x], extension);
				}
			}
			return child;
		} else {
			return clone(extra, true);
		}
	}

	/**
	 * An Environment is a sandbox of schemas thats behavior is different from other environments.
	 * 
	 * @name Environment
	 * @class
	 */

	function Environment() {
		this._id = randomUUID();
		this._schemas = {};
		this._options = {};
	}

	/**
	 * Returns a clone of the target environment.
	 * 
	 * @returns {Environment} A new {@link Environment} that is a exact copy of the target environment 
	 */

	Environment.prototype.clone = function () {
		var env = new Environment();
		env._schemas = createObject(this._schemas);
		env._options = createObject(this._options);

		return env;
	};

	/**
	 * Returns a new {@link JSONInstance} of the provided data.
	 * 
	 * @param {JSONInstance|Any} data The value of the instance
	 * @param {String} [uri] The URI of the instance. If undefined, the URI will be a randomly generated UUID. 
	 * @returns {JSONInstance} A new {@link JSONInstance} from the provided data
	 */

	Environment.prototype.createInstance = function (data, uri) {
		var instance;
		uri = formatURI(uri);

		if (data instanceof JSONInstance && (!uri || data.getURI() === uri)) {
			return data;
		}
		//else
		instance = new JSONInstance(this, data, uri);

		return instance;
	};

	/**
	 * Creates a new {@link JSONSchema} from the provided data, and registers it with the environment. 
	 * 
	 * @param {JSONInstance|Any} data The value of the schema
	 * @param {JSONSchema|Boolean} [schema] The schema to bind to the instance. If <code>undefined</code>, the environment's default schema will be used. If <code>true</code>, the instance's schema will be itself.
	 * @param {String} [uri] The URI of the schema. If undefined, the URI will be a randomly generated UUID. 
	 * @returns {JSONSchema} A new {@link JSONSchema} from the provided data
	 * @throws {InitializationError} If a schema that is not registered with the environment is referenced 
	 */

	Environment.prototype.createSchema = function (data, schema, uri) {
		var instance, 
			initializer;
		uri = formatURI(uri);

		if (data instanceof JSONSchema && (!uri || data._uri === uri) && (!schema || data._schema.equals(schema))) {
			return data;
		}

		instance = new JSONSchema(this, data, uri, schema);

		initializer = instance.getSchema().getValueOfProperty("initializer");
		if (typeof initializer === "function") {
			instance = initializer(instance);
		}

		//register schema
		this._schemas[instance._uri] = instance;
		this._schemas[uri] = instance;

		//build & cache the rest of the schema
		instance.getAttributes();

		return instance;
	};

	/**
	 * Creates an empty schema.
	 * 
	 * @param {Environment} env The environment of the schema
	 * @returns {JSONSchema} The empty schema, who's schema is itself.
	 */

	Environment.prototype.createEmptySchema = function () {
		var schema = JSONSchema.createEmptySchema(this);
		this._schemas[schema._uri] = schema;
		return schema;
	};

	/**
	 * Returns the schema registered with the provided URI.
	 * 
	 * @param {String} uri The absolute URI of the required schema
	 * @returns {JSONSchema|undefined} The request schema, or <code>undefined</code> if not found
	 */

	Environment.prototype.findSchema = function (uri) {
		return this._schemas[formatURI(uri)];
	};

	/**
	 * Sets the specified environment option to the specified value.
	 * 
	 * @param {String} name The name of the environment option to set
	 * @param {Any} value The new value of the environment option
	 */

	Environment.prototype.setOption = function (name, value) {
		this._options[name] = value;
	};

	/**
	 * Returns the specified environment option.
	 * 
	 * @param {String} name The name of the environment option to set
	 * @returns {Any} The value of the environment option
	 */

	Environment.prototype.getOption = function (name) {
		return this._options[name];
	};

	/**
	 * Sets the default fragment delimiter of the environment.
	 * 
	 * @deprecated Use {@link Environment#setOption} with option "defaultFragmentDelimiter"
	 * @param {String} fd The fragment delimiter character
	 */

	Environment.prototype.setDefaultFragmentDelimiter = function (fd) {
		if (typeof fd === "string" && fd.length > 0) {
			this._options["defaultFragmentDelimiter"] = fd;
		}
	};

	/**
	 * Returns the default fragment delimiter of the environment.
	 * 
	 * @deprecated Use {@link Environment#getOption} with option "defaultFragmentDelimiter"
	 * @returns {String} The fragment delimiter character
	 */

	Environment.prototype.getDefaultFragmentDelimiter = function () {
		return this._options["defaultFragmentDelimiter"];
	};

	/**
	 * Sets the URI of the default schema for the environment.
	 * 
	 * @deprecated Use {@link Environment#setOption} with option "defaultSchemaURI"
	 * @param {String} uri The default schema URI
	 */

	Environment.prototype.setDefaultSchemaURI = function (uri) {
		if (typeof uri === "string") {
			this._options["defaultSchemaURI"] = formatURI(uri);
		}
	};

	/**
	 * Returns the default schema of the environment.
	 * 
	 * @returns {JSONSchema} The default schema
	 */

	Environment.prototype.getDefaultSchema = function () {
		return this.findSchema(this._options["defaultSchemaURI"]);
	};

	/**
	 * Validates both the provided schema and the provided instance, and returns a {@link Report}. 
	 * If the schema fails to validate, the instance will not be validated.
	 * 
	 * @param {JSONInstance|Any} instanceJSON The {@link JSONInstance} or JavaScript value to validate.
	 * @param {JSONSchema|Any} schemaJSON The {@link JSONSchema} or JavaScript value to use in the validation. This will also be validated againt the schema's schema.
	 * @returns {Report} The result of the validation
	 */

	Environment.prototype.validate = function (instanceJSON, schemaJSON) {
		var instance,
			schema,
			schemaSchema,
			report = new Report();

		try {
			instance = this.createInstance(instanceJSON);
			report.instance = instance;
		} catch (e) {
			report.addError(e.uri, e.schemaUri, e.attribute, e.message, e.details);
		}

		try {
			schema = this.createSchema(schemaJSON);
			report.schema = schema;

			schemaSchema = schema.getSchema();
			report.schemaSchema = schemaSchema;
		} catch (e) {
			report.addError(e.uri, e.schemaUri, e.attribute, e.message, e.details);
		}

		if (schemaSchema) {
			schemaSchema.validate(schema, report);
		}

		if (report.errors.length) {
			return report;
		}

		return schema.validate(instance, report);
	};

	/**
	 * @private
	 */

	Environment.prototype._checkForInvalidInstances = function (stackSize, schemaURI) {
		var result = [],
			stack = [
				[schemaURI, this._schemas[schemaURI]]
			], 
			counter = 0,
			item, uri, instance, schema, properties, key;

		while (counter++ < stackSize && stack.length) {
			item = stack.shift();
			uri = item[0];
			instance = item[1];

			if (instance instanceof JSONSchema) {
				if (this._schemas[instance._uri] !== instance) {
					result.push("Instance " + uri + " does not match " + instance._uri);
				} else {
					//schema = instance.getSchema();
					//stack.push([uri + "/{schema}", schema]);

					properties = instance.getAttributes();
					for (key in properties) {
						if (properties[key] !== O[key]) {
							stack.push([uri + "/" + escapeURIComponent(key), properties[key]]);
						}
					}
				}
			} else if (typeOf(instance) === "object") {
				properties = instance;
				for (key in properties) {
					if (properties.hasOwnProperty(key)) {
						stack.push([uri + "/" + escapeURIComponent(key), properties[key]]);
					}
				}
			} else if (typeOf(instance) === "array") {
				properties = instance;
				for (key = 0; key < properties.length; ++key) {
					stack.push([uri + "/" + escapeURIComponent(key), properties[key]]);
				}
			}
		}

		return result.length ? result : counter;
	};

	/**
	 * A globaly accessible object that provides the ability to create and manage {@link Environments},
	 * as well as providing utility methods.
	 * 
	 * @namespace
	 */

	JSV = {
		_environments : {},
		_defaultEnvironmentID : "",

		/**
		 * Returns if the provide value is an instance of {@link JSONInstance}.
		 * 
		 * @param o The value to test
		 * @returns {Boolean} If the provide value is an instance of {@link JSONInstance}
		 */

		isJSONInstance : function (o) {
			return o instanceof JSONInstance;
		},

		/**
		 * Returns if the provide value is an instance of {@link JSONSchema}.
		 * 
		 * @param o The value to test
		 * @returns {Boolean} If the provide value is an instance of {@link JSONSchema}
		 */

		isJSONSchema : function (o) {
			return o instanceof JSONSchema;
		},

		/**
		 * Creates and returns a new {@link Environment} that is a clone of the environment registered with the provided ID.
		 * If no environment ID is provided, the default environment is cloned.
		 * 
		 * @param {String} [id] The ID of the environment to clone. If <code>undefined</code>, the default environment ID is used.
		 * @returns {Environment} A newly cloned {@link Environment}
		 * @throws {Error} If there is no environment registered with the provided ID
		 */

		createEnvironment : function (id) {
			id = id || this._defaultEnvironmentID;

			if (!this._environments[id]) {
				throw new Error("Unknown Environment ID");
			}
			//else
			return this._environments[id].clone();
		},

		Environment : Environment,

		/**
		 * Registers the provided {@link Environment} with the provided ID.
		 * 
		 * @param {String} id The ID of the environment
		 * @param {Environment} env The environment to register
		 */

		registerEnvironment : function (id, env) {
			id = id || (env || 0)._id;
			if (id && !this._environments[id] && env instanceof Environment) {
				env._id = id;
				this._environments[id] = env;
			}
		},

		/**
		 * Sets which registered ID is the default environment.
		 * 
		 * @param {String} id The ID of the registered environment that is default
		 * @throws {Error} If there is no registered environment with the provided ID
		 */

		setDefaultEnvironmentID : function (id) {
			if (typeof id === "string") {
				if (!this._environments[id]) {
					throw new Error("Unknown Environment ID");
				}

				this._defaultEnvironmentID = id;
			}
		},

		/**
		 * Returns the ID of the default environment.
		 * 
		 * @returns {String} The ID of the default environment
		 */

		getDefaultEnvironmentID : function () {
			return this._defaultEnvironmentID;
		},

		//
		// Utility Functions
		//

		/**
		 * Returns the name of the type of the provided value.
		 *
		 * @event //utility
		 * @param {Any} o The value to determine the type of
		 * @returns {String} The name of the type of the value
		 */
		typeOf : typeOf,

		/**
		 * Return a new object that inherits all of the properties of the provided object.
		 *
		 * @event //utility
		 * @param {Object} proto The prototype of the new object
		 * @returns {Object} A new object that inherits all of the properties of the provided object
		 */
		createObject : createObject,

		/**
		 * Returns a new object with each property transformed by the iterator.
		 *
		 * @event //utility
		 * @param {Object} obj The object to transform
		 * @param {Function} iterator A function that returns the new value of the provided property
		 * @param {Object} [scope] The value of <code>this</code> in the iterator
		 * @returns {Object} A new object with each property transformed
		 */
		mapObject : mapObject,

		/**
		 * Returns a new array with each item transformed by the iterator.
		 * 
		 * @event //utility
		 * @param {Array} arr The array to transform
		 * @param {Function} iterator A function that returns the new value of the provided item
		 * @param {Object} scope The value of <code>this</code> in the iterator
		 * @returns {Array} A new array with each item transformed
		 */
		mapArray : mapArray,

		/**
		 * Returns a new array that only contains the items allowed by the iterator.
		 *
		 * @event //utility
		 * @param {Array} arr The array to filter
		 * @param {Function} iterator The function that returns true if the provided property should be added to the array
		 * @param {Object} scope The value of <code>this</code> within the iterator
		 * @returns {Array} A new array that contains the items allowed by the iterator
		 */
		filterArray : filterArray,

		/**
		 * Returns the first index in the array that the provided item is located at.
		 *
		 * @event //utility
		 * @param {Array} arr The array to search
		 * @param {Any} o The item being searched for
		 * @returns {Number} The index of the item in the array, or <code>-1</code> if not found
		 */
		searchArray : searchArray,

		/**
		 * Returns an array representation of a value.
		 * <ul>
		 * <li>For array-like objects, the value will be casted as an Array type.</li>
		 * <li>If an array is provided, the function will simply return the same array.</li>
		 * <li>For a null or undefined value, the result will be an empty Array.</li>
		 * <li>For all other values, the value will be the first element in a new Array. </li>
		 * </ul>
		 *
		 * @event //utility
		 * @param {Any} o The value to convert into an array
		 * @returns {Array} The value as an array
		 */
		toArray : toArray,

		/**
		 * Returns an array of the names of all properties of an object.
		 * 
		 * @event //utility
		 * @param {Object|Array} o The object in question
		 * @returns {Array} The names of all properties
		 */
		keys : keys,

		/**
		 * Mutates the array by pushing the provided value onto the array only if it is not already there.
		 *
		 * @event //utility
		 * @param {Array} arr The array to modify
		 * @param {Any} o The object to add to the array if it is not already there
		 * @returns {Array} The provided array for chaining
		 */
		pushUnique : pushUnique,

		/**
		 * Mutates the array by removing the first item that matches the provided value in the array.
		 *
		 * @event //utility
		 * @param {Array} arr The array to modify
		 * @param {Any} o The object to remove from the array
		 * @returns {Array} The provided array for chaining
		 */
		popFirst : popFirst,

		/**
		 * Creates a copy of the target object.
		 * <p>
		 * This method will create a new instance of the target, and then mixin the properties of the target.
		 * If <code>deep</code> is <code>true</code>, then each property will be cloned before mixin.
		 * </p>
		 * <p><b>Warning</b>: This is not a generic clone function, as it will only properly clone objects and arrays.</p>
		 * 
		 * @event //utility
		 * @param {Any} o The value to clone 
		 * @param {Boolean} [deep=false] If each property should be recursively cloned
		 * @returns A cloned copy of the provided value
		 */
		clone : clone,

		/**
		 * Generates a pseudo-random UUID.
		 * 
		 * @event //utility
		 * @returns {String} A new universally unique ID
		 */
		randomUUID : randomUUID,

		/**
		 * Properly escapes a URI component for embedding into a URI string.
		 * 
		 * @event //utility
		 * @param {String} str The URI component to escape
		 * @returns {String} The escaped URI component
		 */
		escapeURIComponent : escapeURIComponent,

		/**
		 * Returns a URI that is formated for JSV. Currently, this only ensures that the URI ends with a hash tag (<code>#</code>).
		 * 
		 * @event //utility
		 * @param {String} uri The URI to format
		 * @returns {String} The URI formatted for JSV
		 */
		formatURI : formatURI,

		/**
		 * Merges two schemas/instance together.
		 * 
		 * @event //utility
		 * @param {JSONSchema|Any} base The old value to merge
		 * @param {JSONSchema|Any} extra The new value to merge
		 * @param {Boolean} extension If the merge is a JSON Schema extension
		 * @return {Any} The modified base value
		 */

		inherits : inherits
	};

	this.JSV = JSV;  //set global object
	exports.JSV = JSV;  //export to CommonJS

	require("./environments");  //load default environments

}());





/**
 * json-schema-draft-03 Environment
 * 
 * @fileOverview Implementation of the third revision of the JSON Schema specification draft.
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @version 1.3
 * @see http://github.com/garycourt/JSV
 */

/*
 * Copyright 2010 Gary Court. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 * 
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 * 
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY GARY COURT ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GARY COURT OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * The views and conclusions contained in the software and documentation are those of the
 * authors and should not be interpreted as representing official policies, either expressed
 * or implied, of Gary Court or the JSON Schema specification.
 */

/*jslint white: true, sub: true, onevar: true, undef: true, eqeqeq: true, newcap: true, immed: true, indent: 4 */
/*global require */

(function () {
	var O = {},
		JSV = require('./jsv').JSV,
		InitializationError,
		TYPE_VALIDATORS,
		ENVIRONMENT,
		SCHEMA_00_JSON,
		HYPERSCHEMA_00_JSON,
		LINKS_00_JSON, 
		SCHEMA_00,
		HYPERSCHEMA_00,
		LINKS_00, 
		SCHEMA_01_JSON,
		HYPERSCHEMA_01_JSON,
		LINKS_01_JSON, 
		SCHEMA_01,
		HYPERSCHEMA_01,
		LINKS_01, 
		SCHEMA_02_JSON,
		HYPERSCHEMA_02_JSON,
		LINKS_02_JSON,
		SCHEMA_02,
		HYPERSCHEMA_02,
		LINKS_02, 
		SCHEMA_03_JSON,
		HYPERSCHEMA_03_JSON,
		LINKS_03_JSON,
		SCHEMA_03,
		HYPERSCHEMA_03,
		LINKS_03;

	InitializationError = function InitializationError(instance, schema, attr, message, details) {
		Error.call(this, message);

		this.uri = instance.getURI();
		this.schemaUri = schema.getURI();
		this.attribute = attr;
		this.message = message;
		this.description = message;  //IE
		this.details = details;
	}
	InitializationError.prototype = new Error();
	InitializationError.prototype.constructor = InitializationError;
	InitializationError.prototype.name = "InitializationError";

	TYPE_VALIDATORS = {
		"string" : function (instance, report) {
			return instance.getType() === "string";
		},

		"number" : function (instance, report) {
			return instance.getType() === "number";
		},

		"integer" : function (instance, report) {
			return instance.getType() === "number" && instance.getValue() % 1 === 0;
		},

		"boolean" : function (instance, report) {
			return instance.getType() === "boolean";
		},

		"object" : function (instance, report) {
			return instance.getType() === "object";
		},

		"array" : function (instance, report) {
			return instance.getType() === "array";
		},

		"null" : function (instance, report) {
			return instance.getType() === "null";
		},

		"any" : function (instance, report) {
			return true;
		}
	};

	ENVIRONMENT = new JSV.Environment();
	ENVIRONMENT.setOption("strict", false);
	ENVIRONMENT.setOption("validateReferences", false);  //updated later

	//
	// draft-00
	//

	SCHEMA_00_JSON = {
		"$schema" : "http://json-schema.org/draft-00/hyper-schema#",
		"id" : "http://json-schema.org/draft-00/schema#",
		"type" : "object",

		"properties" : {
			"type" : {
				"type" : ["string", "array"],
				"items" : {
					"type" : ["string", {"$ref" : "#"}]
				},
				"optional" : true,
				"uniqueItems" : true,
				"default" : "any",

				"parser" : function (instance, self) {
					var parser;

					if (instance.getType() === "string") {
						return instance.getValue();
					} else if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(
							instance, 
							self.getEnvironment().findSchema(self.resolveURI("#"))
						);
					} else if (instance.getType() === "array") {
						parser = self.getValueOfProperty("parser");
						return JSV.mapArray(instance.getProperties(), function (prop) {
							return parser(prop, self);
						});
					}
					//else
					return "any";
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var requiredTypes = JSV.toArray(schema.getAttribute("type")),
						x, xl, type, subreport, typeValidators;

					//for instances that are required to be a certain type
					if (instance.getType() !== "undefined" && requiredTypes && requiredTypes.length) {
						typeValidators = self.getValueOfProperty("typeValidators") || {};

						//ensure that type matches for at least one of the required types
						for (x = 0, xl = requiredTypes.length; x < xl; ++x) {
							type = requiredTypes[x];
							if (JSV.isJSONSchema(type)) {
								subreport = JSV.createObject(report);
								subreport.errors = [];
								subreport.validated = JSV.clone(report.validated);
								if (type.validate(instance, subreport, parent, parentSchema, name).errors.length === 0) {
									return true;  //instance matches this schema
								}
							} else {
								if (typeValidators[type] !== O[type] && typeof typeValidators[type] === "function") {
									if (typeValidators[type](instance, report)) {
										return true;  //type is valid
									}
								} else {
									return true;  //unknown types are assumed valid
								}
							}
						}

						//if we get to this point, type is invalid
						report.addError(instance, schema, "type", "Instance is not a required type", requiredTypes);
						return false;
					}
					//else, anything is allowed if no type is specified
					return true;
				},

				"typeValidators" : TYPE_VALIDATORS
			},

			"properties" : {
				"type" : "object",
				"additionalProperties" : {"$ref" : "#"},
				"optional" : true,
				"default" : {},

				"parser" : function (instance, self, arg) {
					var env = instance.getEnvironment(),
						selfEnv = self.getEnvironment();
					if (instance.getType() === "object") {
						if (arg) {
							return env.createSchema(instance.getProperty(arg), selfEnv.findSchema(self.resolveURI("#")));
						} else {
							return JSV.mapObject(instance.getProperties(), function (instance) {
								return env.createSchema(instance, selfEnv.findSchema(self.resolveURI("#")));
							});
						}
					}
					//else
					return {};
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var propertySchemas, key;
					//this attribute is for object type instances only
					if (instance.getType() === "object") {
						//for each property defined in the schema
						propertySchemas = schema.getAttribute("properties");
						for (key in propertySchemas) {
							if (propertySchemas[key] !== O[key] && propertySchemas[key]) {
								//ensure that instance property is valid
								propertySchemas[key].validate(instance.getProperty(key), report, instance, schema, key);
							}
						}
					}
				}
			},

			"items" : {
				"type" : [{"$ref" : "#"}, "array"],
				"items" : {"$ref" : "#"},
				"optional" : true,
				"default" : {},

				"parser" : function (instance, self) {
					if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					} else if (instance.getType() === "array") {
						return JSV.mapArray(instance.getProperties(), function (instance) {
							return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
						});
					}
					//else
					return instance.getEnvironment().createEmptySchema();
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var properties, items, x, xl, itemSchema, additionalProperties;

					if (instance.getType() === "array") {
						properties = instance.getProperties();
						items = schema.getAttribute("items");
						additionalProperties = schema.getAttribute("additionalProperties");

						if (JSV.typeOf(items) === "array") {
							for (x = 0, xl = properties.length; x < xl; ++x) {
								itemSchema = items[x] || additionalProperties;
								if (itemSchema !== false) {
									itemSchema.validate(properties[x], report, instance, schema, x);
								} else {
									report.addError(instance, schema, "additionalProperties", "Additional items are not allowed", itemSchema);
								}
							}
						} else {
							itemSchema = items || additionalProperties;
							for (x = 0, xl = properties.length; x < xl; ++x) {
								itemSchema.validate(properties[x], report, instance, schema, x);
							}
						}
					}
				}
			},

			"optional" : {
				"type" : "boolean",
				"optional" : true,
				"default" : false,

				"parser" : function (instance, self) {
					return !!instance.getValue();
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					if (instance.getType() === "undefined" && !schema.getAttribute("optional")) {
						report.addError(instance, schema, "optional", "Property is required", false);
					}
				},

				"validationRequired" : true
			},

			"additionalProperties" : {
				"type" : [{"$ref" : "#"}, "boolean"],
				"optional" : true,
				"default" : {},

				"parser" : function (instance, self) {
					if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					} else if (instance.getType() === "boolean" && instance.getValue() === false) {
						return false;
					}
					//else
					return instance.getEnvironment().createEmptySchema();
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var additionalProperties, propertySchemas, properties, key;
					//we only need to check against object types as arrays do their own checking on this property
					if (instance.getType() === "object") {
						additionalProperties = schema.getAttribute("additionalProperties");
						propertySchemas = schema.getAttribute("properties") || {};
						properties = instance.getProperties();
						for (key in properties) {
							if (properties[key] !== O[key] && properties[key] && propertySchemas[key] === O[key]) {
								if (JSV.isJSONSchema(additionalProperties)) {
									additionalProperties.validate(properties[key], report, instance, schema, key);
								} else if (additionalProperties === false) {
									report.addError(instance, schema, "additionalProperties", "Additional properties are not allowed", additionalProperties);
								}
							}
						}
					}
				}
			},

			"requires" : {
				"type" : ["string", {"$ref" : "#"}],
				"optional" : true,

				"parser" : function (instance, self) {
					if (instance.getType() === "string") {
						return instance.getValue();
					} else if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					}
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var requires;
					if (instance.getType() !== "undefined" && parent && parent.getType() !== "undefined") {
						requires = schema.getAttribute("requires");
						if (typeof requires === "string") {
							if (parent.getProperty(requires).getType() === "undefined") {
								report.addError(instance, schema, "requires", 'Property requires sibling property "' + requires + '"', requires);
							}
						} else if (JSV.isJSONSchema(requires)) {
							requires.validate(parent, report);  //WATCH: A "requires" schema does not support the "requires" attribute
						}
					}
				}
			},

			"minimum" : {
				"type" : "number",
				"optional" : true,

				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var minimum, minimumCanEqual;
					if (instance.getType() === "number") {
						minimum = schema.getAttribute("minimum");
						minimumCanEqual = schema.getAttribute("minimumCanEqual");
						if (typeof minimum === "number" && (instance.getValue() < minimum || (minimumCanEqual === false && instance.getValue() === minimum))) {
							report.addError(instance, schema, "minimum", "Number is less then the required minimum value", minimum);
						}
					}
				}
			},

			"maximum" : {
				"type" : "number",
				"optional" : true,

				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maximum, maximumCanEqual;
					if (instance.getType() === "number") {
						maximum = schema.getAttribute("maximum");
						maximumCanEqual = schema.getAttribute("maximumCanEqual");
						if (typeof maximum === "number" && (instance.getValue() > maximum || (maximumCanEqual === false && instance.getValue() === maximum))) {
							report.addError(instance, schema, "maximum", "Number is greater then the required maximum value", maximum);
						}
					}
				}
			},

			"minimumCanEqual" : {
				"type" : "boolean",
				"optional" : true,
				"requires" : "minimum",
				"default" : true,

				"parser" : function (instance, self) {
					if (instance.getType() === "boolean") {
						return instance.getValue();
					}
					//else
					return true;
				}
			},

			"maximumCanEqual" : {
				"type" : "boolean",
				"optional" : true,
				"requires" : "maximum",
				"default" : true,

				"parser" : function (instance, self) {
					if (instance.getType() === "boolean") {
						return instance.getValue();
					}
					//else
					return true;
				}
			},

			"minItems" : {
				"type" : "integer",
				"optional" : true,
				"minimum" : 0,
				"default" : 0,

				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
					//else
					return 0;
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var minItems;
					if (instance.getType() === "array") {
						minItems = schema.getAttribute("minItems");
						if (typeof minItems === "number" && instance.getProperties().length < minItems) {
							report.addError(instance, schema, "minItems", "The number of items is less then the required minimum", minItems);
						}
					}
				}
			},

			"maxItems" : {
				"type" : "integer",
				"optional" : true,
				"minimum" : 0,

				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maxItems;
					if (instance.getType() === "array") {
						maxItems = schema.getAttribute("maxItems");
						if (typeof maxItems === "number" && instance.getProperties().length > maxItems) {
							report.addError(instance, schema, "maxItems", "The number of items is greater then the required maximum", maxItems);
						}
					}
				}
			},

			"pattern" : {
				"type" : "string",
				"optional" : true,
				"format" : "regex",

				"parser" : function (instance, self) {
					if (instance.getType() === "string") {
						try {
							return new RegExp(instance.getValue());
						} catch (e) {
							return e;
						}
					}
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var pattern;
					try {
						pattern = schema.getAttribute("pattern");
						if (pattern instanceof Error) {
							report.addError(schema, self, "pattern", "Invalid pattern", schema.getValueOfProperty("pattern"));
						} else if (instance.getType() === "string" && pattern && !pattern.test(instance.getValue())) {
							report.addError(instance, schema, "pattern", "String does not match pattern", pattern.toString());
						}
					} catch (e) {
						report.addError(schema, self, "pattern", "Invalid pattern", schema.getValueOfProperty("pattern"));
					}
				}
			},

			"minLength" : {
				"type" : "integer",
				"optional" : true,
				"minimum" : 0,
				"default" : 0,

				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
					//else
					return 0;
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var minLength;
					if (instance.getType() === "string") {
						minLength = schema.getAttribute("minLength");
						if (typeof minLength === "number" && instance.getValue().length < minLength) {
							report.addError(instance, schema, "minLength", "String is less then the required minimum length", minLength);
						}
					}
				}
			},

			"maxLength" : {
				"type" : "integer",
				"optional" : true,

				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maxLength;
					if (instance.getType() === "string") {
						maxLength = schema.getAttribute("maxLength");
						if (typeof maxLength === "number" && instance.getValue().length > maxLength) {
							report.addError(instance, schema, "maxLength", "String is greater then the required maximum length", maxLength);
						}
					}
				}
			},

			"enum" : {
				"type" : "array",
				"optional" : true,
				"minItems" : 1,
				"uniqueItems" : true,

				"parser" : function (instance, self) {
					if (instance.getType() === "array") {
						return instance.getValue();
					}
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var enums, x, xl;
					if (instance.getType() !== "undefined") {
						enums = schema.getAttribute("enum");
						if (enums) {
							for (x = 0, xl = enums.length; x < xl; ++x) {
								if (instance.equals(enums[x])) {
									return true;
								}
							}
							report.addError(instance, schema, "enum", "Instance is not one of the possible values", enums);
						}
					}
				}
			},

			"title" : {
				"type" : "string",
				"optional" : true
			},

			"description" : {
				"type" : "string",
				"optional" : true
			},

			"format" : {
				"type" : "string",
				"optional" : true,

				"parser" : function (instance, self) {
					if (instance.getType() === "string") {
						return instance.getValue();
					}
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var format, formatValidators;
					if (instance.getType() === "string") {
						format = schema.getAttribute("format");
						formatValidators = self.getValueOfProperty("formatValidators");
						if (typeof format === "string" && formatValidators[format] !== O[format] && typeof formatValidators[format] === "function" && !formatValidators[format].call(this, instance, report)) {
							report.addError(instance, schema, "format", "String is not in the required format", format);
						}
					}
				},

				"formatValidators" : {}
			},

			"contentEncoding" : {
				"type" : "string",
				"optional" : true
			},

			"default" : {
				"type" : "any",
				"optional" : true
			},

			"maxDecimal" : {
				"type" : "integer",
				"optional" : true,
				"minimum" : 0,

				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maxDecimal, decimals;
					if (instance.getType() === "number") {
						maxDecimal = schema.getAttribute("maxDecimal");
						if (typeof maxDecimal === "number") {
							decimals = instance.getValue().toString(10).split('.')[1];
							if (decimals && decimals.length > maxDecimal) {
								report.addError(instance, schema, "maxDecimal", "The number of decimal places is greater then the allowed maximum", maxDecimal);
							}
						}
					}
				}
			},

			"disallow" : {
				"type" : ["string", "array"],
				"items" : {"type" : "string"},
				"optional" : true,
				"uniqueItems" : true,

				"parser" : function (instance, self) {
					if (instance.getType() === "string" || instance.getType() === "array") {
						return instance.getValue();
					}
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var disallowedTypes = JSV.toArray(schema.getAttribute("disallow")),
						x, xl, key, typeValidators, subreport;

					//for instances that are required to be a certain type
					if (instance.getType() !== "undefined" && disallowedTypes && disallowedTypes.length) {
						typeValidators = self.getValueOfProperty("typeValidators") || {};

						//ensure that type matches for at least one of the required types
						for (x = 0, xl = disallowedTypes.length; x < xl; ++x) {
							key = disallowedTypes[x];
							if (JSV.isJSONSchema(key)) {  //this is supported draft-03 and on
								subreport = JSV.createObject(report);
								subreport.errors = [];
								subreport.validated = JSV.clone(report.validated);
								if (key.validate(instance, subreport, parent, parentSchema, name).errors.length === 0) {
									//instance matches this schema
									report.addError(instance, schema, "disallow", "Instance is a disallowed type", disallowedTypes);
									return false;  
								}
							} else if (typeValidators[key] !== O[key] && typeof typeValidators[key] === "function") {
								if (typeValidators[key](instance, report)) {
									report.addError(instance, schema, "disallow", "Instance is a disallowed type", disallowedTypes);
									return false;
								}
							} 
							/*
							else {
								report.addError(instance, schema, "disallow", "Instance may be a disallowed type", disallowedTypes);
								return false;
							}
							*/
						}

						//if we get to this point, type is valid
						return true;
					}
					//else, everything is allowed if no disallowed types are specified
					return true;
				},

				"typeValidators" : TYPE_VALIDATORS
			},

			"extends" : {
				"type" : [{"$ref" : "#"}, "array"],
				"items" : {"$ref" : "#"},
				"optional" : true,
				"default" : {},

				"parser" : function (instance, self) {
					if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					} else if (instance.getType() === "array") {
						return JSV.mapArray(instance.getProperties(), function (instance) {
							return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
						});
					}
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var extensions = schema.getAttribute("extends"), x, xl;
					if (extensions) {
						if (JSV.isJSONSchema(extensions)) {
							extensions.validate(instance, report, parent, parentSchema, name);
						} else if (JSV.typeOf(extensions) === "array") {
							for (x = 0, xl = extensions.length; x < xl; ++x) {
								extensions[x].validate(instance, report, parent, parentSchema, name);
							}
						}
					}
				}
			}
		},

		"optional" : true,
		"default" : {},
		"fragmentResolution" : "dot-delimited",

		"parser" : function (instance, self) {
			if (instance.getType() === "object") {
				return instance.getEnvironment().createSchema(instance, self);
			}
		},

		"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
			var propNames = schema.getPropertyNames(), 
				x, xl,
				attributeSchemas = self.getAttribute("properties"),
				strict = instance.getEnvironment().getOption("strict"),
				validator;

			for (x in attributeSchemas) {
				if (attributeSchemas[x] !== O[x]) {
					if (attributeSchemas[x].getValueOfProperty("validationRequired")) {
						JSV.pushUnique(propNames, x);
					}
					if (strict && attributeSchemas[x].getValueOfProperty("deprecated")) {
						JSV.popFirst(propNames, x);
					}
				}
			}

			for (x = 0, xl = propNames.length; x < xl; ++x) {
				if (attributeSchemas[propNames[x]] !== O[propNames[x]]) {
					validator = attributeSchemas[propNames[x]].getValueOfProperty("validator");
					if (typeof validator === "function") {
						validator(instance, schema, attributeSchemas[propNames[x]], report, parent, parentSchema, name);
					}
				}
			}
		}
	};

	HYPERSCHEMA_00_JSON = {
		"$schema" : "http://json-schema.org/draft-00/hyper-schema#",
		"id" : "http://json-schema.org/draft-00/hyper-schema#",

		"properties" : {
			"links" : {
				"type" : "array",
				"items" : {"$ref" : "links#"},
				"optional" : true,

				"parser" : function (instance, self, arg) {
					var links,
						linkSchemaURI = self.getValueOfProperty("items")["$ref"],
						linkSchema = self.getEnvironment().findSchema(linkSchemaURI),
						linkParser = linkSchema && linkSchema.getValueOfProperty("parser"),
						selfReferenceVariable;
					arg = JSV.toArray(arg);

					if (typeof linkParser === "function") {
						links = JSV.mapArray(instance.getProperties(), function (link) {
							return linkParser(link, linkSchema);
						});
					} else {
						links = JSV.toArray(instance.getValue());
					}

					if (arg[0]) {
						links = JSV.filterArray(links, function (link) {
							return link["rel"] === arg[0];
						});
					}

					if (arg[1]) {
						selfReferenceVariable = self.getValueOfProperty("selfReferenceVariable");
						links = JSV.mapArray(links, function (link) {
							var instance = arg[1],
								href = link["href"];
							href = href.replace(/\{(.+)\}/g, function (str, p1, offset, s) {
								var value; 
								if (p1 === selfReferenceVariable) {
									value = instance.getValue();
								} else {
									value = instance.getValueOfProperty(p1);
								}
								return value !== undefined ? String(value) : "";
							});
							return href ? JSV.formatURI(instance.resolveURI(href)) : href;
						});
					}

					return links;
				},

				"selfReferenceVariable" : "-this"
			},

			"fragmentResolution" : {
				"type" : "string",
				"optional" : true,
				"default" : "dot-delimited"
			},

			"root" : {
				"type" : "boolean",
				"optional" : true,
				"default" : false
			},

			"readonly" : {
				"type" : "boolean",
				"optional" : true,
				"default" : false
			},

			"pathStart" : {
				"type" : "string",
				"optional" : true,
				"format" : "uri",

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var pathStart;
					if (instance.getType() !== "undefined") {
						pathStart = schema.getAttribute("pathStart");
						if (typeof pathStart === "string") {
							//TODO: Find out what pathStart is relative to
							if (instance.getURI().indexOf(pathStart) !== 0) {
								report.addError(instance, schema, "pathStart", "Instance's URI does not start with " + pathStart, pathStart);
							}
						}
					}
				}
			},

			"mediaType" : {
				"type" : "string",
				"optional" : true,
				"format" : "media-type"
			},

			"alternate" : {
				"type" : "array",
				"items" : {"$ref" : "#"},
				"optional" : true
			}
		},

		"links" : [
			{
				"href" : "{$ref}",
				"rel" : "full"
			},

			{
				"href" : "{$schema}",
				"rel" : "describedby"
			},

			{
				"href" : "{id}",
				"rel" : "self"
			}
		],

		"initializer" : function (instance) {
			var link, extension, extended;

			//if there is a link to a different schema, update instance
			link = instance._schema.getLink("describedby", instance);
			if (link && instance._schema._uri !== link) {
				if (instance._env._schemas[link]) {
					instance._schema = instance._env._schemas[link];
					initializer = instance._schema.getValueOfProperty("initializer");
					if (typeof initializer === "function") {
						return initializer(instance);  //this function will finish initialization
					} else {
						return instance;  //no further initialization
					}
				} else if (instance._env._options["validateReferences"]) {
					throw new InitializationError(instance, instance._schema, "{link:describedby}", "Unknown schema reference", link);
				}
			}

			//if there is a link to the full representation, replace instance
			link = instance._schema.getLink("full", instance);
			if (link && instance._uri !== link) {
				if (instance._env._schemas[link]) {
					instance = instance._env._schemas[link];
					return instance;  //retrieved schemas are guaranteed to be initialized
				} else if (instance._env._options["validateReferences"]) {
					throw new InitializationError(instance, instance._schema, "{link:full}", "Unknown schema reference", link);
				}
			}

			//extend schema
			extension = instance.getAttribute("extends");
			if (JSV.isJSONSchema(extension)) {
				extended = JSV.inherits(extension, instance, true);
				instance = instance._env.createSchema(extended, instance._schema, instance._uri);
			}

			//if instance has a URI link to itself, update it's own URI
			link = instance._schema.getLink("self", instance);
			if (JSV.typeOf(link) === "string") {
				instance._uri = JSV.formatURI(link);
			}

			return instance;
		}

		//not needed as JSV.inherits does the job for us
		//"extends" : {"$ref" : "http://json-schema.org/schema#"}
	};

	LINKS_00_JSON = {
		"$schema" : "http://json-schema.org/draft-00/hyper-schema#",
		"id" : "http://json-schema.org/draft-00/links#",
		"type" : "object",

		"properties" : {
			"href" : {
				"type" : "string"
			},

			"rel" : {
				"type" : "string"
			},

			"method" : {
				"type" : "string",
				"default" : "GET",
				"optional" : true
			},

			"enctype" : {
				"type" : "string",
				"requires" : "method",
				"optional" : true
			},

			"properties" : {
				"type" : "object",
				"additionalProperties" : {"$ref" : "hyper-schema#"},
				"optional" : true,

				"parser" : function (instance, self, arg) {
					var env = instance.getEnvironment(),
						selfEnv = self.getEnvironment(),
						additionalPropertiesSchemaURI = self.getValueOfProperty("additionalProperties")["$ref"];
					if (instance.getType() === "object") {
						if (arg) {
							return env.createSchema(instance.getProperty(arg), selfEnv.findSchema(self.resolveURI(additionalPropertiesSchemaURI)));
						} else {
							return JSV.mapObject(instance.getProperties(), function (instance) {
								return env.createSchema(instance, selfEnv.findSchema(self.resolveURI(additionalPropertiesSchemaURI)));
							});
						}
					}
				}
			}
		},

		"parser" : function (instance, self) {
			var selfProperties = self.getProperty("properties");
			if (instance.getType() === "object") {
				return JSV.mapObject(instance.getProperties(), function (property, key) {
					var propertySchema = selfProperties.getProperty(key),
						parser = propertySchema && propertySchema.getValueOfProperty("parser");
					if (typeof parser === "function") {
						return parser(property, propertySchema);
					}
					//else
					return property.getValue();
				});
			}
			return instance.getValue();
		}
	};

	ENVIRONMENT.setOption("defaultFragmentDelimiter", ".");
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-00/schema#");  //updated later

	SCHEMA_00 = ENVIRONMENT.createSchema(SCHEMA_00_JSON, true, "http://json-schema.org/draft-00/schema#");
	HYPERSCHEMA_00 = ENVIRONMENT.createSchema(JSV.inherits(SCHEMA_00, ENVIRONMENT.createSchema(HYPERSCHEMA_00_JSON, true, "http://json-schema.org/draft-00/hyper-schema#"), true), true, "http://json-schema.org/draft-00/hyper-schema#");

	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-00/hyper-schema#");

	LINKS_00 = ENVIRONMENT.createSchema(LINKS_00_JSON, HYPERSCHEMA_00, "http://json-schema.org/draft-00/links#");

	//We need to reinitialize these 3 schemas as they all reference each other
	SCHEMA_00 = ENVIRONMENT.createSchema(SCHEMA_00.getValue(), HYPERSCHEMA_00, "http://json-schema.org/draft-00/schema#");
	HYPERSCHEMA_00 = ENVIRONMENT.createSchema(HYPERSCHEMA_00.getValue(), HYPERSCHEMA_00, "http://json-schema.org/draft-00/hyper-schema#");
	LINKS_00 = ENVIRONMENT.createSchema(LINKS_00.getValue(), HYPERSCHEMA_00, "http://json-schema.org/draft-00/links#");

	//
	// draft-01
	//

	SCHEMA_01_JSON = JSV.inherits(SCHEMA_00_JSON, {
		"$schema" : "http://json-schema.org/draft-01/hyper-schema#",
		"id" : "http://json-schema.org/draft-01/schema#"
	});

	HYPERSCHEMA_01_JSON = JSV.inherits(HYPERSCHEMA_00_JSON, {
		"$schema" : "http://json-schema.org/draft-01/hyper-schema#",
		"id" : "http://json-schema.org/draft-01/hyper-schema#"
	});

	LINKS_01_JSON = JSV.inherits(LINKS_00_JSON, {
		"$schema" : "http://json-schema.org/draft-01/hyper-schema#",
		"id" : "http://json-schema.org/draft-01/links#"
	});

	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-01/schema#");  //update later

	SCHEMA_01 = ENVIRONMENT.createSchema(SCHEMA_01_JSON, true, "http://json-schema.org/draft-01/schema#");
	HYPERSCHEMA_01 = ENVIRONMENT.createSchema(JSV.inherits(SCHEMA_01, ENVIRONMENT.createSchema(HYPERSCHEMA_01_JSON, true, "http://json-schema.org/draft-01/hyper-schema#"), true), true, "http://json-schema.org/draft-01/hyper-schema#");

	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-01/hyper-schema#");

	LINKS_01 = ENVIRONMENT.createSchema(LINKS_01_JSON, HYPERSCHEMA_01, "http://json-schema.org/draft-01/links#");

	//We need to reinitialize these 3 schemas as they all reference each other
	SCHEMA_01 = ENVIRONMENT.createSchema(SCHEMA_01.getValue(), HYPERSCHEMA_01, "http://json-schema.org/draft-01/schema#");
	HYPERSCHEMA_01 = ENVIRONMENT.createSchema(HYPERSCHEMA_01.getValue(), HYPERSCHEMA_01, "http://json-schema.org/draft-01/hyper-schema#");
	LINKS_01 = ENVIRONMENT.createSchema(LINKS_01.getValue(), HYPERSCHEMA_01, "http://json-schema.org/draft-01/links#");

	//
	// draft-02
	//

	SCHEMA_02_JSON = JSV.inherits(SCHEMA_01_JSON, {
		"$schema" : "http://json-schema.org/draft-02/hyper-schema#",
		"id" : "http://json-schema.org/draft-02/schema#",

		"properties" : {
			"uniqueItems" : {
				"type" : "boolean",
				"optional" : true,
				"default" : false,

				"parser" : function (instance, self) {
					return !!instance.getValue();
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var value, x, xl, y, yl;
					if (instance.getType() === "array" && schema.getAttribute("uniqueItems")) {
						value = instance.getProperties();
						for (x = 0, xl = value.length - 1; x < xl; ++x) {
							for (y = x + 1, yl = value.length; y < yl; ++y) {
								if (value[x].equals(value[y])) {
									report.addError(instance, schema, "uniqueItems", "Array can only contain unique items", { x : x, y : y });
								}
							}
						}
					}
				}
			},

			"maxDecimal" : {
				"deprecated" : true
			},

			"divisibleBy" : {
				"type" : "number",
				"minimum" : 0,
				"minimumCanEqual" : false,
				"optional" : true,

				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var divisor;
					if (instance.getType() === "number") {
						divisor = schema.getAttribute("divisibleBy");
						if (divisor === 0) {
							report.addError(instance, schema, "divisibleBy", "Nothing is divisible by 0", divisor);
						} else if (divisor !== 1 && ((instance.getValue() / divisor) % 1) !== 0) {
							report.addError(instance, schema, "divisibleBy", "Number is not divisible by " + divisor, divisor);
						}
					}
				}
			}
		},

		"fragmentResolution" : "slash-delimited"
	});

	HYPERSCHEMA_02_JSON = JSV.inherits(HYPERSCHEMA_01_JSON, {
		"id" : "http://json-schema.org/draft-02/hyper-schema#",

		"properties" : {
			"fragmentResolution" : {
				"default" : "slash-delimited"
			}
		}
	});

	LINKS_02_JSON = JSV.inherits(LINKS_01_JSON, {
		"$schema" : "http://json-schema.org/draft-02/hyper-schema#",
		"id" : "http://json-schema.org/draft-02/links#",

		"properties" : {
			"targetSchema" : {
				"$ref" : "hyper-schema#",

				//need this here because parsers are run before links are resolved
				"parser" : HYPERSCHEMA_01.getAttribute("parser")
			}
		}
	});

	ENVIRONMENT.setOption("defaultFragmentDelimiter", "/");
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-02/schema#");  //update later

	SCHEMA_02 = ENVIRONMENT.createSchema(SCHEMA_02_JSON, true, "http://json-schema.org/draft-02/schema#");
	HYPERSCHEMA_02 = ENVIRONMENT.createSchema(JSV.inherits(SCHEMA_02, ENVIRONMENT.createSchema(HYPERSCHEMA_02_JSON, true, "http://json-schema.org/draft-02/hyper-schema#"), true), true, "http://json-schema.org/draft-02/hyper-schema#");

	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-02/hyper-schema#");

	LINKS_02 = ENVIRONMENT.createSchema(LINKS_02_JSON, HYPERSCHEMA_02, "http://json-schema.org/draft-02/links#");

	//We need to reinitialize these 3 schemas as they all reference each other
	SCHEMA_02 = ENVIRONMENT.createSchema(SCHEMA_02.getValue(), HYPERSCHEMA_02, "http://json-schema.org/draft-02/schema#");
	HYPERSCHEMA_02 = ENVIRONMENT.createSchema(HYPERSCHEMA_02.getValue(), HYPERSCHEMA_02, "http://json-schema.org/draft-02/hyper-schema#");
	LINKS_02 = ENVIRONMENT.createSchema(LINKS_02.getValue(), HYPERSCHEMA_02, "http://json-schema.org/draft-02/links#");

	//
	// draft-03
	//

	function getMatchedPatternProperties(instance, schema, report, self) {
		var matchedProperties = {}, patternProperties, pattern, regexp, properties, key;

		if (instance.getType() === "object") {
			patternProperties = schema.getAttribute("patternProperties");
			properties = instance.getProperties();
			for (pattern in patternProperties) {
				if (patternProperties[pattern] !== O[pattern]) {
					regexp = null;
					try {
						regexp = new RegExp(pattern);
					} catch (e) {
						if (report) {
							report.addError(schema, self, "patternProperties", "Invalid pattern", pattern);
						}
					}

					if (regexp) {
						for (key in properties) {
							if (properties[key] !== O[key]  && regexp.test(key)) {
								matchedProperties[key] = matchedProperties[key] ? JSV.pushUnique(matchedProperties[key], patternProperties[pattern]) : [ patternProperties[pattern] ];
							}
						}
					}
				}
			}
		}

		return matchedProperties;
	}

	SCHEMA_03_JSON = JSV.inherits(SCHEMA_02_JSON, {
		"$schema" : "http://json-schema.org/draft-03/schema#",
		"id" : "http://json-schema.org/draft-03/schema#",

		"properties" : {
			"patternProperties" : {
				"type" : "object",
				"additionalProperties" : {"$ref" : "#"},
				"default" : {},

				"parser" : SCHEMA_02.getValueOfProperty("properties")["properties"]["parser"],

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var matchedProperties, key, x;
					if (instance.getType() === "object") {
						matchedProperties = getMatchedPatternProperties(instance, schema, report, self);
						for (key in matchedProperties) {
							if (matchedProperties[key] !== O[key]) {
								x = matchedProperties[key].length;
								while (x--) {
									matchedProperties[key][x].validate(instance.getProperty(key), report, instance, schema, key);
								}
							}
						}
					}
				}
			},

			"additionalProperties" : {
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var additionalProperties, propertySchemas, properties, matchedProperties, key;
					if (instance.getType() === "object") {
						additionalProperties = schema.getAttribute("additionalProperties");
						propertySchemas = schema.getAttribute("properties") || {};
						properties = instance.getProperties();
						matchedProperties = getMatchedPatternProperties(instance, schema);
						for (key in properties) {
							if (properties[key] !== O[key] && properties[key] && propertySchemas[key] === O[key] && matchedProperties[key] === O[key]) {
								if (JSV.isJSONSchema(additionalProperties)) {
									additionalProperties.validate(properties[key], report, instance, schema, key);
								} else if (additionalProperties === false) {
									report.addError(instance, schema, "additionalProperties", "Additional properties are not allowed", additionalProperties);
								}
							}
						}
					}
				}
			},

			"items" : {
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var properties, items, x, xl, itemSchema, additionalItems;

					if (instance.getType() === "array") {
						properties = instance.getProperties();
						items = schema.getAttribute("items");
						additionalItems = schema.getAttribute("additionalItems");

						if (JSV.typeOf(items) === "array") {
							for (x = 0, xl = properties.length; x < xl; ++x) {
								itemSchema = items[x] || additionalItems;
								if (itemSchema !== false) {
									itemSchema.validate(properties[x], report, instance, schema, x);
								} else {
									report.addError(instance, schema, "additionalItems", "Additional items are not allowed", itemSchema);
								}
							}
						} else {
							itemSchema = items || additionalItems;
							for (x = 0, xl = properties.length; x < xl; ++x) {
								itemSchema.validate(properties[x], report, instance, schema, x);
							}
						}
					}
				}
			},

			"additionalItems" : {
				"type" : [{"$ref" : "#"}, "boolean"],
				"default" : {},

				"parser" : SCHEMA_02.getValueOfProperty("properties")["additionalProperties"]["parser"],

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var additionalItems, properties, x, xl;
					//only validate if the "items" attribute is undefined
					if (instance.getType() === "array" && schema.getProperty("items").getType() === "undefined") {
						additionalItems = schema.getAttribute("additionalItems");
						properties = instance.getProperties();

						if (additionalItems !== false) {
							for (x = 0, xl = properties.length; x < xl; ++x) {
								additionalItems.validate(properties[x], report, instance, schema, x);
							}
						} else if (properties.length) {
							report.addError(instance, schema, "additionalItems", "Additional items are not allowed", additionalItems);
						}
					}
				}
			},

			"optional" : {
				"validationRequired" : false,
				"deprecated" : true
			},

			"required" : {
				"type" : "boolean",
				"default" : false,

				"parser" : function (instance, self) {
					return !!instance.getValue();
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					if (instance.getType() === "undefined" && schema.getAttribute("required")) {
						report.addError(instance, schema, "required", "Property is required", true);
					}
				}
			},

			"requires" : {
				"deprecated" : true
			},

			"dependencies" : {
				"type" : "object",
				"additionalProperties" : {
					"type" : ["string", "array", {"$ref" : "#"}],
					"items" : {
						"type" : "string"
					}
				},
				"default" : {},

				"parser" : function (instance, self, arg) {
					function parseProperty(property) {
						var type = property.getType();
						if (type === "string" || type === "array") {
							return property.getValue();
						} else if (type === "object") {
							return property.getEnvironment().createSchema(property, self.getEnvironment().findSchema(self.resolveURI("#")));
						}
					}

					if (instance.getType() === "object") {
						if (arg) {
							return parseProperty(instance.getProperty(arg));
						} else {
							return JSV.mapObject(instance.getProperties(), parseProperty);
						}
					}
					//else
					return {};
				},

				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var dependencies, key, dependency, type, x, xl;
					if (instance.getType() === "object") {
						dependencies = schema.getAttribute("dependencies");
						for (key in dependencies) {
							if (dependencies[key] !== O[key] && instance.getProperty(key).getType() !== "undefined") {
								dependency = dependencies[key];
								type = JSV.typeOf(dependency);
								if (type === "string") {
									if (instance.getProperty(dependency).getType() === "undefined") {
										report.addError(instance, schema, "dependencies", 'Property "' + key + '" requires sibling property "' + dependency + '"', dependencies);
									}
								} else if (type === "array") {
									for (x = 0, xl = dependency.length; x < xl; ++x) {
										if (instance.getProperty(dependency[x]).getType() === "undefined") {
											report.addError(instance, schema, "dependencies", 'Property "' + key + '" requires sibling property "' + dependency[x] + '"', dependencies);
										}
									}
								} else if (JSV.isJSONSchema(dependency)) {
									dependency.validate(instance, report);
								}
							}
						}
					}
				}
			},

			"minimumCanEqual" : {
				"deprecated" : true
			},

			"maximumCanEqual" : {
				"deprecated" : true
			},

			"exclusiveMinimum" : {
				"type" : "boolean",
				"default" : false,

				"parser" : function (instance, self) {
					return !!instance.getValue();
				}
			},

			"exclusiveMaximum" : {
				"type" : "boolean",
				"default" : false,

				"parser" : function (instance, self) {
					return !!instance.getValue();
				}
			},

			"minimum" : {
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var minimum, exclusiveMinimum;
					if (instance.getType() === "number") {
						minimum = schema.getAttribute("minimum");
						exclusiveMinimum = schema.getAttribute("exclusiveMinimum") || (!instance.getEnvironment().getOption("strict") && !schema.getAttribute("minimumCanEqual"));
						if (typeof minimum === "number" && (instance.getValue() < minimum || (exclusiveMinimum === true && instance.getValue() === minimum))) {
							report.addError(instance, schema, "minimum", "Number is less then the required minimum value", minimum);
						}
					}
				}
			},

			"maximum" : {
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maximum, exclusiveMaximum;
					if (instance.getType() === "number") {
						maximum = schema.getAttribute("maximum");
						exclusiveMaximum = schema.getAttribute("exclusiveMaximum") || (!instance.getEnvironment().getOption("strict") && !schema.getAttribute("maximumCanEqual"));
						if (typeof maximum === "number" && (instance.getValue() > maximum || (exclusiveMaximum === true && instance.getValue() === maximum))) {
							report.addError(instance, schema, "maximum", "Number is greater then the required maximum value", maximum);
						}
					}
				}
			},

			"contentEncoding" : {
				"deprecated" : true
			},

			"divisibleBy" : {
				"exclusiveMinimum" : true
			},

			"disallow" : {
				"items" : {
					"type" : ["string", {"$ref" : "#"}]
				},

				"parser" : SCHEMA_02_JSON["properties"]["type"]["parser"]
			},

			"id" : {
				"type" : "string",
				"format" : "uri"
			},

			"$ref" : {
				"type" : "string",
				"format" : "uri"
			},

			"$schema" : {
				"type" : "string",
				"format" : "uri"
			}
		},

		"dependencies" : {
			"exclusiveMinimum" : "minimum",
			"exclusiveMaximum" : "maximum"
		},

		"initializer" : function (instance) {
			var link, extension, extended,
				schemaLink = instance.getValueOfProperty("$schema"),
				refLink = instance.getValueOfProperty("$ref"),
				idLink = instance.getValueOfProperty("id");

			//if there is a link to a different schema, update instance
			if (schemaLink) {
				link = instance.resolveURI(schemaLink);
				if (link && instance._schema._uri !== link) {
					if (instance._env._schemas[link]) {
						instance._schema = instance._env._schemas[link];
						initializer = instance._schema.getValueOfProperty("initializer");
						if (typeof initializer === "function") {
							return initializer(instance);  //this function will finish initialization
						} else {
							return instance;  //no further initialization
						}
					} else if (instance._env._options["validateReferences"]) {
						throw new InitializationError(instance, instance._schema, "$schema", "Unknown schema reference", link);
					}
				}
			}

			//if there is a link to the full representation, replace instance
			if (refLink) {
				link = instance.resolveURI(refLink);
				if (link && instance._uri !== link) {
					if (instance._env._schemas[link]) {
						instance = instance._env._schemas[link];
						return instance;  //retrieved schemas are guaranteed to be initialized
					} else if (instance._env._options["validateReferences"]) {
						throw new InitializationError(instance, instance._schema, "$ref", "Unknown schema reference", link);
					}
				}
			}

			//extend schema
			extension = instance.getAttribute("extends");
			if (JSV.isJSONSchema(extension)) {
				extended = JSV.inherits(extension, instance, true);
				instance = instance._env.createSchema(extended, instance._schema, instance._uri);
			}

			//if instance has a URI link to itself, update it's own URI
			if (idLink) {
				link = instance.resolveURI(idLink);
				if (JSV.typeOf(link) === "string") {
					instance._uri = JSV.formatURI(link);
				}
			}

			return instance;
		}
	});

	HYPERSCHEMA_03_JSON = JSV.inherits(HYPERSCHEMA_02_JSON, {
		"$schema" : "http://json-schema.org/draft-03/hyper-schema#",
		"id" : "http://json-schema.org/draft-03/hyper-schema#",

		"properties" : {
			"links" : {
				"selfReferenceVariable" : "@"
			},

			"root" : {
				"deprecated" : true
			},

			"contentEncoding" : {
				"deprecated" : false  //moved from core to hyper
			},

			"alternate" : {
				"deprecated" : true
			}
		}
	});

	LINKS_03_JSON = JSV.inherits(LINKS_02_JSON, {
		"$schema" : "http://json-schema.org/draft-03/hyper-schema#",
		"id" : "http://json-schema.org/draft-03/links#",

		"properties" : {
			"href" : {
				"required" : true,
				"format" : "link-description-object-template"
			},

			"rel" : {
				"required" : true
			},

			"properties" : {
				"deprecated" : true
			},

			"schema" : {"$ref" : "http://json-schema.org/draft-03/hyper-schema#"}
		}
	});

	ENVIRONMENT.setOption("validateReferences", true);
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-03/schema#");  //update later

	//prevent reference errors
	ENVIRONMENT.createSchema({}, true, "http://json-schema.org/draft-03/schema#");
	ENVIRONMENT.createSchema({}, true, "http://json-schema.org/draft-03/hyper-schema#");
	ENVIRONMENT.createSchema({}, true, "http://json-schema.org/draft-03/links#");

	SCHEMA_03 = ENVIRONMENT.createSchema(SCHEMA_03_JSON, true, "http://json-schema.org/draft-03/schema#");
	HYPERSCHEMA_03 = ENVIRONMENT.createSchema(JSV.inherits(SCHEMA_03, ENVIRONMENT.createSchema(HYPERSCHEMA_03_JSON, true, "http://json-schema.org/draft-03/hyper-schema#"), true), true, "http://json-schema.org/draft-03/hyper-schema#");
	LINKS_03 = ENVIRONMENT.createSchema(LINKS_03_JSON, true, "http://json-schema.org/draft-03/links#");

	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-03/hyper-schema#");

	//We need to reinitialize these schemas as they reference each other
	HYPERSCHEMA_03 = ENVIRONMENT.createSchema(HYPERSCHEMA_03.getValue(), HYPERSCHEMA_03, "http://json-schema.org/draft-03/hyper-schema#");

	ENVIRONMENT.setOption("latestJSONSchemaSchemaURI", "http://json-schema.org/draft-03/schema#");
	ENVIRONMENT.setOption("latestJSONSchemaHyperSchemaURI", "http://json-schema.org/draft-03/hyper-schema#");
	ENVIRONMENT.setOption("latestJSONSchemaLinksURI", "http://json-schema.org/draft-03/links#");

	//
	//Latest JSON Schema
	//

	//Hack, but WAY faster then instantiating a new schema
	ENVIRONMENT._schemas["http://json-schema.org/schema#"] = SCHEMA_03;
	ENVIRONMENT._schemas["http://json-schema.org/hyper-schema#"] = HYPERSCHEMA_03;
	ENVIRONMENT._schemas["http://json-schema.org/links#"] = LINKS_03;

	//
	//register environment
	//

	JSV.registerEnvironment("json-schema-draft-03", ENVIRONMENT);
	if (!JSV.getDefaultEnvironmentID() || JSV.getDefaultEnvironmentID() === "json-schema-draft-01" || JSV.getDefaultEnvironmentID() === "json-schema-draft-02") {
		JSV.setDefaultEnvironmentID("json-schema-draft-03");
	}

}());


global.JSONFormValidator = exports.JSV;
})(this, false);