import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
  Dimensions
} from "react-native";

import SearchPage from "./app/SearchPage";
import SearchResults from "./app/SearchResults";
import SingleResult from "./app/SingleResult";

import { createStackNavigator } from "react-navigation";

const RootStack = createStackNavigator({
  SearchPage: {
    screen: SearchPage,
    navigationOptions: () => ({
      header: null
    })
  },
  SearchResults: {
    screen: SearchResults,
    navigationOptions: () => ({
      title: "Results"
    })
  },
  SingleResult: {
    screen: SingleResult
  }
});

export default class App extends React.Component {
  render() {
    return <RootStack style={{ flex: 1 }} />;
  }
}
