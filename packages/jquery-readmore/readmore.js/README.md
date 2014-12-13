Readmore.js
========

A smooth, lightweight jQuery plugin for collapsing and expanding long blocks of text with "Read more" and "Close" links. 

The required markup for Readmore.js is also extremely lightweight and very simple. No need for complicated sets of `div`s or hardcoded class names, just call ``.readmore()`` on the element containing your block of text and Readmore.js takes care of the rest.

Readmore.js is compatible with all versions of jQuery greater than 1.7.0.

## Example ##

    $('article').readmore();
  
Yes, it's that simple. You can change the speed of the animation, the height of the collapsed block, and the open and close elements.

    $('article').readmore({
      speed: 75,
      maxHeight: 500
    });

## The options: ##

* `speed: 100` (in milliseconds)
* `maxHeight: 200`  (in pixels)
* `heightMargin: 16` (in pixels, avoids collapsing blocks that are only slightly larger than `maxHeight`)
* `moreLink: '<a href="#">Read more</a>'`
* `lessLink: '<a href="#">Close</a>'`
* `embedCSS: true` (insert required CSS dynamically, set this to `false` if you include the necessary CSS in a stylesheet)
* `sectionCSS: 'display: block; width: 100%;'` (sets the styling of the blocks, ignored if `embedCSS` is `false`)
* `startOpen: false` (do not immediately truncate, start in the fully opened position)
* `expandedClass: 'readmore-js-expanded'` (class added to expanded blocks)
* `collapsedClass: 'readmore-js-collapsed'` (class added to collapsed blocks)
* `beforeToggle: function() {}` (called after a more or less link is clicked, but *before* the block is collapsed or expanded)
* `afterToggle: function() {}` (called *after* the block is collapsed or expanded)

If the element has a `max-height` CSS property, Readmore.js will use that value rather than the value of the `maxHeight` option.

### The callbacks:

The callback functions, `beforeToggle()` and `afterToggle`, both receive the same arguments: `trigger`, `element`, and `expanded`.

* `trigger`: the "Read more" or "Close" element that was clicked
* `element`: the block that is being collapsed or expanded
* `expanded`: Boolean; `true` means the block is expanded

#### Callback example:

Here's an example of how you could use the `afterToggle` callback to scroll back to the top of a block when the "Close" link is clicked.

```javascript
$('article').readmore({
  afterToggle: function(trigger, element, expanded) {
    if(! expanded) { // The "Close" link was clicked
      $('html, body').animate( { scrollTop: element.offset().top }, {duration: 100 } );
    }
  }
});
```

### Recommended CSS:

The intention behind Readmore.js is to use CSS for as much functionality as possible. In particular, "collapsing" is achieved by setting `overflow: hidden` on the containing block and changing the `height` property.

By default, Readmore.js inserts the following CSS:

```css
.readmore-js-toggle, .readmore-js-section {
  display: block;
  width: 100%;
}
.readmore-js-section {
  overflow: hidden;
}
```

You can override the the first set of rules when you set up Readmore.js like so:

```javascript
$('article').readmore({sectionCSS: 'display: inline-block; width: 50%;'});
```

If you want to include the necessary styling in your site's stylesheet, you can disable the dynamic embedding by passing `embedCSS: false` in the options hash.

```javascript
$('article').readmore({embedCSS: false});
```

## Removing Readmore

You can remove the Readmore functionality like so:

```javascript
$('article').readmore('destroy');
```

Or, you can be more surgical by specifying a particular element:

```javascript
$('article:first').readmore('destroy');
```
