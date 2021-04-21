import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Image,
	ImageBackground,
	TouchableOpacity,
	Dimensions,
	SafeAreaView,
} from "react-native";
import { connect } from "react-redux";

import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import {
	Layout,
	Input,
	Button,
	Text,
	Icon,
	TopNavigation,
	TopNavigationAction,
	OverflowMenu,
	MenuItem,
	Divider,
} from "@ui-kitten/components";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import Geocode from "react-geocode";
import MapView, { Marker } from "react-native-maps";

// fonts
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import { useMutation, useLazyQuery } from "@apollo/client";
import {
	MUTATION_CREATE_POSTAL,
	QUERY_GET_POSTAL,
	MUTATION_UPDATE_POSTAL,
} from "../../graphql/query";

import appConfigs from "../../config";

Geocode.setApiKey(appConfigs.GOOGLE_MAP.API_KEY_2);

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const MenuIcon = (props) => <Icon {...props} name="more-vertical" />;

const InfoIcon = (props) => <Icon {...props} name="info" />;

const LogoutIcon = (props) => <Icon {...props} name="log-out" />;

function createPostalLocationScreen(props) {
	const mapRef = React.useRef();
	
	const [
		createPostal,
		{ loading: queryLoading, error: queryError, data: dataCreatePostal },
	] = useMutation(MUTATION_CREATE_POSTAL, {
		onCompleted: (dataCreatePostal) => {
			console.log("onCompleted");
			console.log(dataCreatePostal);

			if (dataCreatePostal.insert_postals.returning[0].id) {
				props.navigation.navigate("MyPostal");



			} else {
				console.log("some errror in response");
			}

			// setAllPostalList(data.postals);
		},
		onError: (queryError) => {
			console.log("onError");
			console.log(queryError);
		},
	});

	const [
		getPostal,
		{
			error: errorGet,
			called: calledGet,
			loading: loadingGet,
			data: dataGet,
		},
	] = useLazyQuery(QUERY_GET_POSTAL, {
		onCompleted: (dataGet) => {
			setLoading(false);
			console.log("dataGet");
			console.log(dataGet);
			console.log(dataGet.postals[0].name);

			setNameInput(dataGet.postals[0].name);
			setAddressInput(dataGet.postals[0].address);
			setCurrentLat(dataGet.postals[0].lat);
			setCurrentLong(dataGet.postals[0].lng);
		},
		onError: (errorGet) => {
			console.log("onError");
			console.log(errorPostal);
		},
	});

	const [
		updatePostal,
		{
			error: errorUpdate,
			called: calledUpdate,
			loading: loadingUpdate,
			data: dataUpdate,
		},
	] = useMutation(MUTATION_UPDATE_POSTAL, {
		onCompleted: (dataUpdate) => {
			console.log("dataUpdate");
			console.log(dataUpdate);
		},
		onError: (errorPostal) => {},
	});

	const [nameInput, setNameInput] = useState("");
	const [addressInput, setAddressInput] = useState("");

	const [currentLat, setCurrentLat] = useState(null);
	const [currentLong, setCurrentLong] = useState(null);
	const [loadingAddress, setLoadingAddress] = useState(false);
	const [loading, setLoading] = useState(false);

	const [menuVisible, setMenuVisible] = useState(false);

	let isUpdate = props.route.params.isUpdate;

	useEffect(() => {
		if (!props.token) {
			props.navigation.navigate("SignIn");
		}

		if (props.route.params.isUpdate == true) {
			getPostal({ variables: { id: props.route.params.postal.id } });
		} else {
			async function askPermissions() {
				var response = await Permissions.askAsync(Permissions.LOCATION);

				console.log("askPermissions response");
				console.log(response);

				if (response.status == "granted") {
					setLoadingAddress(true);
					console.log("askPermissions granted");

					let location = await Location.getCurrentPositionAsync();
					console.log(location);
					// setCurrentLocation(location);

					// Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
					// 	console.log(
					// 		"askPermissions here location: ",
					// 		location.coords.latitude,
					// 		location.coords.longitude
					// 	);

					if (
						location.coords.latitude != null &&
						location.coords.longitude != null
					) {
						setCurrentLat(location.coords.latitude);
						setCurrentLong(location.coords.longitude);
					}

					fetchAddress(
						location.coords.latitude,
						location.coords.longitude
					);

					// });
				} else {
					console.log("else");
				}
			}

			askPermissions();
		}
	}, []);

	async function fetchAddress(lat, lng) {
		Geocode.fromLatLng(lat, lng).then(
			(response) => {
				// console.log(105, response);

				const address = response.results[0].formatted_address;
				setAddressInput(address);
				mapRef.current?.setAddressText(address);
				setLoadingAddress(false);
				console.log(address);
			},
			(error) => {
				console.error(error);
			}
		);
	}

	async function fetchGeocode(address) {
		Geocode.fromAddress(address).then(
			(response) => {
				const { lat, lng } = response.results[0].geometry.location;
				console.log(22222222, lat, lng);

				setCurrentLat(lat);
				setCurrentLong(lng);

				mapRef.current.fitToSuppliedMarkers(
					markers.map(({ _id }) => _id)
				);
			},
			(error) => {
				console.error(error);
			}
		);
	}

	// if (queryLoading) return <Text>Loading...</Text>;
	// if (queryError) {
	//     console.log('queryError')
	//     console.log(queryError)
	// }

	// if (dataCreatePostal) {
	//     console.log('dataCreatePostal')
	//     console.log(dataCreatePostal)
	// }

	function onClickCreate() {
		console.log(132, props.infos);

		createPostal({
			variables: {
				name: nameInput,
				address: addressInput,
				type: 2,
				image_url: "https://i.imgur.com/fkmKq6F.png",
				lat: currentLat.toString(),
				lng: currentLong.toString(),
				uid: props.infos.id,
			},
		});
	}

	function onClickUpdate() {}

	if (!props.token) {
		props.navigation.navigate("SignIn");
	}

	const renderPhotoButton = () => (
		<Button
			style={styles.photoButton}
			size="small"
			status="basic"
			icon={CameraIcon}
		/>
	);

	const renderBackAction = () => (
		<TopNavigationAction
			icon={BackIcon}
			onPress={() =>
				isUpdate == true
					? props.navigation.navigate("MyPostal")
					: props.navigation.navigate("More")
			}
		/>
	);

	const toggleMenu = () => {
		setMenuVisible(!menuVisible);
	};

	const renderMenuAction = () => (
		<TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
	);

	const renderRightActions = () => (
		<React.Fragment>
			{isUpdate == true && (
				<OverflowMenu
					anchor={renderMenuAction}
					visible={menuVisible}
					onBackdropPress={toggleMenu}
				>
					<MenuItem
						accessoryLeft={InfoIcon}
						title="Xoá"
						onSelect={() => console.log("work")}
					/>
				</OverflowMenu>
			)}
			{isUpdate == false && <TopNavigationAction icon={SubmitIcon} />}
		</React.Fragment>
	);

	const onRegionChange = (region) => {
		console.log(26999999, region);
		console.log(11111111, region.nativeEvent.coordinate);
		fetchAddress(
			region.nativeEvent.coordinate.latitude,
			region.nativeEvent.coordinate.longitude
		);
		// console.log(27000000, region.latitude)
	};

	const onClickDeleteModal = async () => {
		console.log("onClickDeleteModal");

		// Alert.alert(
		// 	"Xoá địa điểm",
		// 	"My Alert Msg",
		// 	[
		// 		{
		// 			text: "Cancel",
		// 			onPress: () => console.log("Cancel Pressed"),
		// 			style: "cancel",
		// 		},
		// 		{ text: "OK", onPress: () => console.log("OK Pressed") },
		// 	],
		// 	{ cancelable: false }
		// );
	};

	// useEffect(() => {
	// 	ref.current?.setAddressText(addressInput);
	// }, []);

	const SubmitIcon = (props) => (
		<Button
			status="info"
			size='small'
			style={{ marginTop: 15 }}
			onPress={() => onClickCreate()}
		>
			{isUpdate == true ? "Lưu" : "Tạo"}
		</Button>
	);

	return (
		<SafeAreaView
			style={{ paddingTop: 20, height: Dimensions.get("window").height }}
		>
			<TopNavigation
				alignment="center"
				title={isUpdate == true ? "Chỉnh sửa" : "Đăng ký mã bưu chính"}
				accessoryLeft={renderBackAction}
				accessoryRight={renderRightActions}
			/>
			<Divider />

			<View
				style={{
					backgroundColor: "#fff",
					height: Dimensions.get("window").height,
				}}
			>
				<Text
					style={{
						marginTop: 5,
						paddingTop: 6,
						paddingHorizontal: 10,
						paddingBottom: 8,
					}}
				>
					Tên địa điểm
				</Text>
				<Input
					style={{ paddingHorizontal: 10 }}
					placeholder=""
					value={nameInput}
					onChangeText={(text) => setNameInput(text)}
				/>
				<Text
					style={{
						marginTop: 5,
						paddingTop: 6,
						paddingHorizontal: 10,
						paddingBottom: 8,
					}}
				>
					Địa chỉ
				</Text>
				<GooglePlacesAutocomplete
					ref={mapRef}
					placeholder="Tìm kiếm"
					query={{
						key: appConfigs.GOOGLE_MAP.API_KEY_2,
						language: "vi", // language of the results
						components: "country:vn",
					}}
					onPress={(data, details = null) => {
						console.log(data);
						console.log(348, data.description);
						setAddressInput(data.description);
						fetchGeocode(data.description);
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
							borderColor: "1px solid #e4e6ef",
							padding: 10,
							backgroundColor: "#e4e6ef",
						},
						textInput: {
							borderColor: "1px solid #e4e6ef",
							height: 38,
							color: "#5d5d5d",
							fontSize: 16,
						},
						predefinedPlacesDescription: {
							color: "#1faadb",
						},
					}}
				/>

				{/*<Text
					style={{
						marginTop: 5,
						paddingTop: 6,
						paddingBottom: 8,
					}}
				>
					Địa chỉ{" "}
					{loadingAddress == true
						? "(Đang xác địa địa chỉ của bạn)"
						: ""}
				</Text>
				<Input
					placeholder=""
					value={addressInput}
					onChangeText={(text) => setAddressInput(text)}
					style={{ paddingBottom: 10 }}
				/>*/}

				{currentLat != null && currentLong != null && (
					<MapView
						initialRegion={{
							latitude: parseFloat(currentLat),
							longitude: parseFloat(currentLong),
							// latitudeDelta: appConfigs.GOOGLE_MAP.latitudeDelta,
							// longitudeDelta: appConfigs.GOOGLE_MAP.longitudeDelta,
							latitudeDelta: 0.009,
							longitudeDelta: 0.001,
						}}
						//hiển thị chấm xanh
						// showsUserLocation={true}
						// showsMyLocationButton={true}
						// followsUserLocation={true}
						// showsMyLocationButton={true}
						// loadingEnabled={true}
						style={styles.mapStyle}
						// customMapStyle={mapStyle}
					>
						<MapView.Marker
							key={"marker_here"}
							draggable
							coordinate={{
								latitude: parseFloat(currentLat),
								longitude: parseFloat(currentLong),
							}}
							onSelect={(e) => console.log("onSelect", e)}
							// onDrag={(e) => console.log("onDrag", e)}
							// onDragStart={(e) => console.log("onDragStart", e)}
							onDragEnd={(region) => onRegionChange(region)}
							onPress={(e) => console.log("onPress", e)}
						/>
					</MapView>
				)}
			</View>
		</SafeAreaView>
	);
}

// STYLES
const styles = StyleSheet.create({
	container: {
		flex: 1,
		// alignItems: "center",
		justifyContent: "flex-start",
		backgroundColor: "#fff",
	},
	head: {
		backgroundColor: "#fff",
		width: "100%",
		marginTop: 50,
		marginBottom: 0,
		paddingHorizontal: 25,
		paddingVertical: 10,
		margin: 0,
		borderBottomColor: "#879299",
		borderBottomWidth: 1,
		height: 50,
		// position: "absolute",
	},
	mapStyle: {
		width: Dimensions.get("window").width,
		height: 275,
	},
});

function mapStateToProps(state) {
	return { infos: state.infos, token: state.token };
}

// keep this line at the end
export default connect(mapStateToProps, null)(createPostalLocationScreen);
