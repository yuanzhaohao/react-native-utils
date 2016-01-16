'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reactNative = require('react-native');

var _reactNative2 = _interopRequireDefault(_reactNative);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Link = _reactNative2.default.createClass({
  displayName: 'Link',
  getDefaultProps: function getDefaultProps() {
    return {
      style: {},
      href: '',
      threhole: 10,
      time: 550,
      underlayColor: 'rgba(255,255,255,.25)',
      activeOpacity: 0.85,
      opacityNormal: 0,
      opacityPress: 1,
      needCover: false
    };
  },
  mergeHref: function mergeHref(href, key, value) {
    var hashIndex = href.lastIndexOf('#'),
        stripHashHref = hashIndex === -1 ? href.substr(0) : href.substr(0, hashIndex),
        hash = hashIndex === -1 ? '' : href.substr(hashIndex),
        searchIndex = stripHashHref.indexOf('?'),
        o = {},
        temp,
        destHref;

    if (searchIndex !== -1) {
      var s = stripHashHref.substr(searchIndex + 1).split('&'),
          o = {},
          temp;
      _underscore2.default.each(s, function (v) {
        temp = v.split('=');
        if (temp.length === 2) {
          o[temp[0]] = temp[1];
        }
      });
      destHref = stripHashHref.substr(0, searchIndex);
    } else {
      destHref = stripHashHref;
    }
    o[key] = value;
    temp = [];
    _underscore2.default.each(o, function (v, k) {
      temp.push(k + '=' + v);
    });
    destHref += '?' + temp.join('&') + hash;
    return destHref;
  },
  _press: function _press() {
    var href = this.props.href;
    if (href) {
      if (_reactNative.NativeModules && _reactNative.NativeModules.URLOpenService) {
        _reactNative.NativeModules.URLOpenService.open(href);
      }
    }
  },
  render: function render() {
    var children = this.props.children;
    return _reactNative2.default.createElement(
      _reactNative.TouchableHighlight,
      _extends({}, this.props, {
        onPress: this._press,
        ref: 'link',
        activeOpacity: this.props.activeOpacity,
        underlayColor: this.props.underlayColor }),
      _reactNative2.default.createElement(
        _reactNative.View,
        null,
        children
      )
    );
  }
});

var styles = _reactNative.StyleSheet.create({
  cover: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
});

module.exports = Link;