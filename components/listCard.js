import React, { useState, useEffect } from "react";
import { Button, Overlay } from "react-native-elements";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import { connect } from "react-redux";

// import BASE URL
import { BASE_URL } from "../components/environment";
import { useNavigation } from "@react-navigation/native";
import { AlineButton } from "./aline-lib";

function ListCard(props) {
  const navigation = useNavigation();

  const [liked, setLiked] = useState(false);
  const [visible, setVisible] = useState(false);

  // verifier si la place est dans les favoris
  useEffect(() => {
    const getLiked = async () => {
      if (props.favs.length == 0 || props.favs == undefined) {
        setLiked(false);
      } else {
        props.favs.forEach((fav) => {
          if (fav._id == props.place.id) {
            setLiked(true);
          }
        });
      }
    };
    getLiked();
  }, [props.favs]);

  // afficher la modal
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const addFav = async (id) => {
    // si token n'existe pas
    if (!props.token || props.token == "" || props.token == undefined) {
      toggleOverlay();
    } else {
      // if liked = false alors fetch pour ajouter
      if (liked == false) {
        var rawResponse = await fetch(
          `${BASE_URL}/users/mobile/add-fav?token=${props.token}&placeid=${id}`
        );
        var response = await rawResponse.json();
        if (response) {
          props.updateFavsRedux(response);
          setLiked(!liked);
        }
      } else if (liked == true) {
        // if liked = tru alors fetch pour supprime
        var rawResponse = await fetch(
          `${BASE_URL}/users/mobile/delete-fav?token=${props.token}&placeid=${id}`
        );
        var response = await rawResponse.json();
        if (response) {
          props.updateFavsRedux(response);
          setLiked(!liked);
        }
      }
    }
  };

  return (
    <View
      key={props.place.id}
      style={{
        width: "100%",
        marginHorizontal: 0,
        marginBottom: 30,
        paddingBottom: 30,
        borderBottomColor: greyLight,
        borderBottomWidth: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      <View
        style={{
          ...styles.myCard,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {/*<Image
          source={{
            uri:
              props.place.image_url &&
              props.place.image_url != "" &&
              props.place.image_url != undefined
                ? props.place.image_url
                : "https://i.imgur.com/aWZCcAm.png",
          }}
          style={{ width: 90, height: 90 }}
        />*/}
        <View style={{ ...styles.myTitle }}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text
              style={{
                ...styles.h3blue,
                fontSize: 20,
                paddingBottom: 4,
                paddingRight: 10,
              }}
            >
              {props.place.name}
            </Text>
          </View>
        </View>
        {/*
        <View style={{ width: 30, marginHorizontal: 5 }}>
          <TouchableOpacity onPress={() => addFav(props.place.id)}>
            {liked ? (
              <FontAwesome name="heart" size={24} color={tomato} />
            ) : (
              <FontAwesome name="heart-o" size={24} color={grayMedium} />
            )}
          </TouchableOpacity>
        </View>
        */}
      </View>
      <View style={{ ...styles.myCard }}>
        <Text style={{ ...styles.current16 }}>{props.place.postal_code}</Text>
      </View>
    </View>
  );
}

// colors vars
var blueDark = "#033C47";
var mintLight = "#D5EFE8";
var mint = "#0469c1";
var grayMedium = "#879299";
var graySuperLight = "#f4f4f4";
var greyLight = "#d8d8d8";
var gold = "#E8BA00";
var goldLight = "#faf1cb";
var tomato = "#ec333b";
var peach = "#ef7e67";
var peachLight = "#FED4CB";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  myCard: {
    width: Dimensions.get("window").width - 40,
  },
  myTitle: {
    // width: Dimensions.get("window").width - 170,
  },
  current16: {
    fontSize: 16,
    color: blueDark,
  },
  h3blue: {
    color: blueDark,
    fontSize: 16,
    letterSpacing: -0.7,
  },
});

function mapStateToProps(state) {
  return { token: state.token, favs: state.favs };
}

// apdate fav to store
function mapDispatchToProps(dispatch) {
  return {
    updateFavsRedux: function (favs) {
      dispatch({ type: "updateFavs", favs });
    },
  };
}

// keep this line at the end
export default connect(mapStateToProps, mapDispatchToProps)(ListCard);
