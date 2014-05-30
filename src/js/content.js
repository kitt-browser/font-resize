;(function() {
  "use strict";


  var $ = require('../vendor/jquery/jquery');
  var _ = require('../vendor/underscore/underscore');
  require('../vendor/flowtype/flowtype');

  require('../vendor/jquery-ui-scalebreaker/jquery-ui-1.10.4.custom.min');
  require('../vendor/jquery-ui-scalebreaker/jq-scalebreaker.css');
  require('../vendor/jquery-ui-scalebreaker/jq-scalebreaker');

  require('./../vendor/nouislider/jquery.nouislider.min');
  require('./../vendor/nouislider/jquery.nouislider.css');

  require('../css/content.css');

  var _jQuery = $.noConflict(true);


  (function ($) {

    var ratioLimits = {
      min: 0,
      max: 80
    };

    function showPopup() {
      var ratio = (ratioLimits.min + ratioLimits.max) / 2;

      $('body').scalebreaker('show');

      $('body').on('dialogHidden.jq-scalebreaker', function() {
        setTimeout(function() {
          $('body').scalebreaker('destroy');
        }, 200);
      });

      var $slider = $('body').scalebreaker('getContentElement')
        .find(".scalebreaker-123-slider");
      console.log('starting with ratio', ratio);
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
    }

    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        console.log('message received:', request.cmd);

        $('body').scalebreaker({
          dialogContent: '<div class="scalebreaker-123-slider"/>',
          dialogPosition: 'bottom'
        });

        _.delay(function() {
          showPopup();
        }, 20);
      });



  })(_jQuery);

})();
