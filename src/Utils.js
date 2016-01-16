'use strict';

var React = require('react-native'),
  _ = require('underscore');

var Utils = (() => {
  var self = {};

  var slice = Array.prototype.slice;
  self.later = function (fn, ms, context, data) {
    var d = slice.call(data),
      f = function () {
        fn.apply(context, data);
      },
      r = setTimeout(f, ms);

    return {
      id: r,
      cancel: function () {
        clearTimeout(r);
      }
    };
  }

  self.buffer = function (fn, ms, context) {
    var timer = null;

    ms = ms || 150;
    if (_.isString(fn)) {
      fn = context[fn];
    }
    function run () {
      run.stop();
      timer = self.later(fn, ms, context, arguments);
    }
    run.stop = function () {
      if (timer) {
        timer.cancel();
        timer = 0;
      }
    };
    return run;
  };

  self.throttle = function (fn, ms, context) {
    var lastStart = 0,
      lastEnd = 0,
      timer = null;

    console.log(arguments);
    ms = ms || 150;
    if (_.isString(fn)) {
      fn = context[fn];
    }
    function run () {
      run.stop();
      lastStart = _.now();
      fn.apply(context || this, arguments);
      lastEnd = _.now();
    }
    run.stop = function () {
      if (timer) {
        timer.cancel();
        timer = 0;
      }
    };
    return function () {
      if (!lastStart
        || lastEnd >= lastStart && _.now() - lastEnd > ms
        || lastEnd < lastStart && _.now() - lastStart > ms * 8
      ) {
        run();
      }
      else {
        if (timer) {
          timer.cancel();
        }
        timer = self.later(run, ms, context, arguments);
      }
    };
  };

  var abs = Math.abs,
    sqrt = Math.sqrt,
    pow = Math.pow;
  self.getTriangleSide = function (x1, y1, x2, y2) {
    var x = abs(x1 - x2),
      y = abs(y1 - y2),
      z = sqrt(pow(x, 2) + pow(y, 2));

    return {
      x: x,
      y: y,
      z: z
    };
  };

  var trackConfig = {};
  self.setConfig = function (key, value) {
    trackConfig[key] = value;
  };

  self.getConfig = function () {
    return trackConfig;
  };

  self.circle = function (i, len) {
    return (len + (i % len)) % len;
  };

  return self;
})();

module.exports = Utils;
