// Generated by CoffeeScript 1.6.3
(function() {
  (function($) {
    return $.widget("salsita.scalebreaker", {
      options: {
        cssAnimated: true,
        dialogContent: '',
        idNamespace: 'jq-scalebreaker',
        dialogPosition: 'bottom',
        closeOnBackdrop: true,
        denyUserScroll: true,
        refreshOnScroll: true,
        mobileFriendlyInitialWidth: 320,
        mobileFriendlyMaxWidth: 568,
        broadcastEvents: true,
        debug: false
      },
      _create: function() {
        this.rawElement = "<div id='" + this.options.idNamespace + "-wrapper'>          <div id='" + this.options.idNamespace + "-dialog-scalable'>            <div id='" + this.options.idNamespace + "-dialog-scrollable'>              <div id='" + this.options.idNamespace + "-dialog-content'></div>              <span id='" + this.options.idNamespace + "-dialog-close'></span>            </div>          </div>        </div>";
        this.scrollbar = null;
        this.wrapper = null;
        this.dialog = null;
        this.scrollarea = null;
        this.content = null;
        this.close = null;
        this.fullPageDimensions = {};
        this.scaleFactor = null;
        this.currentViewportOffset = null;
        this.isMobileBrowser = /iPhone|iPod|Android|BlackBerry/.test(navigator.userAgent);
        this.state = 'hidden';
        this._initWidget();
        return this._logMessage('widget created', this.wrapper);
      },
      _initWidget: function() {
        $('body').append(this.rawElement);
        this.wrapper = $('#' + this.options.idNamespace + '-wrapper');
        this.dialog = $('#' + this.options.idNamespace + '-dialog-scalable');
        this.scrollarea = $('#' + this.options.idNamespace + '-dialog-scrollable');
        this.content = $('#' + this.options.idNamespace + '-dialog-content');
        this.close = $('#' + this.options.idNamespace + '-dialog-close');
        return this.changeDialogContent(this.options.dialogContent);
      },
      _setWrapperDimensions: function() {
        var bodyInlineStyle;
        bodyInlineStyle = $('body').attr('style');
        $('body').css({
          'overflow': 'hidden'
        });
        this.fullPageDimensions.width = Math.max(document.body.offsetWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth);
        this.fullPageDimensions.height = Math.max(document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        if (this.isMobileBrowser) {
          this.wrapper.css({
            'width': this.fullPageDimensions.width,
            'height': this.fullPageDimensions.height
          });
        } else {
          this.wrapper.css({
            'height': this.fullPageDimensions.height
          });
        }
        if (bodyInlineStyle) {
          return $('body').attr('style', bodyInlineStyle);
        } else {
          return $('body').removeAttr('style');
        }
      },
      _getCurrentViewport: function() {
        this.scaleFactor = window.innerWidth / this.fullPageDimensions.width;
        this._logMessage('scale factor', this.scaleFactor);
        this.currentViewportOffset = [window.pageXOffset, window.pageYOffset];
        return this._logMessage('current viewport offset', this.currentViewportOffset);
      },
      _rescaleAndReposition: function() {
        var mobileFriendlyScaleFactor;
        if (!this.isMobileBrowser) {
          this.dialog.css({
            'left': this.currentViewportOffset[0]
          });
        } else if (this.isMobileBrowser && (this.fullPageDimensions.width > this.options.mobileFriendlyMaxWidth)) {
          mobileFriendlyScaleFactor = this.fullPageDimensions.width / this.options.mobileFriendlyInitialWidth;
          this.dialog.css({
            'width': this.options.mobileFriendlyInitialWidth,
            'left': this.currentViewportOffset[0],
            'transform': "scale(" + (this.scaleFactor * mobileFriendlyScaleFactor) + ")",
            '-webkit-transform': "scale(" + (this.scaleFactor * mobileFriendlyScaleFactor) + ")"
          });
        } else {
          this.dialog.css({
            'left': this.currentViewportOffset[0],
            'transform': "scale(" + this.scaleFactor + ")",
            '-webkit-transform': "scale(" + this.scaleFactor + ")"
          });
        }
        if (this.options.dialogPosition === 'top') {
          this.dialog.css({
            'top': this.currentViewportOffset[1],
            'transform-origin': '0 0',
            '-webkit-transform-origin': '0 0'
          });
        }
        if (this.options.dialogPosition === 'bottom') {
          return this.dialog.css({
            'bottom': this.fullPageDimensions.height - (this.currentViewportOffset[1] + window.innerHeight),
            'transform-origin': '0 100%',
            '-webkit-transform-origin': '0 100%'
          });
        }
      },
      _manageScrollbar: function() {
        if (this.content.outerHeight() > this.scrollarea.outerHeight() && !this.scrollbar) {
          return this.scrollbar = new IScroll(this.scrollarea.get(0), {
            HWCompositing: true,
            useTransition: false,
            click: true
          });
        } else if (this.scrollbar) {
          return this.scrollbar.refresh();
        }
      },
      _triggerEvent: function(name, data) {
        this.element.trigger(name, [data]);
        return this._logMessage(name, data);
      },
      _logMessage: function(name, args) {
        if (this.options.debug) {
          return console.log("jq-scalebreaker: " + name, args);
        }
      },
      show: function() {
        var _self;
        _self = this;
        if (this.options.closeOnBackdrop) {
          _self.wrapper.on("click." + this.options.idNamespace, function(e) {
            if (e.target === _self.wrapper.get(0)) {
              return _self.hide();
            }
          });
        }
        this.close.on("click." + this.options.idNamespace, function(e) {
          return _self.hide();
        });
        if (this.options.denyUserScroll) {
          $('body').on("touchmove." + this.options.idNamespace, function(e) {
            return e.preventDefault();
          });
        }
        this.wrapper.addClass("" + this.options.idNamespace + "-show");
        this.refresh();
        if (this.options.cssAnimated) {
          this.wrapper.addClass("" + this.options.idNamespace + "-animate-in");
          this.wrapper.on('animationend webkitAnimationEnd', function(e) {
            if (e.target === _self.scrollarea.get(0)) {
              _self.wrapper.removeClass("" + _self.options.idNamespace + "-animate-in");
              _self.wrapper.off('animationend webkitAnimationEnd');
              this.state = 'shown';
              if (this.options.broadcastEvents) {
                return this._triggerEvent("dialogShown." + this.options.idNamespace, this.wrapper);
              }
            }
          });
        } else {
          this.state = 'shown';
          if (this.options.broadcastEvents) {
            this._triggerEvent("dialogShown." + this.options.idNamespace, this.wrapper);
          }
        }
        if (this.options.refreshOnScroll) {
          return $(window).on("scroll." + this.options.idNamespace, function(e) {
            return _self.refresh();
          });
        }
      },
      hide: function() {
        var _self;
        _self = this;
        if (this.options.denyUserScroll) {
          $('body').off("touchmove." + this.options.idNamespace);
        }
        if (this.options.closeOnBackdrop && this.options.cssAnimated) {
          _self.wrapper.off("click." + this.options.idNamespace);
          this.wrapper.addClass("" + this.options.idNamespace + "-animate-out");
          this.wrapper.on('animationend webkitAnimationEnd', function(e) {
            if (e.target === _self.scrollarea.get(0)) {
              _self.wrapper.removeClass("" + _self.options.idNamespace + "-animate-out");
              _self.wrapper.removeClass("" + _self.options.idNamespace + "-show");
              _self.wrapper.off('animationend webkitAnimationEnd');
              this.state = 'hidden';
              if (this.options.broadcastEvents) {
                return this._triggerEvent("dialogHidden." + this.options.idNamespace, this.wrapper);
              }
            }
          });
        } else if (this.options.closeOnBackdrop) {
          _self.wrapper.off("click." + this.options.idNamespace);
          this.wrapper.removeClass("" + this.options.idNamespace + "-show");
          this.state = 'hidden';
          if (this.options.broadcastEvents) {
            this._triggerEvent("dialogHidden." + this.options.idNamespace, this.wrapper);
          }
        }
        if (this.options.refreshOnScroll) {
          return $(window).off("scroll." + this.options.idNamespace);
        }
      },
      changeDialogContent: function(content) {
        this.content.html(content);
        this.refresh();
        return this._logMessage('adding content to dialog', content);
      },
      getContentElement: function() {
        return this.content;
      },
      getDialogState: function() {
        return this.state;
      },
      refresh: function() {
        this._setWrapperDimensions();
        this._getCurrentViewport();
        this._rescaleAndReposition();
        this._manageScrollbar();
        return this._logMessage('refreshing');
      },
      _destroy: function() {
        $(window).off("scroll." + this.options.idNamespace);
        this.wrapper.remove();
        this.rawElement = null;
        this.wrapper = null;
        this.dialog = null;
        this.scrollarea = null;
        this.content = null;
        this.close = null;
        this.scaleFactor = null;
        this.fullPageDimensions = null;
        this.currentViewportOffset = null;
        if (this.scrollbar) {
          this.scrollbar.destroy();
        }
        this.scrollbar = null;
        return this._logMessage('widget instance destroyed');
      }
    });
  })(jQuery);

}).call(this);
