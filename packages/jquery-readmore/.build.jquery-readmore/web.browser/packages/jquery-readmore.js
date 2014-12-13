(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jquery-readmore/readmore.js/readmore.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/*!                                                                                                                   // 1
 * Readmore.js jQuery plugin                                                                                          // 2
 * Author: @jed_foster                                                                                                // 3
 * Project home: jedfoster.github.io/Readmore.js                                                                      // 4
 * Licensed under the MIT license                                                                                     // 5
 */                                                                                                                   // 6
                                                                                                                      // 7
;(function($) {                                                                                                       // 8
                                                                                                                      // 9
  var readmore = 'readmore',                                                                                          // 10
      defaults = {                                                                                                    // 11
        speed: 100,                                                                                                   // 12
        maxHeight: 200,                                                                                               // 13
        heightMargin: 16,                                                                                             // 14
        moreLink: '<a href="#">Read More</a>',                                                                        // 15
        lessLink: '<a href="#">Close</a>',                                                                            // 16
        embedCSS: true,                                                                                               // 17
        sectionCSS: 'display: block; width: 100%;',                                                                   // 18
        startOpen: false,                                                                                             // 19
        expandedClass: 'readmore-js-expanded',                                                                        // 20
        collapsedClass: 'readmore-js-collapsed',                                                                      // 21
                                                                                                                      // 22
        // callbacks                                                                                                  // 23
        beforeToggle: function(){},                                                                                   // 24
        afterToggle: function(){}                                                                                     // 25
      },                                                                                                              // 26
      cssEmbedded = false;                                                                                            // 27
                                                                                                                      // 28
  function Readmore( element, options ) {                                                                             // 29
    this.element = element;                                                                                           // 30
                                                                                                                      // 31
    this.options = $.extend( {}, defaults, options);                                                                  // 32
                                                                                                                      // 33
    $(this.element).data('max-height', this.options.maxHeight);                                                       // 34
    $(this.element).data('height-margin', this.options.heightMargin);                                                 // 35
                                                                                                                      // 36
    delete(this.options.maxHeight);                                                                                   // 37
                                                                                                                      // 38
    if(this.options.embedCSS && ! cssEmbedded) {                                                                      // 39
      var styles = '.readmore-js-toggle, .readmore-js-section { ' + this.options.sectionCSS + ' } .readmore-js-section { overflow: hidden; }';
                                                                                                                      // 41
      (function(d,u) {                                                                                                // 42
        var css=d.createElement('style');                                                                             // 43
        css.type = 'text/css';                                                                                        // 44
        if(css.styleSheet) {                                                                                          // 45
            css.styleSheet.cssText = u;                                                                               // 46
        }                                                                                                             // 47
        else {                                                                                                        // 48
            css.appendChild(d.createTextNode(u));                                                                     // 49
        }                                                                                                             // 50
        d.getElementsByTagName('head')[0].appendChild(css);                                                           // 51
      }(document, styles));                                                                                           // 52
                                                                                                                      // 53
      cssEmbedded = true;                                                                                             // 54
    }                                                                                                                 // 55
                                                                                                                      // 56
    this._defaults = defaults;                                                                                        // 57
    this._name = readmore;                                                                                            // 58
                                                                                                                      // 59
    this.init();                                                                                                      // 60
  }                                                                                                                   // 61
                                                                                                                      // 62
  Readmore.prototype = {                                                                                              // 63
                                                                                                                      // 64
    init: function() {                                                                                                // 65
      var $this = this;                                                                                               // 66
                                                                                                                      // 67
      $(this.element).each(function() {                                                                               // 68
        var current = $(this),                                                                                        // 69
            maxHeight = (current.css('max-height').replace(/[^-\d\.]/g, '') > current.data('max-height')) ? current.css('max-height').replace(/[^-\d\.]/g, '') : current.data('max-height'),
            heightMargin = current.data('height-margin');                                                             // 71
                                                                                                                      // 72
        if(current.css('max-height') != 'none') {                                                                     // 73
          current.css('max-height', 'none');                                                                          // 74
        }                                                                                                             // 75
                                                                                                                      // 76
        $this.setBoxHeight(current);                                                                                  // 77
                                                                                                                      // 78
        if(current.outerHeight(true) <= maxHeight + heightMargin) {                                                   // 79
          // The block is shorter than the limit, so there's no need to truncate it.                                  // 80
          return true;                                                                                                // 81
        }                                                                                                             // 82
        else {                                                                                                        // 83
          current.addClass('readmore-js-section ' + $this.options.collapsedClass).data('collapsedHeight', maxHeight); // 84
                                                                                                                      // 85
          var useLink = $this.options.startOpen ? $this.options.lessLink : $this.options.moreLink;                    // 86
          current.after($(useLink).on('click', function(event) { $this.toggleSlider(this, current, event) }).addClass('readmore-js-toggle'));
                                                                                                                      // 88
          if(!$this.options.startOpen) {                                                                              // 89
            current.css({height: maxHeight});                                                                         // 90
          }                                                                                                           // 91
        }                                                                                                             // 92
      });                                                                                                             // 93
                                                                                                                      // 94
      $(window).on('resize', function(event) {                                                                        // 95
        $this.resizeBoxes();                                                                                          // 96
      });                                                                                                             // 97
    },                                                                                                                // 98
                                                                                                                      // 99
    toggleSlider: function(trigger, element, event)                                                                   // 100
    {                                                                                                                 // 101
      event.preventDefault();                                                                                         // 102
                                                                                                                      // 103
      var $this = this,                                                                                               // 104
          newHeight = newLink = sectionClass = '',                                                                    // 105
          expanded = false,                                                                                           // 106
          collapsedHeight = $(element).data('collapsedHeight');                                                       // 107
                                                                                                                      // 108
      if ($(element).height() <= collapsedHeight) {                                                                   // 109
        newHeight = $(element).data('expandedHeight') + 'px';                                                         // 110
        newLink = 'lessLink';                                                                                         // 111
        expanded = true;                                                                                              // 112
        sectionClass = $this.options.expandedClass;                                                                   // 113
      }                                                                                                               // 114
                                                                                                                      // 115
      else {                                                                                                          // 116
        newHeight = collapsedHeight;                                                                                  // 117
        newLink = 'moreLink';                                                                                         // 118
        sectionClass = $this.options.collapsedClass;                                                                  // 119
      }                                                                                                               // 120
                                                                                                                      // 121
      // Fire beforeToggle callback                                                                                   // 122
      $this.options.beforeToggle(trigger, element, expanded);                                                         // 123
                                                                                                                      // 124
      $(element).animate({'height': newHeight}, {duration: $this.options.speed, complete: function() {                // 125
          // Fire afterToggle callback                                                                                // 126
          $this.options.afterToggle(trigger, element, expanded);                                                      // 127
                                                                                                                      // 128
          $(trigger).replaceWith($($this.options[newLink]).on('click', function(event) { $this.toggleSlider(this, element, event) }).addClass('readmore-js-toggle'));
                                                                                                                      // 130
          $(this).removeClass($this.options.collapsedClass + ' ' + $this.options.expandedClass).addClass(sectionClass);
        }                                                                                                             // 132
      });                                                                                                             // 133
    },                                                                                                                // 134
                                                                                                                      // 135
    setBoxHeight: function(element) {                                                                                 // 136
      var el = element.clone().css({'height': 'auto', 'width': element.width(), 'overflow': 'hidden'}).insertAfter(element),
          height = el.outerHeight(true);                                                                              // 138
                                                                                                                      // 139
      el.remove();                                                                                                    // 140
                                                                                                                      // 141
      element.data('expandedHeight', height);                                                                         // 142
    },                                                                                                                // 143
                                                                                                                      // 144
    resizeBoxes: function() {                                                                                         // 145
      var $this = this;                                                                                               // 146
                                                                                                                      // 147
      $('.readmore-js-section').each(function() {                                                                     // 148
        var current = $(this);                                                                                        // 149
                                                                                                                      // 150
        $this.setBoxHeight(current);                                                                                  // 151
                                                                                                                      // 152
        if(current.height() > current.data('expandedHeight') || (current.hasClass($this.options.expandedClass) && current.height() < current.data('expandedHeight')) ) {
          current.css('height', current.data('expandedHeight'));                                                      // 154
        }                                                                                                             // 155
      });                                                                                                             // 156
    },                                                                                                                // 157
                                                                                                                      // 158
    destroy: function() {                                                                                             // 159
      var $this = this;                                                                                               // 160
                                                                                                                      // 161
      $(this.element).each(function() {                                                                               // 162
        var current = $(this);                                                                                        // 163
                                                                                                                      // 164
        current.removeClass('readmore-js-section ' + $this.options.collapsedClass + ' ' + $this.options.expandedClass).css({'max-height': '', 'height': 'auto'}).next('.readmore-js-toggle').remove();
                                                                                                                      // 166
        current.removeData();                                                                                         // 167
      });                                                                                                             // 168
    }                                                                                                                 // 169
  };                                                                                                                  // 170
                                                                                                                      // 171
  $.fn[readmore] = function( options ) {                                                                              // 172
    var args = arguments;                                                                                             // 173
    if (options === undefined || typeof options === 'object') {                                                       // 174
      return this.each(function () {                                                                                  // 175
        if ($.data(this, 'plugin_' + readmore)) {                                                                     // 176
          var instance = $.data(this, 'plugin_' + readmore);                                                          // 177
          instance['destroy'].apply(instance);                                                                        // 178
        }                                                                                                             // 179
                                                                                                                      // 180
        $.data(this, 'plugin_' + readmore, new Readmore( this, options ));                                            // 181
      });                                                                                                             // 182
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {                             // 183
      return this.each(function () {                                                                                  // 184
        var instance = $.data(this, 'plugin_' + readmore);                                                            // 185
        if (instance instanceof Readmore && typeof instance[options] === 'function') {                                // 186
          instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );                                 // 187
        }                                                                                                             // 188
      });                                                                                                             // 189
    }                                                                                                                 // 190
  }                                                                                                                   // 191
})(jQuery);                                                                                                           // 192
                                                                                                                      // 193
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
