import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { KeepAwake, Font } from 'expo';
import { StackNavigator } from 'react-navigation';

import reducer from 'redux/reducer';

import Main from 'screen/Main';
import Loading from 'screen/Loading';

const middlewares = [thunk];
if (process.env.NODE_ENV == "development") middlewares.push(createLogger());
let store = createStore(reducer, {}, applyMiddleware(...middlewares));

KeepAwake.activate();

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      fontLoaded: false
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
      'Arial': require('./asset/font/arial.ttf')
    });

    this.setState({ 
      fontLoaded: true 
    });
  }
  render() {
    const Apps = StackNavigator({
      Main: {
        screen: Main
      },
    }, {
      initialRouteName: 'Main'
    });
    if (this.state.fontLoaded) {
      return (
        <Provider store={store}>
            <Apps />
        </Provider>
      );
    }
    return <Loading />;
  }
}
