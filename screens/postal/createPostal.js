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
	Select,
	SelectItem,
	IndexPath,
} from "@ui-kitten/components";
import axios from "axios";

import HTTPRequest from "../../functions/httpRequest.js";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Spinner from "react-native-loading-spinner-overlay";

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
	QUERY_GET_INFO_USER,
} from "../../graphql/query";

import appConfigs from "../../config";
import DataPostalLevel1 from "./data/postal_level_1.json";

Geocode.setApiKey(appConfigs.GOOGLE_MAP.API_KEY_2);

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const MenuIcon = (props) => <Icon {...props} name="more-vertical" />;

const InfoIcon = (props) => <Icon {...props} name="info" />;

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
				getInfoUser({ variables: { uid: props.infos.id } });
			} else {
				console.log("some errror in response");
			}

			// setAllPostalList(data.postals);
		},
		onError: (queryError) => {
			setLoading(false);
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
		fetchPolicy: "no-cache",
		onCompleted: (dataGet) => {
			setLoading(false);
			console.log("dataGet");
			console.log(dataGet);
			console.log(dataGet.postals[0].name);

			setNameInput(dataGet.postals[0].name);
			setAddressInput(dataGet.postals[0].address);
			setPhoneInput(dataGet.postals[0].phone);
			mapRef.current?.setAddressText(dataGet.postals[0].address);
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
		fetchPolicy: "no-cache",
		onCompleted: (dataUpdate) => {
			console.log("dataUpdate");
			console.log(dataUpdate);
			setLoading(false);
		},
		onError: (errorPostal) => {},
	});

	const [
		getInfoUser,
		{ loading: loadingUser, error: errorUser, data: dataUser },
	] = useLazyQuery(QUERY_GET_INFO_USER, {
		fetchPolicy: "no-cache",
		onCompleted: (dataUser) => {
			setLoading(false);
			console.log("xxx onCompleted");
			console.log(62, dataUser);
			console.log(63, dataUser[0]);
			console.log(64, dataUser.users[0].fullname);

			props.storeUserInfo(dataUser.users[0]);
			props.navigation.navigate("MyPostal");
		},
		onError: (loadingUser) => {
			setLoading(false);
			console.log("loadingUser");
			console.log(loadingUser);
		},
	});

	const [indexLevel1, setIndexLevel1] = useState(new IndexPath(0));
	const [displayLevel1, setDisplayLevel1] = useState("Chọn tỉnh/thành phố");

	const [indexLevel2, setIndexLevel2] = useState(new IndexPath(0));
	const [displayLevel2, setDisplayLevel2] = useState("Chọn huyện");
	const [dataPostalLevel2, setDataPostalLevel2] = useState([]);

	const [indexLevel3, setIndexLevel3] = useState(new IndexPath(0));
	const [displayLevel3, setDisplayLevel3] = useState("Chọn xã");
	const [dataPostalLevel3, setDataPostalLevel3] = useState([]);
	const [codeArea, setCodeArea] = useState(null);

	const [nameInput, setNameInput] = useState("");
	const [phoneInput, setPhoneInput] = useState("");
	const [addressInput, setAddressInput] = useState("");

	const [currentLat, setCurrentLat] = useState(null);
	const [currentLong, setCurrentLong] = useState(null);
	const [loadingAddress, setLoadingAddress] = useState(false);
	const [loading, setLoading] = useState(false);

	const [menuVisible, setMenuVisible] = useState(false);
	const [isMain, setIsMain] = useState(true);

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

					// fetchAddress(
					// 	location.coords.latitude,
					// 	location.coords.longitude
					// );

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
				console.log(222, response);
				console.log(333, address);
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

		console.log(264, {
			name: nameInput,
			phone: phoneInput.toString(),
			address: addressInput,
			type: 99,
			image_url: "https://i.imgur.com/fkmKq6F.png",
			lat: currentLat.toString(),
			lng: currentLong.toString(),
			uid: props.infos.id,
		});

		setLoading(true);

		if (isUpdate == true) {
			console.log("update postal");

			updatePostal({
				variables: {
					id: props.route.params.postal.id,
					name: nameInput,
					phone: phoneInput.toString(),
					address: addressInput,
					lat: currentLat.toString(),
					lng: currentLong.toString(),
					uid: props.infos.id,
				},
			});
		} else {
			createPostal({
				variables: {
					name: nameInput,
					phone: phoneInput.toString(),
					address: addressInput,
					code_area: codeArea,
					type: 99,
					image_url: "https://i.imgur.com/fkmKq6F.png",
					lat: currentLat.toString(),
					lng: currentLong.toString(),
					uid: props.infos.id,
				},
			});
		}
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

	const renderBackMain = () => (
		<TopNavigationAction icon={BackIcon} onPress={() => setIsMain(true)} />
	);

	const toggleMenu = () => {
		setMenuVisible(!menuVisible);
	};

	const renderMenuAction = () => (
		<TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
	);

	// const renderRightActions = () => (
	// 	<React.Fragment>
	// 		{isUpdate == true && (
	// 			<OverflowMenu
	// 				anchor={renderMenuAction}
	// 				visible={menuVisible}
	// 				onBackdropPress={toggleMenu}
	// 			>
	// 				<MenuItem
	// 					accessoryLeft={InfoIcon}
	// 					title="Xoá"
	// 					onSelect={() => console.log("work")}
	// 				/>
	// 			</OverflowMenu>
	// 		)}
	// 		{/*isUpdate == false && <TopNavigationAction icon={SubmitIcon} />*/}
	// 	</React.Fragment>
	// );

	const renderRightLocation = () => (
		<Button size="small" onPress={() => setIsMain(true)}>
			Tiếp tục
		</Button>
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

	// useEffect(() => {
	// 	ref.current?.setAddressText(addressInput);
	// }, []);

	const SubmitIcon = (props) => (
		<Button
			status="info"
			size="small"
			style={{ marginTop: 15 }}
			onPress={() => onClickCreate()}
		>
			{isUpdate == true ? "Lưu" : "Tạo"}
		</Button>
	);

	return (
		<SafeAreaView
			style={{
				backgroundColor: "#fff",
				height: Dimensions.get("window").height,
				paddingTop: Platform.OS === "android" ? 25 : 0,
			}}
		>
			{isMain == true && (
				<React.Fragment>
					<TopNavigation
						alignment="center"
						title={
							isUpdate == true
								? "Chỉnh sửa"
								: "Đăng ký mã bưu chính"
						}
						accessoryLeft={renderBackAction}
						// accessoryRight={renderRightActions}
					/>
					<Divider />
					<Spinner visible={loading} />
					{/*
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
					*/}

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
						Số điện thoại
					</Text>
					<Input
						style={{ paddingHorizontal: 10 }}
						placeholder=""
						value={phoneInput}
						keyboardType="number-pad"
						onChangeText={(text) => setPhoneInput(text)}
						keyboardType="numeric"
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
					<Select
						placeholder="Chọn tỉnh thành"
						value={displayLevel1}
						selectedIndex={indexLevel1}
						onSelect={(index) => {
							setIndexLevel1(index);
							setDisplayLevel1(
								DataPostalLevel1[index.row]["name"]
							);

							// fetchGeocode(DataPostalLevel1[index.row]["name"])
							axios({
								method: "get",
								url:
									"https://api.mabuuchinh.vn/api/v1/MBC/GetAdministrativeAgencies?parentPostCode=" +
									DataPostalLevel1[index.row]["code"],
								headers: {
									accept: "text/plain",
								},
							})
								.then((data) => {
									console.log("data", data);
									setDataPostalLevel2(data.data);
								})
								.catch((e) => {
									console.log("error", e);
								});
						}}
						style={{ paddingHorizontal: 10, paddingBottom: 10 }}
					>
						{DataPostalLevel1.map((postal) => (
							<SelectItem title={postal.name} />
						))}
					</Select>
					<Select
						placeholder="Chọn tỉnh thành"
						value={displayLevel2}
						selectedIndex={indexLevel2}
						onSelect={(index) => {
							setIndexLevel2(index);
							setDisplayLevel2(
								dataPostalLevel2[index.row]["name"].replace(
									"tỉnh " + displayLevel1,
									""
								)
							);

							// fetchGeocode(dataPostalLevel2[index.row]["name"])
							axios({
								method: "get",
								url:
									"https://api.mabuuchinh.vn/api/v1/MBC/GetAdministrativeAgencies?parentPostCode=" +
									dataPostalLevel2[index.row]["postcode"],
								headers: {
									accept: "text/plain",
								},
							})
								.then((data) => {
									console.log("data", data);
									setDataPostalLevel3(data.data);
								})
								.catch((e) => {
									console.log("error", e);
								});
						}}
						style={{ paddingHorizontal: 10, paddingBottom: 10 }}
					>
						{dataPostalLevel2.map((postal) => (
							<SelectItem
								title={postal.name.replace(
									"tỉnh " + displayLevel1,
									""
								)}
							/>
						))}
					</Select>
					<Select
						placeholder="Chọn tỉnh thành"
						value={displayLevel3}
						selectedIndex={indexLevel3}
						onSelect={(index) => {
							setIndexLevel3(index);
							setDisplayLevel3(
								dataPostalLevel3[index.row]["name"]
									.replace("tỉnh " + displayLevel1, "")
									.replace(displayLevel2, "")
							);

							console.log(
								601,
								dataPostalLevel3[index.row]["postcode"]
							);

							setCodeArea(
								dataPostalLevel3[index.row]["postcode"]
							);

							// fetchGeocode(dataPostalLevel3[index.row]["name"])
						}}
						style={{ paddingHorizontal: 10, paddingBottom: 10 }}
					>
						{dataPostalLevel3.map((postal) => (
							<SelectItem
								title={postal.name
									.replace("tỉnh " + displayLevel1, "")
									.replace(""+ displayLevel2, "")}
							/>
						))}
					</Select>
					<Text
						style={{
							marginTop: 5,
							paddingTop: 6,
							paddingHorizontal: 10,
							paddingBottom: 8,
						}}
					>
						Địa chỉ (số nhà, đường)
					</Text>
					<Input
						style={{ paddingHorizontal: 10 }}
						placeholder=""
						value={addressInput}
						onChangeText={(text) => setAddressInput(text)}
					/>

					{/*<Text
						style={{
							marginTop: 5,
							paddingTop: 6,
							paddingHorizontal: 10,
							paddingBottom: 8,
						}}
					>
						Địa chỉ
					</Text>
					<TouchableOpacity onPress={() => setIsMain(false)}>
						<View style={styles.input}>
							<Text style={styles.input_text}>
								{addressInput
									? addressInput
									: "Nhập địa chỉ của bạn"}
							</Text>
						</View>
					</TouchableOpacity>*/}

					<Button
						style={{ marginHorizontal: 10, marginTop: 15 }}
						onPress={() => onClickCreate()}
					>
						{isUpdate == true ? "Lưu" : "Đăng ký"}
					</Button>
				</React.Fragment>
			)}

			{isMain == false && (
				<React.Fragment>
					<TopNavigation
						alignment="center"
						title="Nhập địa chỉ của bạn"
						accessoryLeft={renderBackMain}
						accessoryRight={renderRightLocation}
					/>
					<Divider />

					<GooglePlacesAutocomplete
						// ref={mapRef}
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
							// setIsMain(true);
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
				</React.Fragment>
			)}
		</SafeAreaView>
	);
}

// STYLES
const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
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
		height: 200,
	},
	input: {
		backgroundColor: "rgb(247, 249, 252)",
		borderColor: "#rgb(228, 233, 242)",
		height: 45,
		borderWidth: 1,
		borderRadius: 11,
		paddingHorizontal: 10,
		marginLeft: 10,
		marginRight: 10,
		paddingVertical: 10,
		// justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
	},
	input_icon: {
		color: "rgba(0, 0, 0, 0.4)",
		marginRight: 10,
	},
	input_text: {
		color: "rgba(0, 0, 0, 0.45)",
		fontSize: 15,
	},
});

function mapDispatchToProps(dispatch) {
	return {
		storeData: function (token) {
			dispatch({ type: "saveToken", token });
		},
		storeUserInfo: function (infos) {
			dispatch({ type: "saveUserInfo", infos });
		},
	};
}

function mapStateToProps(state) {
	return { infos: state.infos, token: state.token };
}

// keep this line at the end
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(createPostalLocationScreen);
