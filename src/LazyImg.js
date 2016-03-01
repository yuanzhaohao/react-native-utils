'use strict';

var React = require('react-native');

var {
  Image
} = React;

var LazyImg = React.createClass({
  getInitialState() {
    return {
      isLoaded: false
    }
  },

  getDefaultProps: function() {
    return {
      ref: 'LazyImg'
    };
  },

  render() {
    if (this.state.isLoaded) {
      return (
        <Image style={this.props.imgStyle} source={this.props.lazySource} />
      );
    }
    else {
      return (
        <Image style={this.props.imgStyle} />
      );
    }
  }
});

module.exports = LazyImg;
