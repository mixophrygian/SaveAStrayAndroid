/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
  Dimensions
} from 'react-native';

import SearchPage from './app/SearchPage';
import SearchResults from './app/SearchResults';
import SingleResult from './app/SingleResult';

const windowWidth = Dimensions.get('window').width;

class JULY24 extends Component {

 renderScene(route, nav) {
  switch(route.title) {
    case 'Search':
      return <SearchPage name={'Search'} navigator={nav} />;
    case 'Results':
      return <SearchResults name={'Results'} navigator={nav} {...route.passProps} />;
    case '':
      return <SingleResult name={'Single'} navigator={nav} {...route.passProps} />;
    default:
      return <SearchPage name={'Search'} navigator={nav}  />;
  }
};

 renderNav(route) {
   console.log(route);
   switch(route.title){
     case 'Search':
       return <Navigator.NavigationBar
                style={ styles.invisibleNav}
                routeMapper={ this.NavigationBarRouteMapper }
          />
      case 'Results':
         return <Navigator.NavigationBar
                  style={ styles.resultsListNav }
                  routeMapper={ this.NavigationBarRouteMapper }
              />
      case '':
          return <Navigator.NavigationBar
                  style={ styles.singleResultNav }
                  routeMapper={ this.NavigationBarRouteMapper }
              />
      default:
          return <Navigator.NavigationBar
                  style={ styles.invisibleNav}
                  routeMapper={ this.NavigationBarRouteMapper }
            />
      }
 };

  NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, navState){
      if(index > 0) {
        return (
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => {if (index > 0) {navigator.pop() } }}
              >
                  <Text style={ styles.leftNavButtonText }>&#65308;</Text>
              </TouchableHighlight>
            )} else { return null }
    },
    RightButton(route, navigator, index, navState){
      if(route.onPress) return(
          <TouchableHighlight
              onPress={() => route.onPress() }>
              <Text style={styles.rightNavButtonText}>
                  { route.rightText || 'Forward' }
              </Text>
          </TouchableHighlight>)
    },
    Title(route, navigator, index, navState){
      return <Text style={styles.title}>{route.title}</Text>
    }
  };

  render() {
    return (
        <Navigator
        initialRoute={{ name: 'Search'}}
        style={styles.container}
        renderScene={this.renderScene}
        navigationBar={<Navigator.NavigationBar
                  style={ styles.invisibleNav}
                  routeMapper={ this.NavigationBarRouteMapper }
            />
        }
        />
    );
  }
}

const styles = StyleSheet.create({
    title:{
        marginTop: 8,
        marginLeft: (windowWidth/4),
        fontSize: 16,
    },
    invisibleNav: {
        height: 60,
        backgroundColor: 'transparent'
    },
    rightNavButtonText: {
        fontSize: 12,
        marginRight: 13,
        marginTop: 2
    },
    leftNavButtonText: {
        fontSize: 28,
        marginLeft: 13,
        marginTop: 4
    },
    container: {
        flex: 1
    }
});

AppRegistry.registerComponent('JULY24', () => JULY24);
