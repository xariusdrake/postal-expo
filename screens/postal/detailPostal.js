import React, { useState, useEffect } from "react";
import {
	View,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
} from "react-native";

import { connect } from "react-redux";
import * as Location from "expo-location";

import { Card, Text } from "@ui-kitten/components";
import MapView from "react-native-maps";

import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import Geocode from "react-geocode";

import appConfigs from "../../config";

// styles
import { styles } from "../styles/styles";

Geocode.setApiKey(appConfigs.GOOGLE_MAP.API_KEY_2);

function DetailPostalScreen(props) {
	var response = props.route.params;

	const [getAddress, setAddress] = useState(null);

	const [getLatitude, setLatitude] = useState(null);
	const [getLongtitude, setLongtitude] = useState(null);

	useEffect(() => {
		(async () => {
			if (response.postal.type == 1) {
				attemptGeocodeAsync();
			} else if (response.postal.type == 2) {

				if (response.postal.lat > 0) {
					setLatitude(Number(response.postal.lat))
					setLongtitude(Number(response.postal.long))
				}

			}
		})();
	}, []);

	const attemptGeocodeAsync = async () => {

		console.log(140, "_attemptGeocodeAsync");

		let valueSearch = response.postal.name;
		valueSearch = valueSearch.replace("(", "").replace(")", "");
		// valueSearch = valueSearch + " Vietnam";

		console.log("valueSearch");
		console.log(valueSearch);

		Geocode.fromAddress(valueSearch).then(
			(response) => {
				console.log("from address");
				console.log(response);

				if (response.results[0].geometry.location.lat > 1) {
					console.log("work");
					setLatitude(response.results[0].geometry.location.lat);
					setLongtitude(response.results[0].geometry.location.lng);

					let address = response.results[0].formatted_address;
					address = address.replace(", Vietnam", "");
					setAddress(address);
				}
			},
			(error) => {
				console.error(error);
			}
		);

		// try {
		// 	let result = await Location.geocodeAsync(valueSearch);

		// 	console.log("geo result: " + result);
		// 	console.log(result);

		// 	if (result[0].latitude > 1) {
		// 		console.log("work");
		// 		setLatitude(result[0].latitude);
		// 		setLongtitude(result[0].longitude);
		// 	}
		// } catch (e) {
		// 	console.log("geo catch: " + e.message);
		// } finally {
		// 	console.log("geo finally");
		// }

		// console.log(90, getLocation);
	};

	function translateAddress(address) {
		let address = address.replace("District", "");
		return 1
	}

	return (
		<View>
			<View style={{ ...styles.head }}>
				<TouchableOpacity
					onPress={() => props.navigation.goBack()}
					title="Dismiss"
				>
					<Ionicons
						name="md-close"
						size={34}
						color={"#879299"}
						style={{ textAlign: "right" }}
					/>
				</TouchableOpacity>
			</View>
			<Card>
				<Text category="h4" status="info" style={{ paddingBottom: 20 }}>
					{response.postal.name}
				</Text>
				<Text>
					Mã bưu chính:{" "}
					{response.postal.postal_code != null
						? response.postal.postal_code
						: "Đang cập nhật"}
				</Text>
				<Text>
					Số điện thoại:{" "}
					{response.postal.phone != null
						? response.postal.phone
						: "Đang cập nhật"}
				</Text>
				{response.postal.type == 1 && (
					<Text>
						Địa chỉ: {getAddress != null ? translateAddress(getAddress) : "Đang cập nhật"}
					</Text>
				)}
				{response.postal.type == 2 && (
					<Text>
						Địa chỉ: {response.postal.address != null ? translateAddress(response.postal.address) : "Đang cập nhật"}
					</Text>
				)}
			</Card>

			{getLatitude != null && getLongtitude != null && (
				<MapView
					initialRegion={{
						latitude: getLatitude,
						longitude: getLongtitude,
						// latitudeDelta: appConfigs.GOOGLE_MAP.latitudeDelta,
						// longitudeDelta: appConfigs.GOOGLE_MAP.longitudeDelta,
						latitudeDelta: 0.009,
						longitudeDelta: 0.001,
					}}
					//hiển thị chấm xanh
					showsUserLocation={true}
					showsMyLocationButton={true}
					followsUserLocation={true}
					showsMyLocationButton={true}
					loadingEnabled={true}
					style={stylesX.mapStyle}
					// customMapStyle={mapStyle}
				>
					<MapView.Marker
						title={response.postal.name}
						key={1}
						coordinate={{
							latitude: getLatitude,
							longitude: getLongtitude,
						}}
					/>
				</MapView>
			)}
		</View>
	);
}

function mapDispatchToProps(dispatch) {
	return {
		storeFav: function (favs) {
			dispatch({ type: "updateFavs", favs });
		},
	};
}

function mapStateToProps(state) {
	return { favs: state.favs, token: state.token };
}

const stylesX = StyleSheet.create({
	mapStyle: {
		width: Dimensions.get("window").width,
		height: 275,
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailPostalScreen);
