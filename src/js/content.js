;(function() {
  "use strict";

  var $ = require('../vendor/jquery/jquery');
  var _ = require('../vendor/underscore/underscore');

  require('../vendor/jquery-ui-scalebreaker/jquery-ui-1.10.4.custom.min');
  require('../vendor/jquery-ui-scalebreaker/jq-scalebreaker.css');
  require('../vendor/jquery-ui-scalebreaker/jq-scalebreaker');

  require('./../vendor/nouislider/jquery.nouislider.min');
  require('./../vendor/nouislider/jquery.nouislider.css');

  require('../css/content.css');

  var _jQuery = $.noConflict(true);


  (function ($) { $(function() {

    var body = document.getElementsByTagName('body');
    var size = 11;

    var ratioLimits = {
      min: 0,
      max: 72
    };

    function showPopup() {

      $('body').scalebreaker('show');

      $('body').on('dialogHidden.jq-scalebreaker', function() {
        setTimeout(function() {
          $('body').scalebreaker('destroy');
        }, 200);
      });

      var $slider = $('body').scalebreaker('getContentElement')
        .find(".scalebreaker-123-slider");
      $slider.noUiSlider({
        start: [size],
        range: {
          'min': [ratioLimits.min],
          'max': [ratioLimits.max]
        }
      });

      $slider.on('slide', function() {
        size = $slider.val();
        console.log('new font size', size);
        for (var i = 0; i < body.length; i++) {
          body[i].style.fontSize = size + "pt";
        }
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



  });})(_jQuery);

})();
