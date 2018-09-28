"use strict";

import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Keyboard,
  LayoutAnimation,
  Alert
} from "react-native";

import config from "./../lib/config.js";
import yelp from "./../lib/yelp_api";
import SearchResults from "./SearchResults";
import tempJson from "./tempJson.json";

let windowHeight = Dimensions.get("window").height;
let INDICATOR_SIZE = 38;

if (windowHeight <= 480) {
  //iphone 4s size is default, 480 pixels
  INDICATOR_SIZE = 0;
}

var DESCRIPTION_MARGIN = 64;
var DESCRIPTION_FONT = 16;
var INPUTS_MARGIN = 0;
var BUTTON_INPUT_FONT = 16;
var BUTTON_INPUT_HEIGHT = 24;
var INPUT_FLEX = 6;
var KEYBOARD_MARGIN = 220;
var PADDING = 50;

if (windowHeight <= 1280) {
  //smallest android size is default, 1280px
}

if (windowHeight > 1280 && windowHeight <= 1920) {
  //medium android size, 1920
  DESCRIPTION_MARGIN = 44;
}

if (windowHeight > 1920 && windowHeight <= 2560) {
  //large, most popular, android size, 2560
  DESCRIPTION_FONT = 18;
  DESCRIPTION_MARGIN = 44;
}

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: "",
      isLoading: false,
      message: "",
      description: "Search for rescue shelters by city\nor zip code",
      descriptionStyle: styles.description,
      visibleHeight: windowHeight,
      keyboardMargin: 0
    };
  }

  onComponentMounted() {
    Keyboard.addListener("keyboardWillShow", this.showKeyboard.bind(this));
    Keyboard.addListener("keyboardWillHide", this.hideKeyboard.bind(this));
  }

  onSearchTextChanged(event) {
    this.setState({ searchString: event.nativeEvent.text });
  }

  showKeyboard(event) {
    LayoutAnimation.configureNext(animations.layout.easeInEaseOut);
    this.setState({
      keyboardMargin: KEYBOARD_MARGIN
    });
  }

  hideKeyboard() {
    LayoutAnimation.configureNext(animations.layout.easeInEaseOut);
    this.setState({
      keyboardMargin: 0
    });
  }

  _executeQuery(query) {
    this.setState({ isLoading: true });
    fetch(query, {
      headers: new Headers({
        Authorization: "Bearer " + config.apiKey
      })
    })
      .then(response => response.json())
      .then(json => this._handleResponse(json))
      .catch(error => {
        this.setState({
          isLoading: false,
          message: "Please try again. " + error
        });
      });
  }

  onSearchPressed(e) {
    const query = yelp.request_yelp(this.state.searchString);
    this.refs.TextInput.blur();
    this._executeQuery(query);
  }

  onLocationPressed() {
    navigator.geolocation.getCurrentPosition(
      location => {
        const search =
          location.coords.latitude + "," + location.coords.longitude;
        const query = yelp.request_yelp(search);
        this._executeQuery(query);
      },
      error => {
        Alert.alert(
          "",
          "To use Current Location, please allow Save a Stray to access your location."
        );
        this.setState({
          message: "GPS currently unavailable."
        });
      }
    );
  }

  _handleResponse(response) {
    this.setState({
      isLoading: false,
      message: "",
      description: "Search for rescue shelters by city or zip code",
      descriptionStyle: styles.description
    });
    if (response.total > 0) {
      this.props.navigator.push({
        title: "Results",
        component: SearchResults,
        passProps: { results: response.businesses }
      });
      this.hideKeyboard();
    } else {
      this.setState({
        description: "Hmmm that didn't work. Try again.",
        descriptionStyle: styles.tryAgain
      });
    }
  }

  render() {
    let spinner = this.state.isLoading ? (
      <ActivityIndicator color="white" style={styles.indicator} />
    ) : (
      <View />
    );
    return (
      <ImageBackground
        source={require("./../assets/bluepuppy.png")}
        imageStyle={{ resizeMode: "cover" }}
        resizeMethod={"scale"}
        style={styles.container}
      >
        <View
          style={
            ([styles.content], { marginBottom: this.state.keyboardMargin })
          }
        >
          <TouchableHighlight
            style={styles.button}
            onPress={this.onLocationPressed.bind(this)}
            underlayColor={"rgb(33,68,124)"}
          >
            <Text style={styles.currentLocationText}>CURRENT LOCATION</Text>
          </TouchableHighlight>

          <View style={styles.flowRight}>
            <TextInput
              ref="TextInput"
              style={styles.searchInput}
              value={this.state.searchString}
              autoCorrect={false}
              onSubmitEditing={this.onSearchPressed.bind(this)}
              onChange={this.onSearchTextChanged.bind(this)}
              returnKeyType={"search"}
              onFocus={this.showKeyboard.bind(this)}
              blurOnSubmit={false}
              keyboardType={"web-search"}
              keyboardAppearance={"default"}
              placeholderTextColor="gray"
              placeholder="City or zip code"
            />

            <TouchableHighlight
              onPress={this.onSearchPressed.bind(this)}
              style={styles.goButton}
              underlayColor={"rgb(33,68,124)"}
            >
              <Text style={styles.buttonText}>Go</Text>
            </TouchableHighlight>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={this.state.descriptionStyle}>
              {this.state.description}
            </Text>
            {spinner}
          </View>
        </View>
      </ImageBackground>
    );
  }
}

