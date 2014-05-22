;(function() {
  "use strict";


  var $ = require('../vendor/jquery/jquery');
  var template = require('../html/popover.jade');
  var _ = require('../vendor/underscore/underscore');
  require('../vendor/flowtype/flowtype');

  require('../vendor/jquery-ui-scalebreaker/jquery-ui-1.10.4.custom.min');
  require('../vendor/jquery-ui-scalebreaker/jq-scalebreaker.css');
  require('../vendor/jquery-ui-scalebreaker/jq-scalebreaker');

  require('../css/content.css');

  require('./../vendor/nouislider/jquery.nouislider.min');
  require('./../vendor/nouislider/jquery.nouislider.css');


  var _jQuery = $.noConflict(true);


  (function ($) {

    var $modal;

    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        console.log('message received:', request.event);
        $('body').scalebreaker('show');
      });

    $('body').scalebreaker({
      dialogContent: '<div class="scalebreaker-123-slider"/>',
      dialogPosition: 'bottom'
    });

    var ratioLimits = {
      min: 0,
      max: 80
    };
    var ratio = (ratioLimits.min + ratioLimits.max) / 2;

    var $slider = $(".scalebreaker-123-slider");
    $slider.noUiSlider({
      start: [ratio],
      range: {
        'min': [ratioLimits.min],
        'max': [ratioLimits.max]
      }
    });

    $slider.on('slide', function() {
      ratio = $slider.val();
      console.log('new font ratio', ratio);
      $('body').flowtype({
        fontRatio: (ratioLimits.max - ratio)
      });
    });

  })(_jQuery);

})();
