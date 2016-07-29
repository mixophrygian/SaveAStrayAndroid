'use strict';

import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    ActivityIndicator,
    Image,
    Dimensions,
    Keyboard,
    LayoutAnimation,
    Alert
} from 'react-native';

import yelp from './../lib/yelp_api';
import SearchResults from './SearchResults';
import tempJson from './tempJson.json';


let windowHeight = Dimensions.get('window').height;

var DESCRIPTION_MARGIN = 44;
var DESCRIPTION_FONT = 16;
var INPUTS_MARGIN = 0;
var BUTTON_INPUT_FONT = 16;
var BUTTON_INPUT_HEIGHT = 24;
var INPUT_FLEX = 6;
var INDICATOR_SIZE = 38;
var KEYBOARD_MARGIN = 220;
var PADDING = 50;

if(windowHeight <=  640) {
    //smallest android size is default, 1280px
    //nexus 6 - 683
    //alert('smallest ' + windowHeight);
};

if(windowHeight > 640  && windowHeight <= 683) {
  //medium android size, 1920
    //DESCRIPTION_MARGIN = 44;
    //alert('medium');
};

if(windowHeight > 683 ) {
//large, most popular, android size, 2560
    //DESCRIPTION_FONT = 18;
    //DESCRIPTION_MARGIN = 44;
    INPUT_FLEX = 8;
};

class SearchPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchString: 'Chicago',
            isLoading: false,
            message: '',
            description: 'Search for rescue shelters by city or zip code',
            descriptionStyle: styles.description,
            visibleHeight: windowHeight,
            keyboardMargin: 0,
        };
    }

    onComponentMounted() {
      Keyboard.addListener('keyboardWillShow', this.showKeyboard.bind(this));
      Keyboard.addListener('keyboardWillHide', this.hideKeyboard.bind(this));
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
        fetch(query)
            .then(response => response.json())
            .then(json => this._handleResponse(json))
            .catch(error =>
                this.setState({
                    isLoading: false,
                    description: 'Hmmm. That didn\'t work.'
                }));

    }

    onSearchPressed() {
        this.refs.TextInput.blur();
        let query = yelp.request_yelp(this.state.searchString);
        this._executeQuery(query);
    }

    onLocationPressed() {
        navigator.geolocation.getCurrentPosition(
            location => {
                const search = location.coords.latitude + ',' + location.coords.longitude;
                this.setState({ searchString: ''});
                const query = yelp.request_yelp(search);
                this._executeQuery(query);
            },
            error => {
                Alert.alert('', 'To use Current Location, please allow Save a Stray to access your location.');
                this.setState({
                    message: 'GPS currently unavailable.'
                });
            });
    }

    _handleResponse(response) {
        this.setState({ isLoading: false, message: '', description: 'Search for rescue shelters by city or zip code', descriptionStyle: styles.description});
        if (response.total > 0) {
            this.props.navigator.push({ 
                title: 'Results',
                component: SearchResults,
                passProps: { results: response.businesses }
            });
            this.hideKeyboard();
        } else {
            this.setState({ description: 'Hmmm that didn\'t work. Try again.', descriptionStyle: styles.tryAgain});
        }
    }

    render() {
        let spinner = this.state.isLoading ? <ActivityIndicator color ='white' style={styles.indicator}/> : <View></View>;
        return (
        <Image style={styles.container} source={require('./finalDog1242x2208.png')}>
            <View style={[styles.content], {marginBottom: this.state.keyboardMargin}}>

                <TouchableHighlight 
                    style={styles.button} 
                    onPress={this.onLocationPressed.bind(this)}

                    underlayColor={'rgb(33,68,124)'}
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
                        returnKeyType={'search'}
                        onFocus={this.showKeyboard.bind(this)}
                        blurOnSubmit={false}
                        keyboardType={"web-search"}
                        keyboardAppearance={"default"}
                        placeholderTextColor= 'gray'
                        placeholder='City or zip code'
                    />

                    <TouchableHighlight 
                        onPress={this.onSearchPressed.bind(this)}
                        style={styles.goButton}
                        underlayColor={'rgb(33,68,124)'}
                      >
                        <Text style={styles.buttonText}>Go</Text>
                    </TouchableHighlight>
                </View>

                <View style={styles.descriptionContainer}>
                  <Text style={this.state.descriptionStyle}>
                    { this.state.description }
                  </Text>
                {spinner}
                </View>
            </View>
            </Image>
        );
    }
};

const ButtonInputHeight = 46;
const ButtonUnderlayColor = 'rgba(18,44,93,0.7)';

const animations = {
    layout: {
        spring: {
            duration: 400,
            create: {
              duration: 300,
              type: LayoutAnimation.Types.easeInEaseOut,
              property: LayoutAnimation.Properties.opacity,
            },
        update: {
            type: LayoutAnimation.Types.spring,
            springDamping: 400,
          },
    },
    easeInEaseOut: {
       duration: 400,
       create: {
         type: LayoutAnimation.Types.easeInEaseOut,
         property: LayoutAnimation.Properties.scaleXY,
       },
       update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        },
     },
    },
};

  
var UNDERLAY_COLOR = 'rgb(33,68,124)';

const styles = StyleSheet.create({
    descriptionContainer: {
        flex: 1,
        paddingTop: 3,
        marginBottom: DESCRIPTION_MARGIN,
        marginTop: 10,
        alignSelf: 'stretch',
        marginRight: PADDING,
        marginLeft: PADDING
    },
    description: {
        fontFamily: 'Open Sans',
        fontSize: DESCRIPTION_FONT,
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'transparent',
        lineHeight: DESCRIPTION_FONT + 3,
        alignSelf: 'stretch'
    },
    tryAgain: {
        fontFamily: 'Open Sans',
        fontSize: DESCRIPTION_FONT,
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'transparent',
        lineHeight: DESCRIPTION_FONT + 3,
        alignSelf: 'stretch'
    },

    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        width: null,
        height: null,
    },
    content: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: PADDING,
        marginLeft: PADDING,
    },
    currentLocationText: {
        color: '#122c5d',
        fontSize: BUTTON_INPUT_FONT,
        fontFamily: 'Open Sans',
        alignSelf: 'center'
    },
    buttonText: {
        fontSize: BUTTON_INPUT_FONT,
        fontFamily: 'Open Sans',
        color: 'white',
        alignSelf: 'center'
    },
    goButton: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'rgb(107,151,212)',
        borderRadius: 40,
        marginLeft: 8,
        padding: 4,
        justifyContent: 'center',
    },
    button: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#b9c6d9',
        borderRadius: 2,
        marginRight: PADDING,
        marginLeft: PADDING,
        marginBottom: 12,
    },
    searchInput: {
        flex: INPUT_FLEX,
        lineHeight: BUTTON_INPUT_HEIGHT,
        padding: 4,
        fontFamily: 'Open Sans',
        fontSize: BUTTON_INPUT_FONT,
        backgroundColor: 'white',
        borderRadius: 1,
        color: 'black',
        paddingLeft: 15,
    },
    indicator: {
        alignSelf: 'center',
        width: INDICATOR_SIZE,
        height: INDICATOR_SIZE,
        marginBottom: -38
    }
});

module.exports = SearchPage;

