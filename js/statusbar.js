//jshint browser: true
/*global introJs: true */

/**
 * Create an animated icon by using a canvas element coupled with a flat image
 * containing all the animation frames arranged as a vertical row. The delay
 * between each frame is fixed.
 *
 * src: https://raw.github.com/mozilla-b2g/gaia/master/apps/system/js/statusbar.js
 * licence: https://raw.github.com/mozilla-b2g/gaia/master/LICENCE - Apache 2
 */
function AnimatedIcon(element, path, frames, delay) {
  //jshint onevar: false
  "use strict";
  var scaleRatio = window.innerWidth / 320 * 3;
  var baseSize = 16 * scaleRatio;

  element.width = baseSize;
  element.height = baseSize;

  var context = element.getContext('2d');

  this.frame = 1;
  this.frames = frames;
  this.timerId = null;
  this._started = false;
  var image;

  // Load the image and paint the first frame
  function init() {
    image = new Image();
    image.src = path;
    image.onload = function () {
      var w = image.width;
      var h = image.height / frames;
      context.drawImage(image, 0, 0, w, h, 0, 0, baseSize, baseSize);
    };
  }

  this.start = function () {
    var self = this;
    // XXX: If we draw canvas during device start up,
    // it will face following issue.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=849736
    if (!self._started) {
      self._started = true;
      init();
    }

    if (this.timerId === null) {
      this.timerId = setInterval(function () {
        var w = image.width;
        var h = image.height / frames;
        context.clearRect(0, 0, baseSize, baseSize);
        context.drawImage(image, 0, self.frame * h, w, h, 0, 0, baseSize, baseSize);
        self.frame++;

        if (self.frame === self.frames) {
          self.frame = 0;
        }
      }, delay);
    }
  };

  this.stop = function () {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  };
}
//
navigator.mozL10n.ready(function () {
  "use strict";
  var battery  = document.getElementById('statusbar-battery'),
      charging = document.getElementById('statusbar-battery-charging'),
      wifi     = document.getElementById('statusbar-wifi'),
      signal   = document.getElementById('statusbar-signal'),
      options,
      step = 1,
      networkActivityAnimation,
      systemDownloadsAnimation,
      currIntro;

  // Animate some icons {{{
  // battery
  window.setInterval(function () {
    var level = parseInt(battery.dataset.level, 10);
    battery.dataset.level = '' + (level === 100 ? 0 : level + 10);
  }, 500);
  // charging battery
  window.setInterval(function () {
    var level = parseInt(charging.dataset.level, 10);
    charging.dataset.level = '' + (level === 100 ? 0 : level + 10);
  }, 500);
  // Wifi level
  window.setInterval(function () {
    var level = parseInt(wifi.dataset.level, 10);
    wifi.dataset.level = '' + (level === 4 ? 0 : level + 1);
  }, 500);
  // Signal
  window.setInterval(function () {
    var level = parseInt(signal.dataset.level, 10);
    signal.dataset.level = '' + (level === 5 ? -1 : level + 1);
  }, 500);
  networkActivityAnimation = new AnimatedIcon(document.getElementById('statusbar-network-activity'), 'style/images/network-activity-flat@2x.png', 6, 200);
  systemDownloadsAnimation = new AnimatedIcon(document.getElementById('statusbar-system-downloads'), 'style/images/system-downloads-flat@2x.png', 8, 130);
  networkActivityAnimation.start();
  systemDownloadsAnimation.start();
  // }}}

  // Display tooltips {{{
  options = {
    tooltipPosition: 'right',
    exitOnOverlayClick: true,
    showStepNumbers: false
  };
  function foreach(sel, fct) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), fct);
  }
  // Display tooltip on click on icon
  foreach('[data-intro]', function (e) {
    var current = step++;
    e.dataset.step = current;
    e.addEventListener('click', function () {
      currIntro.goToStep(current);
    });
  });
  currIntro = introJs().setOptions(options).start();
  // Go to next tooltip on click on tooltip
  document.querySelector('.introjs-tooltip').onclick = document.querySelector('.introjs-nextbutton').onclick;
  // }}}
});

