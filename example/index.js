'use strict';

var React = require('react-native');
var { AppRegistry, StyleSheet, Text, View } = React;
var TouchableBounce = require('../src/');

var Example = React.createClass({
  getInitialState() {
    return {
      pressCount: 0,
    };
  },

  onPress() {
    this.setState({
      pressCount: this.state.pressCount + 1
    });
  },

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          TouchableBounce
        </Text>
        <Text style={styles.instructions}>
          Press count: {this.state.pressCount}
        </Text>
        <TouchableBounce onPress={this.onPress}>
          <Text style={styles.button}>Click me</Text>
        </TouchableBounce>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#cdcdcd',
    padding: 20,
  }
});

AppRegistry.registerComponent('example', () => Example);
