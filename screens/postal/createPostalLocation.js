import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	SafeAreaView,
	View,
	Platform,
} from "react-native";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
	Divider,
	Input,
	Button,
	Text,
	Icon,
	TopNavigation,
	TopNavigationAction,
} from "@ui-kitten/components";

import appConfigs from "../../config";

import Spinner from "react-native-loading-spinner-overlay";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

function CreatePostalLocationScreen(props) {
	const navigation = useNavigation();

	const renderIcon = (props) => <Icon {...props} name="home-outline" />;

	let renderItem = ({ item, index }) => {
		return (
			<ListItem
				key={item.id}
				title={`${item.name}`}
				description={`${item.code}`}
				onPress={() => navigation.navigate("Postal", { postal: item })}
				accessoryLeft={renderIcon}
			/>
		);
	};

	const SearchIcon = (props) => <Icon {...props} name="search-outline" />;
	const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

	const renderBackAction = () => (
		<TopNavigationAction
			icon={BackIcon}
			onPress={() => props.navigation.goBack()}
		/>
	);

	return (
		<SafeAreaView
			style={{
				backgroundColor: "#fff",
				height: Dimensions.get("window").height,
				paddingTop: Platform.OS === "android" ? 25 : 0,
			}}
		>
			<TopNavigation
				alignment="center"
				title="Nhập địa chỉ của bạn"
				accessoryLeft={renderBackAction}
				// accessoryRight={renderRightActions}
			/>
			<Divider />

			<GooglePlacesAutocomplete
				placeholder="Tìm kiếm"
				query={{
					key: appConfigs.GOOGLE_MAP.API_KEY_2,
					language: "vi", // language of the results
					components: "country:vn",
				}}
				onPress={(data, details = null) => {
					console.log(data);
					console.log(348, data.description);
					// setAddressInput(data.description);
					// fetchGeocode(data.description);
				}}
				onFail={(error) => console.error(error)}
				// requestUrl={{
				// 	url:
				// 		"https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api",
				// 	useOnPlatform: "web",
				// }} // this in only required for use on the web. See https://git.io/JflFv more for details.
				// currentLocation={true}
				// currentLocationLabel="Hiện tại"
				styles={{
					textInputContainer: {
						borderColor: "#e4e6ef",
						padding: 10,
						backgroundColor: "#e4e6ef",
					},
					textInput: {
						borderColor: "#e4e6ef",
						height: 38,
						color: "#5d5d5d",
						fontSize: 16,
					},
					predefinedPlacesDescription: {
						color: "#1faadb",
					},
				}}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	// attachButton: {
	// 	borderRadius: 24,
	// 	marginHorizontal: 8,
	// },
});

function mapStateToProps(state) {
	return { favs: state.favs };
}

export default connect(mapStateToProps, null)(CreatePostalLocationScreen);