var animations = {
  layout: {
    spring: {
      duration: 400,
      create: {
        duration: 300,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 400
      }
    },
    easeInEaseOut: {
      duration: 400,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut
      }
    }
  }
};

var UNDERLAY_COLOR = "rgb(33,68,124)";

let styles = StyleSheet.create({
  descriptionContainer: {
    flex: 1,
    paddingTop: 3,
    marginBottom: DESCRIPTION_MARGIN,
    marginTop: 20,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center"
  },
  description: {
    fontFamily: "Roboto",
    fontSize: DESCRIPTION_FONT,
    textAlign: "center",
    color: "white",
    paddingLeft: PADDING,
    paddingRight: PADDING,
    backgroundColor: "transparent",
    shadowColor: "rgb(25, 19, 15)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    lineHeight: DESCRIPTION_FONT,
    marginTop: 8
  },
  tryAgain: {
    fontFamily: "Roboto",
    fontSize: DESCRIPTION_FONT,
    textAlign: "center",
    color: "white",
    backgroundColor: "transparent",
    paddingLeft: PADDING,
    paddingRight: PADDING,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    lineHeight: DESCRIPTION_FONT,
    marginTop: 8
  },

  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  content: {
    flexDirection: "column",
    alignItems: "center"
  },
  flowRight: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: PADDING,
    marginLeft: PADDING,
    paddingBottom: 0
  },
  currentLocationText: {
    color: "#122c5d",
    fontSize: BUTTON_INPUT_FONT,
    margin: 0,
    fontFamily: "Roboto",
    alignSelf: "center"
  },
  buttonText: {
    fontSize: BUTTON_INPUT_FONT,
    fontFamily: "Roboto",
    color: "white",
    alignSelf: "center"
  },
  goButton: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: "rgb(107,151,212)",
    borderRadius: 40,
    marginBottom: 8,
    marginLeft: 8,
    padding: 4,
    justifyContent: "center"
  },
  button: {
    flex: 1,
    flexDirection: "row",
    height: BUTTON_INPUT_HEIGHT,
    backgroundColor: "#b9c6d9",
    borderRadius: 2,
    marginRight: PADDING,
    marginLeft: PADDING,
    marginBottom: 12,
    justifyContent: "center"
  },
  searchInput: {
    flex: INPUT_FLEX,
    lineHeight: BUTTON_INPUT_HEIGHT,
    padding: 4,
    fontFamily: "normal",
    fontSize: BUTTON_INPUT_FONT,
    backgroundColor: "white",
    borderRadius: 1,
    color: "black",
    paddingLeft: 15
  },
  indicator: {
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    marginBottom: -40
  }
});

module.exports = SearchPage;
