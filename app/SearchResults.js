"use strict";

import React, { Component } from "react";
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  FlatList,
  ListView,
  Text
} from "react-native";

import SingleResult from "./SingleResult";
import DisplayAddressParser from "../lib/display_address_parser";

const styles = StyleSheet.create({
  thumb: {
    width: 90,
    height: 90,
    marginRight: 10,
    backgroundColor: "rgb(204, 204, 204)"
  },
  textContainer: {
    flex: 1
  },
  stars: {
    width: 83,
    height: 15,
    paddingLeft: 3,
    marginTop: 5
  },
  yelpContainer: {
    flex: 1,
    flexDirection: "row"
  },
  yelpLogo: {
    width: 50,
    height: 25,
    marginLeft: 3,
    marginTop: -5
  },
  separator: {
    height: 1,
    backgroundColor: "#dddddd"
  },
  header: {
    fontSize: 18,
    margin: 0,

    fontWeight: "bold",
    color: "black"
  },
  area: {
    fontSize: 14,

    color: "#656565",
    marginTop: 2
  },
  reviewCount: {
    fontSize: 13,

    marginBottom: 4,
    color: "#656565",
    marginTop: 2
  },
  rowContainer: {
    flexDirection: "row",
    flex: 1,
    padding: 13,
    backgroundColor: "white"
  },
  fatSeparator: {
    height: 14,
    backgroundColor: "#F7F7F7"
  }
});

class SearchResults extends Component {
  constructor(props) {
    super(props);

    const results = this.props.navigation.getParam("results");

    var goodResults = results.filter(this.hasAddressOrNumber);

    let dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.id !== r2.id
    });
    this.state = {
      dataSource: dataSource.cloneWithRows(goodResults)
    };
  }

  _keyExtractor = (item, index) => item.id;

  hasAddressOrNumber(result) {
    var address = DisplayAddressParser(result.location.display_address);
    var reachableAddress =
      address[0].split(",")[0].search(/\d/) >= 0 ? true : false;
    var phone = result.display_phone || false;
    return reachableAddress || phone;
  }

  rowPressed(property) {
    const results = this.props.navigation.getParam("results");
    const result = results.filter(prop => prop.id === property.id);

    this.props.navigation.navigate("SingleResult", {
      component: SingleResult,
      result: result
    });
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

  renderRow(rowData) {
    const result = rowData.item;
    const name = result.name;
    const reviewCount = result.review_count;
    const reviews = reviewCount + (reviewCount !== 1 ? " Reviews" : " Review");
    const starRatingImage = this.getStarRatingImage(result.rating);
    const area = result.location.city + ", " + result.location.state;
    const tempImage = require("../assets/catnose.jpg");
    const picture = result.image_url ? { uri: result.image_url } : tempImage;
    return (
      <TouchableHighlight
        onPress={() => this.rowPressed(result)}
        underlayColor="gray"
      >
        <View>
          <View style={styles.rowContainer}>
            <Image
              style={styles.thumb}
              defaultSource={tempImage}
              source={picture}
            />
            <View style={styles.textContainer}>
              <Text style={styles.header}>{name}</Text>
              <Text style={styles.area}>{area}</Text>
              <View style={styles.yelpContainer}>
                <Text style={styles.reviewCount} numberOfLines={1}>
                  {reviews} on
                </Text>
                <Image
                  style={styles.yelpLogo}
                  source={require("../assets/yelpLogo.png")}
                />
              </View>
              <Image style={styles.stars} source={starRatingImage} />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const results = this.props.navigation.getParam("results");
    var goodResults = results.filter(this.hasAddressOrNumber);

    return (
      <FlatList
        data={goodResults}
        keyExtractor={this._keyExtractor.bind(this)}
        renderItem={this.renderRow.bind(this)}
        ItemSeparatorComponent={(sectionid, rowid) => (
          <View key={`${sectionid}-${rowid}`} style={styles.fatSeparator} />
        )}
      />
      // <ListView
      //   dataSource={this.state.dataSource}
      //   scrollRenderAheadDistance={20}
      //   renderRow={this.renderRow.bind(this)}
      // renderseparator={(sectionid, rowid) => (
      //   <view key={`${sectionid}-${rowid}`} style={styles.fatseparator} />
      // )}
      // />
    );
  }
}

module.exports = SearchResults;
