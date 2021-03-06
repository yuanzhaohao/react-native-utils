'use strict';

var React = require('react-native'),
    _ = require('underscore');

var AsyncStorage = React.AsyncStorage;

var API = function () {
  var self = {};

  var fixSchema = function fixSchema() {
    var url = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
    var schema = arguments.length <= 1 || arguments[1] === undefined ? 'https' : arguments[1];

    return url.match(/^\/\//) ? schema + ':' + url : url;
  };
  self.fixSchema = fixSchema;

  self.dlp = function (opts) {
    opts = _.extend({
      cacheExpiryTime: 24 * 60 * 60 * 1000, // 缓存失效时间，默认为1天
      cacheValidTime: 0, // 缓存有效时间毫秒数，若在此时间内则直接使用，等于0时，则不开启缓存
      success: null, // 请求数据成功时的回调函数
      error: null }, // 请求数据失败时的回调函数
    opts);
    if (opts.url) {
      opts.url = fixSchema(opts.url);
      var cache = opts.cache,

      // cacheExpiryTime = opts.cacheExpiryTime,
      cacheValidTime = opts.cacheValidTime,
          fetchFn;

      fetchFn = function fetchFn(cb, cache) {
        fetch(opts.url).then(function (response) {
          return response.text();
        }).then(function (responseText) {
          var re;
          try {
            re = JSON.parse(responseText);
          } catch (e) {
            console.warn(e);
          }
          cb && cb(re);
          if (!cache) {
            opts.success && opts.success(re);
          }
        }).catch(function (e) {
          console.warn(e);
          opts.error && opts.error(e);
        }).done();
      };
      if (_.isNumber(cacheValidTime) && cacheValidTime > 0) {
        var now = _.now(),
            setStorageFn = function setStorageFn(re) {
          self.setStorageItem(opts.url, JSON.stringify({
            timestamp: now + cacheValidTime,
            source: re
          }));
        };
        self.getStorageItem(opts.url, function (val) {
          if (val !== null) {
            var cacheData = JSON.parse(val);
            if (cacheData && cacheData.timestamp && cacheData.timestamp > now - cacheValidTime) {
              opts.success(cacheData.source);
              fetchFn(setStorageFn, 1);
            } else {
              fetchFn(setStorageFn);
            }
          } else {
            fetchFn(setStorageFn);
          }
        }, function () {
          fetchFn(setStorageFn);
        });
      } else {
        fetchFn();
        self.removeStorageItem(opts.url);
      }
    }
  };

  self.removeStorageItem = function (key, cb) {
    try {
      AsyncStorage.removeItem(key).then(function (val) {
        cb && cb(val);
      }).catch(function (error) {
        console.warn(error);
      }).done();
    } catch (e) {}
  };

  self.setStorageItem = function (key, val, cb) {
    try {
      AsyncStorage.setItem(key, val).then(function (val) {
        cb && cb(val);
      }).catch(function (error) {
        console.warn(error);
      }).done();
    } catch (e) {}
  };

  self.getStorageItem = function (key, success, error) {
    try {
      AsyncStorage.getItem(key).then(function (val) {
        success && success(val);
      }).catch(function (e) {
        error && error(e);
      }).done();
    } catch (e) {};
  };

  self.get = function (url, success, error) {
    self.dlp({
      url: url,
      success: success,
      error: error
    });
  };

  return self;
}(undefined);

module.exports = API;