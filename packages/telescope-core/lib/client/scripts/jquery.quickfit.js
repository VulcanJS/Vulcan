(function ($) {
  var Quickfit, QuickfitHelper, defaults, pluginName;

  pluginName = 'quickfit';

  defaults = {
    min: 8,
    max: 12,
    tolerance: 0.02,
    truncate: false,
    width: null,
    sampleNumberOfLetters: 10,
    sampleFontSize: 12
  };
  QuickfitHelper = (function () {

    var sharedInstance = null;

    QuickfitHelper.instance = function (options) {
      if (!sharedInstance) {
        sharedInstance = new QuickfitHelper(options);
      }
      return sharedInstance;
    };

    function QuickfitHelper(options) {
      this.options = options;

      this.item = $('<span id="meassure"></span>');
      this.item.css({
        position: 'absolute',
        left: '-1000px',
        top: '-1000px',
        'font-size': "" + this.options.sampleFontSize + "px"
      });
      $('body').append(this.item);

      this.meassures = {};
    }

    QuickfitHelper.prototype.getMeassure = function (letter) {
      var currentMeassure;
      currentMeassure = this.meassures[letter];
      if (!currentMeassure) {
        currentMeassure = this.setMeassure(letter);
      }
      return currentMeassure;
    };

    QuickfitHelper.prototype.setMeassure = function (letter) {
      var currentMeassure, index, sampleLetter, text, _ref;

      text = '';
      sampleLetter = letter === ' ' ? '&nbsp;' : letter;

      for (index = 0, _ref = this.options.sampleNumberOfLetters - 1; 0 <= _ref ? index <= _ref : index >= _ref; 0 <= _ref ? index++ : index--) {
        text += sampleLetter;
      }

      this.item.html(text);
      currentMeassure = this.item.width() / this.options.sampleNumberOfLetters / this.options.sampleFontSize;
      this.meassures[letter] = currentMeassure;

      return currentMeassure;
    };

    return QuickfitHelper;

  })();

  Quickfit = (function () {

    function Quickfit(element, options) {
      this.$element = element;
      this.options = $.extend({}, defaults, options);
      this.$element = $(this.$element);
      this._defaults = defaults;
      this._name = pluginName;
      this.quickfitHelper = QuickfitHelper.instance(this.options);
    }

    Quickfit.prototype.fit = function () {
      var elementWidth;
      if (!this.options.width) {
        elementWidth = this.$element.width();
        this.options.width = elementWidth - this.options.tolerance * elementWidth;
      }
      if (this.text = this.$element.attr('data-quickfit')) {
        this.previouslyTruncated = true;
      } else {
        this.text = this.$element.text();
      }
      this.calculateFontSize();

      if (this.options.truncate) this.truncate();

      return {
        $element: this.$element,
        size: this.fontSize
      };
    };

    Quickfit.prototype.calculateFontSize = function () {
      var letter, textWidth, i;

      textWidth = 0;
      for (i = 0; i < this.text.length; ++i) {
        letter = this.text.charAt(i);
        textWidth += this.quickfitHelper.getMeassure(letter);
      }

      this.targetFontSize = parseInt(this.options.width / textWidth);
      return this.fontSize = Math.max(this.options.min, Math.min(this.options.max, this.targetFontSize));
    };

    Quickfit.prototype.truncate = function () {
      var index, lastLetter, letter, textToAdd, textWidth;

      if (this.fontSize > this.targetFontSize) {
        textToAdd = '';
        textWidth = 3 * this.quickfitHelper.getMeassure('.') * this.fontSize;

        index = 0;
        while (textWidth < this.options.width && index < this.text.length) {
          letter = this.text[index++];
          if (lastLetter) textToAdd += lastLetter;
          textWidth += this.fontSize * this.quickfitHelper.getMeassure(letter);
          lastLetter = letter;
        }

        if (textToAdd.length + 1 === this.text.length) {
          textToAdd = this.text;
        } else {
          textToAdd += '...';
        }
        this.textWasTruncated = true;

        return this.$element.attr('data-quickfit', this.text).html(textToAdd);

      } else {
        if (this.previouslyTruncated) {
          return this.$element.html(this.text);
        }
      }
    };

    return Quickfit;

  })();

  return $.fn.quickfit = function (options) {
    var measurements = [];

    // Separate measurements from repaints
    // First calculate all measurements...
    var $elements = this.each(function () {
      var measurement = new Quickfit(this, options).fit();
      measurements.push(measurement);
      return measurement.$element;
    });

    // ... then apply the measurements.
    for (var i = 0; i < measurements.length; i++) {
      var measurement = measurements[i];

      measurement.$element.css({ fontSize: measurement.size + 'px' });
    }

    return $elements;
  };

})(jQuery, window);