import Users from './collection.js';
import CryptoJS from 'crypto-js';

Users.avatar = {

  /**
   * `cleantString` remove starting and trailing whitespaces
   * and lowercase the input
   * @param  {String} string input string that may contain leading and trailing
   * whitespaces and uppercase letters
   * @return {String}        output cleaned string
   */
  cleanString: function (string) {
    return string.trim().toLowerCase()
  },

  /**
   * `isHash` check if a string match the MD5 form :
   * 32 chars string containing letters from `a` to `f`
   * and digits from `0` to `9`
   * @param  {String}  string that might be a hash
   * @return {Boolean}
   */
  isHash: function (string) {
    var self = this
    return /^[a-f0-9]{32}$/i.test(self.cleanString(string))
  },

  /**
   * `hash` takes an input and run it through `CryptoJS.MD5`
   * @see https://atmospherejs.com/jparker/crypto-md5
   * @param  {String} string input string
   * @return {String}        md5 hash of the input
   */
  hash: function (string) {
    var self = this
    return CryptoJS.MD5(self.cleanString(string)).toString()
  },

  /**
   * `imageUrl` will provide the url for the avatar, given an email or a hash
   * and a set of options to be passed to the gravatar API
   * @see https://en.gravatar.com/site/implement/images/
   * @param  {String} emailOrHash email or pregenerated MD5 hash to query
   * gravatar with.
   * @param  {Object} options     options to be passed to gravatar in the query
   * string. The `secure` will be used to determine which base url to use.
   * @return {String}             complete url to the avatar
   */
  imageUrl: function (emailOrHash, options) {
    var self = this
    options = options || {}

    // Want HTTPS ?
    var url = options.secure
    ? 'https://secure.gravatar.com/avatar/'
    : 'http://www.gravatar.com/avatar/'
    delete options.secure

    // Is it an MD5 already ?
    url += self.isHash(emailOrHash)
    ? emailOrHash
    : self.hash(emailOrHash)

    // Have any options to pass ?
    var params = _.map(options, function (val, key) {
      return key + '=' + encodeURIComponent(val)
    }).join('&')

    return (params.length > 0)
    ? url + '?' + params
    : url
  },

  // Default functionality. You can override these options by calling
  // Users.avatar.setOptions (do not set this.options directly)

  options: {

    // Determines the type of fallback to use when no image can be found via
    // linked services (Gravatar included):
    //   'default image' (the default option, which will show either the image
    //   specified by defaultImageUrl, the package's default image, or a Gravatar
    //   default image)
    //     OR
    //   'initials' (show the user's initials).
    fallbackType: '',

    // Default avatar image's URL. It can be a relative path
    // (relative to website's base URL, e.g. 'images/defaultthis.png').
    defaultImageUrl: 'https://placekitten.com/80/80',

    // This property name will be used to fetch an avatar url from the user's profile
    // (e.g. 'avatar'). If this property is set and a property of that name exists
    // on the user's profile (e.g. user.profile.avatar) that property will be used
    // as the avatar url.
    customImageProperty: '',

    // Gravatar default option to use (overrides default image URL)
    // Options are available at:
    // https://secure.gravatar.com/site/implement/images/#default-image
    gravatarDefault: '',

    // This property is used to prefix the CSS classes of the DOM elements.
    // If no value is set, then the default CSS class assigned to all DOM elements are prefixed with 'avatar' as default.
    // If a value is set to, 'foo' for example, the resulting CSS classes are prefixed with 'foo'.
    cssClassPrefix: '',

    // This property defines the various image sizes available
    imageSizes: {
      'large': 80,
      'small': 30,
      'extra-small': 20
    },

    // Default background color when displaying the initials.
    // Can also be set to a function to map an user object to a background color.
    backgroundColor: '#aaa',

    // Default text color when displaying the initials.
    // Can also be set to a function to map an user object to a text color.
    textColor: '#fff',

    // Generate the required CSS and include it in the head of your application.
    // Setting this to false will exclude the generated CSS and leave the
    // avatar unstyled by the package.
    generateCSS: true
  },

  // Sets the Avatar options. You must use this setter function rather than assigning directly to
  // this.options, otherwise the stylesheet won't be generated.

  setOptions: function(options) {
    this.options = _.extend(this.options, options);
  },

  // Returns the cssClassPrefix property from options
  getCssClassPrefix: function () {
    return this.options.cssClassPrefix ? this.options.cssClassPrefix : 'avatar';
  },

  // Returns a background color for initials
  getBackgroundColor: function (user) {
    if (_.isString(this.options.backgroundColor))
      return this.options.backgroundColor;
    else if (_.isFunction(this.options.backgroundColor))
      return this.options.backgroundColor(user);
  },

  // Returns a text color for initials
  getTextColor: function (user) {
    if (_.isString(this.options.textColor))
      return this.options.textColor;
    else if (_.isFunction(this.options.textColor))
      return this.options.textColor(user);
  },

  // Get the initials of the user
  getInitials: function (user) {

    var initials = '';
    var name = '';
    var parts = [];

    if (user && user.profile && user.profile.firstName) {
      initials = user.profile.firstName.charAt(0).toUpperCase();

      if (user.profile.lastName) {
        initials += user.profile.lastName.charAt(0).toUpperCase();
      }
      else if (user.profile.familyName) {
        initials += user.profile.familyName.charAt(0).toUpperCase();
      }
      else if (user.profile.secondName) {
        initials += user.profile.secondName.charAt(0).toUpperCase();
      }
    }
    else {
      if (user && user.profile && user.profile.name) {
        name = user.profile.name;
      }
      else if (user && user.username) {
        name = user.username;
      }

      parts = name.split(' ');
      // Limit getInitials to first and last initial to avoid problems with
      // very long multi-part names (e.g. 'Jose Manuel Garcia Galvez')
      initials = _.first(parts).charAt(0).toUpperCase();
      if (parts.length > 1) {
        initials += _.last(parts).charAt(0).toUpperCase();
      }
    }

    return initials;
  },

  // Get the url of the user's avatar
  // XXX: this.getUrl is a reactive function only when no user argument is specified.
  getUrl: function (user) {

    // Default to the currently logged in user, unless otherwise specified.
    if (!user) return null;

    var url = '';
    var defaultUrl, svc;

    if (user) {
      svc = this.getService(user);
      if (svc === 'twitter') {
        // use larger image (200x200 is smallest custom option)
        url = user.services.twitter.profile_image_url_https.replace('_normal.', '_200x200.');
      }
      else if (svc === 'facebook') {
        // use larger image (~200x200)
        url = 'https://graph.facebook.com/' + user.services.facebook.id + '/picture/?type=large';
      }
      else if (svc === 'google') {
        url = user.services.google.picture;
      }
      else if (svc === 'github') {
        url = 'https://avatars.githubusercontent.com/' + user.services.github.username + '?s=200';
      }
      else if (svc === 'instagram') {
        url = user.services.instagram.profile_picture;
      }
      else if (svc === 'linkedin') {
        url = user.services.linkedin.pictureUrl;
      }
      else if (svc === 'custom') {
        url = this.getCustomUrl(user);
      }
      else if (svc === 'none') {
        defaultUrl = this.options.defaultImageUrl;
        // If it's a relative path (no '//' anywhere), complete the URL
        if (defaultUrl.indexOf('//') === -1) {
          // remove starting slash if it exists
          if (defaultUrl.charAt(0) === '/') defaultUrl = defaultUrl.substr(1);
          // Then add the relative path to the server's base URL
          defaultUrl = Meteor.absoluteUrl(defaultUrl);
        }
        url = this.getGravatarUrl(user, defaultUrl);
      }
    }

    return url;
  },

  getService: function (user) {
    var services = user && user.services || {};
    if (this.getCustomUrl(user)) { return 'custom'; }
    var service = _.find([['twitter', 'profile_image_url_https'], ['facebook', 'id'], ['google', 'picture'], ['github', 'username'], ['instagram', 'profile_picture'], ['linkedin', 'pictureUrl']], function(s) { return !!services[s[0]] && s[1].length && !!services[s[0]][s[1]]; });
    if(!service)
      return 'none';
    else
      return service[0];
  },

  computeUrl: function(prop, user) {
    if (typeof prop === 'function') {
      prop = prop.call(user);
    }
    if (prop && typeof prop === 'string') {
      return prop;
    }
  },

  getDescendantProp: function (obj, desc) {
    var arr = desc.split('.');
    while(arr.length && (obj = obj[arr.shift()]));
    return obj;
  },

  getCustomUrl: function (user) {

    var customProp = user && this.options.customImageProperty;
    if (typeof customProp === 'function') {
      return this.computeUrl(customProp, user);
    } else if (customProp) {
      return this.computeUrl(this.getDescendantProp(user, customProp), user);
    }
  },

  getGravatarUrl: function (user, defaultUrl) {
    var gravatarDefault;
    var validGravatars = ['404', 'mm', 'identicon', 'monsterid', 'wavatar', 'retro', 'blank'];

    // Initials are shown when Gravatar returns 404.
    if (this.options.fallbackType !== 'initials') {
      var valid = _.contains(validGravatars, this.options.gravatarDefault);
      gravatarDefault = valid ? this.options.gravatarDefault : defaultUrl;
    }
    else {
      gravatarDefault = '404';
    }

    var emailOrHash = this.getUserEmail(user) || Users.getEmailHash(user);
    // var secure = true;
    var options = {
      // NOTE: Gravatar's default option requires a publicly accessible URL,
      // so it won't work when your app is running on localhost and you're
      // using an image with either the standard default image URL or a custom
      // defaultImageUrl that is a relative path (e.g. 'images/defaultthis.png').
      size: 200, // use 200x200 like twitter and facebook above (might be useful later)
      default: gravatarDefault,
      secure: true
    };
    return emailOrHash ? this.imageUrl(emailOrHash, options) : null;

  },

  // Get the user's email address
  getUserEmail: function (user) {
    var emails = _.pluck(user.emails, 'address');
    return emails[0] || null;
  },

  // Returns the size class to use for an avatar
  getSizeClass: function(context) {
    // Defaults are 'large', 'small', 'extra-small', but user can add new ones
    return this.options.imageSizes[context.size] ? this.getCssClassPrefix() + '-' + context.size : '';
  },

  // Returns the shape class for an avatar
  getShapeClass: function (context) {
    var valid = ['rounded', 'circle'];
    return _.contains(valid, context.shape) ? this.getCssClassPrefix() + '-' + context.shape : '';
  },

  // Returns the custom class(es) for an avatar
  getCustomClasses: function (context) {
    return context.class ? context.class : '';
  },

  // Returns the initials text for an avatar
  getInitialsText: function(user, context) {
    return context.initials || this.getInitials(user);
  }

};

// This will be replaced if the user calls setOptions in their own code
Users.avatar.setOptions({});
