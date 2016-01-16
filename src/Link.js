'use strict';

import React, {
  View,
  StyleSheet,
  NativeModules,
  TouchableHighlight
} from 'react-native';

import _ from 'underscore';

var Link = React.createClass({
  getDefaultProps() {
    return {
      style: {},
      href: '',
      threhole: 10,
      time: 550,
      underlayColor: 'rgba(255,255,255,.25)',
      activeOpacity: 0.85,
      opacityNormal: 0,
      opacityPress: 1,
      needCover: false,
    }
  },

  mergeHref(href, key, value) {
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
      _.each(s, function (v) {
        temp = v.split('=');
        if (temp.length === 2) {
          o[temp[0]] = temp[1];
        }
      });
      destHref = stripHashHref.substr(0, searchIndex);
    }
    else {
      destHref = stripHashHref;
    }
    o[key] = value;
    temp = [];
    _.each(o, function (v, k) {
      temp.push(k + '=' + v);
    });
    destHref += '?' + temp.join('&') + hash;
    return destHref;
  },

  _press() {
    var href = this.props.href;
    if (href) {
      if (NativeModules && NativeModules.URLOpenService) {
        NativeModules.URLOpenService.open(href);
      }
    }
  },

  render() {
    var children = this.props.children;
    return (
      <TouchableHighlight
        {...this.props}
        onPress={this._press}
        ref={'link'}
        activeOpacity={this.props.activeOpacity}
        underlayColor={this.props.underlayColor} >
        <View>{children}</View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  cover: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }
});

module.exports = Link;
