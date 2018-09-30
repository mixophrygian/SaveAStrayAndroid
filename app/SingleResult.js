"use strict";

import React, { Component } from "react";
import {
  StyleSheet,
  Image,
  Linking,
  TouchableHighlight,
  Dimensions,
  View,
  Text
} from "react-native";

import Communications from "react-native-communications";
import DisplayAddressParser from "./../lib/display_address_parser";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

let WARNING_MARGIN_TOP = 0;
let WARNING_MARGIN_BOTTOM = 3;
let YELP_INFO_MARGIN_BOTTOM = 0;
let DESCRIPTION_FONT = 12;
let SMALLER_FONT = 12;
let NAME_FONT = 20;

if (height <= 568) {
  //styling defaults
}

if (height > 568 && height <= 667) {
  //HTC One
  YELP_INFO_MARGIN_BOTTOM = 9;
  WARNING_MARGIN_BOTTOM = 7;
  DESCRIPTION_FONT = 14;
  SMALLER_FONT = 14;
  NAME_FONT = 23;
}

if (height > 667) {
  //Samsung larger phones
  YELP_INFO_MARGIN_BOTTOM = 12;
  WARNING_MARGIN_BOTTOM = 20;
  SMALLER_FONT = 14;
  DESCRIPTION_FONT = 16;
  NAME_FONT = 24;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F7F7F7"
  },
  allContent: {
    backgroundColor: "white",
    width: width - 20,
    flex: 1
  },
  heading: {
    backgroundColor: "white"
  },
  stars: {
    width: 83,
    height: 15,
    marginTop: 5,
    marginRight: 3
  },
  yelpText: {
    flexDirection: "row"
  },
  reviewCount: {
    fontSize: 12,

    color: "#656565",
    marginLeft: 3
  },
  yelpText2: {
    marginBottom: YELP_INFO_MARGIN_BOTTOM
  },
  yelpLogo: {
    width: 50,
    height: 25,
    marginTop: -3
  },
  staticInfoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 2
  },
  addressAndNumber: {
    marginTop: YELP_INFO_MARGIN_BOTTOM,
    marginLeft: 10
  },
  ctaButtonContainer: {
    width: width - 20,
    position: "absolute",
    bottom: 15,
    left: 0,
    flexDirection: "row"
  },
  yelpURLText: {
    color: "#325280",
    marginLeft: 2,
    marginTop: 2,
    fontSize: SMALLER_FONT
  },
  humaneSocietyURL: {
    color: "#325280",
    fontWeight: "bold",
    fontSize: DESCRIPTION_FONT
  },
  image: {
    width: width - 20,
    height: height / 2.7,
    backgroundColor: "rgba(204,204,204,0.5)"
  },
  textContainer: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 6
  },
  name: {
    fontSize: NAME_FONT,
    lineHeight: NAME_FONT + 6,

    fontWeight: "bold",
    color: "black",
    marginTop: 8,
    marginLeft: 10
  },
  description: {
    fontSize: DESCRIPTION_FONT,
    color: "#656565",
    marginBottom: WARNING_MARGIN_BOTTOM,
    marginTop: WARNING_MARGIN_TOP,
    marginLeft: 10
  },
  address: {
    fontSize: SMALLER_FONT,

    alignSelf: "flex-start"
  },
  staticPhone: {
    fontSize: SMALLER_FONT,

    marginTop: 3,
    alignSelf: "flex-end"
  },
  phoneUnavailable: {
    fontSize: SMALLER_FONT,

    marginTop: 3,
    color: "gray",
    alignSelf: "flex-end"
  },
  pinGlyph: {
    width: 12,
    height: 12,
    marginRight: 6,
    marginTop: 5,
    alignSelf: "flex-start"
  },
  phoneGlyph: {
    width: 12,
    height: 12,
    marginRight: 6,
    marginBottom: 5,
    alignSelf: "flex-end"
  },
  reviewCount: {
    fontSize: SMALLER_FONT,

    color: "#656565",
    marginTop: 3,
    marginLeft: 3
  },
  tapDirections: {
    flex: 1,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6B97D3"
  },
  tapDirectionsText: {
    fontSize: 20,

    color: "white"
  },
  tapDirectionsDisabled: {
    flex: 1,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DDDCDD"
  },
  tapDirectionsDisabledText: {
    fontSize: 20,
    color: "#818181"
  },
  phoneButton: {
    flex: 1,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2C599C"
  },
  phoneButtonText: {
    fontSize: 20,

    color: "white"
  },
  phoneButtonDisabled: {
    flex: 1,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A0A0A0"
  },
  phoneButtonDisabledText: {
    fontSize: 20,

    color: "#DADADA"
  },
  yelpInfo: {
    marginBottom: 0
  }
});

class SingleResult extends Component {
  viewYelp() {
    const url = this.props.navigation.getParam("result")[0].url;
    Linking.openURL(url).catch(err => console.error("An error occurred", err));
  }

  viewHumaneSociety() {
    const url = "http://saveastrayapp.com/#tips";
    Linking.openURL(url).catch(err => console.error("An error occurred", err));
  }

  callLocation() {
    const phone = this.props.navigation.getParam("result")[0].phone;
    Communications.phonecall(phone, true);
  }

  getStarRatingImage(rating) {
    //not a util because 'require' gets weird as an export, and react-native wont let you do dynamic require strings. lame.
    switch (rating) {
      case 0:
        return require("../assets/star_0.png");
      case 1:
        return require("../assets/star_1.png");
      case 1.5:
        return require("../assets/star_1_half.png");
      case 2:
        return require("../assets/star_2.png");
      case 2.5:
        return require("../assets/star_2_half.png");
      case 3:
        return require("../assets/star_3.png");
      case 3.5:
        return require("../assets/star_3_half.png");
      case 4:
        return require("../assets/star_4.png");
      case 4.5:
        return require("../assets/star_4_half.png");
      case 5:
        return require("../assets/star_5.png");
      default:
        return require("../assets/star_3.png");
    }
  }

  getDirections() {
    const result = this.props.navigation.getParam("result")[0];
    console.log("result", result);
    const lat = result.coordinates.latitude;
    const lon = result.coordinates.longitude;
    const url = "http://maps.google.com/?q=" + lat + "," + lon;
    Linking.openURL(url).catch(err => console.error("An error occurred", err));
  }

  render() {
    const result = this.props.navigation.getParam("result")[0];
    const reviewCount = result.review_count;
    const reviews = reviewCount + (reviewCount != 1 ? " Reviews" : " Review");
    const starsURL = this.getStarRatingImage(result.rating);
    let name = result.name;
    if (name.length > 50) {
      name = name.substring(0, 50) + "...";
    }
    const displayPhone = result.display_phone ? (
      <Text style={styles.staticPhone}>{result.display_phone}</Text>
    ) : (
      <Text style={styles.phoneUnavailable}>Phone Number Unavailable</Text>
    );

    const displayAddress = DisplayAddressParser(
      result.location.display_address
    );
    const tempImage = require("./../assets/catnose.jpg");
    const pinGlyph = require("./../assets/pin.png");
    const phoneGlyph = require("./../assets/phone.png");
    const phoneNumber = "";

    const phoneButton = result.display_phone ? (
      <TouchableHighlight
        underlayColor="white"
        style={styles.phoneButton}
        onPress={this.callLocation.bind(this)}
      >
        <Text style={styles.phoneButtonText}>Call</Text>
      </TouchableHighlight>
    ) : (
      <View style={styles.phoneButtonDisabled}>
        <Text style={styles.phoneButtonDisabledText}>Call</Text>
      </View>
    );

    const warningBlurb =
      height > 500 ? (
        <View>
          <Text style={styles.description}>
            Please call to verify hours of business and policies.{" "}
            <Text
              style={styles.humaneSocietyURL}
              underlayColor="white"
              onPress={this.viewHumaneSociety.bind(this)}
            >
              Tap here
            </Text>{" "}
            for tips from the humane society on how to safely catch a stray.
          </Text>
        </View>
      ) : (
        <View />
      );
    const directions =
      displayAddress[0].split(",")[0].search(/\d/) >= 0 ? (
        <TouchableHighlight
          underlayColor="white"
          onPress={this.getDirections.bind(this)}
          style={styles.tapDirections}
        >
          <Text style={styles.tapDirectionsText}>Directions</Text>
        </TouchableHighlight>
      ) : (
        <View style={styles.tabDirectionsDisabled}>
          <Text style={styles.tapDirectionsDisabledText}>Directions</Text>
        </View>
      );
    const picture = result.image_url ? { uri: result.image_url } : tempImage;

    return (
      <View style={styles.container}>
        <View style={styles.allContent}>
          <Image
            style={styles.image}
            resizeMode="cover"
            source={picture}
            defaultSource={tempImage}
          />

          <View style={styles.heading}>
            <Text style={styles.name}>{name}</Text>
          </View>

          <View style={styles.textContainer}>
            <View style={styles.yelpInfo}>
              <View style={styles.yelpText}>
                <Image style={styles.stars} source={starsURL} />
                <Text style={styles.reviewCount}>{reviews} on </Text>
                <Image
                  style={styles.yelpLogo}
                  source={require("./../assets/yelpLogo.png")}
                />
              </View>

              <View style={styles.yelpText2}>
                <TouchableHighlight
                  underlayColor="white"
                  onPress={this.viewYelp.bind(this)}
                >
                  <Text style={styles.yelpURLText}>View on Yelp</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>

          {warningBlurb}

          <View style={styles.addressAndNumber}>
            <View style={styles.staticInfoContainer}>
              <Image style={styles.pinGlyph} source={pinGlyph} />
              <Text style={styles.address}>{displayAddress}</Text>
            </View>

            <View style={styles.staticInfoContainer}>
              <Image style={styles.phoneGlyph} source={phoneGlyph} />
              {displayPhone}
            </View>
          </View>

          <View style={styles.ctaButtonContainer}>
            {phoneButton}
            {directions}
          </View>
        </View>
      </View>
    );
  }
}

module.exports = SingleResult;
