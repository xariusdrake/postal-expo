import React, { useState, useEffect } from "react";

// import {
// 	StyleSheet,
// 	View,
// 	Dimensions,
// 	SafeAreaView,
// 	TouchableOpacity,
// 	Text,
// 	TextInput,
// 	Image,
// 	PermissionsAndroid,
// 	Platform,
// 	Alert,
// } from "react-native";

import {
	Container,
	Text,
	// Header,
	Footer,
	Left,
	Body,
	FooterTab,
	Tabs,
	Tab,
} from "native-base";
import {
	SafeAreaView,
	// TouchableOpacity,
	TextInput,
	PermissionsAndroid,
	StyleSheet,
	ImageBackground,
	Dimensions,
	Image,
	View,
	Alert,
	Platform,
	Linking,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import SegmentedControl from "@react-native-community/segmented-control";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as geolib from "geolib";
import { connect } from "react-redux";
import { useQuery, useLazyQuery, gql, useMutation } from "@apollo/client";
import { Input, Button, Icon } from "@ui-kitten/components";
import { data } from "./data";

// my components
import Map from "../../components/map";
import List from "../../components/listExplore";

import Spinner from "react-native-loading-spinner-overlay";

// import BASE URL
import { BASE_URL } from "../../components/environment";
import {
	QUERY_GET_ALL_POSTAL_PLACE,
	// QUERY_SEARCH_ALL_POSTAL_PLACE,
} from "../../graphql/query";

import { TouchableOpacity } from "react-native-gesture-handler";
import HeaderComponent from "../header";

// const imgBackground = require("../../assets/background/img.jpg");
// const logoTop = require("../../assets/logo/quochuy.png");
// const flagVietNam = require("../../assets/logo/vietnam-flag.png");
// const flagEnglish = require("../../assets/logo/english-flag.png");

const MUTATION_UPDATE_POSTAL_CODE = gql`
	mutation MutationUpdatePostal($id: Int!, $code: String!) {
		update_postals(where: { id: { _eq: $id } }, _set: { code: $code }) {
			returning {
				id
			}
		}
	}
`;

// const PaperPlaneIcon = (style: ImageStyle): IconElement => (
//   <Icon {...style} name='paper-plane'/>
// );

// const PaperPlaneIcon = (props) => <Icon {...props} name="arrow-back" />;

function ExploreScreen(props) {
	const navigation = useNavigation();

	const [
		getListPostal,
		{
			onCompleted,
			networkStatus,
			error: errorPostal,
			called: calledPostal,
			loading: loadingPostal,
			data: dataPostal,
		},
	] = useLazyQuery(QUERY_GET_ALL_POSTAL_PLACE, {
		onCompleted: () => {
			console.log("onCompleted");
			setAllPostalList(dataPostal.postals);
			setLoading(false);
		},
		onError: () => {
			console.log("onError");
			console.log(errorPostal);
		},
	});

	// const [
	// 	searchPostal,
	// 	{
	// 		error: errorSearch,
	// 		called: calledSearch,
	// 		loading: loadingSearch,
	// 		data: dataSearch,
	// 	},
	// ] = useLazyQuery(QUERY_SEARCH_ALL_POSTAL_PLACE, {
	// 	onCompleted: (dataSearch) => {
	// 		console.log("onCompleted");
	// 		console.log(dataSearch);

	// 		if (dataSearch.postals.length === 0) {
	// 			setNoResultFound(true);
	// 		} else {
	// 			setNoResultFound(false);
	// 			navigation.navigate("SearchedResults", {
	// 				placesArray: dataSearch.postals,
	// 			});
	// 		}

	// 		// setAllPostalList(data.postals);
	// 	},
	// 	onError: (errorSearch) => {
	// 		console.log("onError");
	// 		console.log(errorSearch);
	// 	},
	// });

	const [
		updateCode,
		{
			error: errorCode,
			called: calledCode,
			loading: loadingCode,
			data: dataCode,
		},
	] = useMutation(MUTATION_UPDATE_POSTAL_CODE, {
		onCompleted: (dataCode) => {
			console.log(114, dataCode);
		},
		onError: (errorCode) => {
			console.log(116, errorCode);
		},
	});

	const [mapListIndex, setMapListIndex] = useState(0); // O = 'Carte'  -   1 = 'Liste'
	const [currentLat, setCurrentLat] = useState(48.8648758);
	const [currentLong, setCurrentLong] = useState(2.3501831);
	const [region, setRegion] = useState({
		latitude: 21.02828,
		longitude: 105.85388,
		latitudeDelta: 0.1,
		longitudeDelta: 0.1,
	});

	const [allPostalList, setAllPostalList] = useState({});
	const [allPlacesList, setAllPlacesList] = useState({});

	const [filteredPlaces, setFilteredPlaces] = useState([]);
	const [mapReady, setMapReady] = useState(false);
	const [valueSearch, setValueSearch] = useState("");

	const [hasPermissionLocation, setHasPermissionLocation] = useState(null);
	const [hasPermissionCamera, setHasPermissionCamera] = useState(null);

	const [loading, setLoading] = useState(false);
	// const [searchWaiting, setSearchWaiting] = useState(false);

	// if (loading) return null;
	// if (error) return `Error! ${error}`;

	// if (data) {
	//     console.log(4999999999999999, data);
	//     // setAllPostalList(data);
	// }
	//

	async function handleKeyPress(e) {
		// We pass the new value of the text when calling onAccept
		if (e.key === "Enter") {
			// const { onAccept } = this.props;
			// onAccept && onAccept(e.target.value);
			console.log("enter");
		}
	}

	async function askPermissions() {
		var responseLocation = await Permissions.askAsync(Permissions.LOCATION);

		console.log("askPermissions response");
		console.log(responseLocation);

		if (responseLocation.status == "granted") {
			setHasPermissionLocation(true);

			console.log("askPermissions granted");

			let location = await Location.getCurrentPositionAsync();

			if (
				location.coords.latitude != null &&
				location.coords.longitude != null
			) {
				console.log(
					"askPermissions here location: ",
					location.coords.latitude,
					location.coords.longitude
				);

				setCurrentLat(location.coords.latitude);
				setCurrentLong(location.coords.longitude);
				setRegion({
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				});
			}
		} else {
			setHasPermissionLocation(false);
			Alert.alert("Quyền vị trị không được cấp. Vào cài đặt để đặt lại.");
		}

		var responseCamera = await Permissions.askAsync(Permissions.CAMERA);

		console.log("camera ask");
		console.log(responseCamera);

		if (responseCamera.status == "granted") {
			console.log("camera true");
			setHasPermissionCamera(true);
		} else {
			setHasPermissionCamera(false);
			console.log("camera false");
			// Alert.alert("Quyền vị trị không được cấp. Vào cài đặt để đặt lại.");
		}
	}

	async function onEnterSearch(value) {
		console.log(189, value);
	}

	async function findPostal(valueSearch) {
		console.log(73, valueSearch);
		// setValueSearch(valueSearch);

		// if (valueSearch.length > 0) {
		getListPostal({ variables: { text: "%" + valueSearch + "%" } });
		setLoading(true);
		// }
	}

	useEffect(() => {
		// json_data = JSON.parse(data);
		// console.log(204, data[0]);
		// let code
		// data.map(postal => {

		// 	console.log(3333333, postal.name)
		// 	code = postal.postal_code != null ? postal.postal_code.toString() : null
		// 	updateCode({variables: {id: postal.id, code: code}})

		// });

		// store default filter
		props.storeFilterDatas({
			placeDistance: 30000, // in meters
			placeName: "",
			networkName: "",
			restaurant: true,
			shop: true,
			organize: true,
			personal: true,
		});

		// const getPostals = async () => {
		// 	// var allPostals = await getListPostal({variables: {text: '%tây%'}});
		// 	var allPostals = await getListPostal();
		// };

		setMapReady(true);

		// getPostals();

		askPermissions();
	}, []);

	useEffect(() => {
		const filterPlaces = (places, filter) => {
			console.log("reload filter");

			let tempPlaces = [];

			// let filterdistance = 10000; // default 10km
			// if (filter.placeDistance != "") {
			//     filterdistance = filter.placeDistance;
			// }

			let tempArray = Object.values(places);
			tempArray.forEach((place) => {
				// console.log('loop filter', filter.organize, filter.personal)

				// get distance between user and the place
				// geolib.getDistance({placeLat, placeLong}, {userLat, userLong})
				// var distanceFromUser = geolib.getDistance(
				//     { latitude: place.latitude, longitude: place.longitude },
				//     { latitude: currentLat, longitude: currentLong }
				// );

				// if (distanceFromUser < filterdistance) {
				// if (filter.networkName == "") {

				if (filter.personal == true && place.type == 2) {
					// console.log('filtered personal', filter.personal, place.type)
					tempPlaces.push(place);
				}

				if (filter.organize == true && place.type == 1) {
					// console.log('filtered organize', filter.organize, place.type)
					tempPlaces.push(place);
				}

				if (filter.personal == false && filter.organize == false) {
					// console.log('other things')
					tempPlaces.push(place);
				}
				// } else if (filter.networkName == place.network) {
				//     tempPlaces.push(place);
				// }
				// }
			});

			let shuffled = tempPlaces
				.map((a) => ({ sort: Math.random(), value: a }))
				.sort((a, b) => a.sort - b.sort)
				.map((a) => a.value);

			console.log("list after filtered: ", shuffled);

			setFilteredPlaces(shuffled);
		};

		console.log(224, props.filter);
		filterPlaces(allPostalList, props.filter);
	}, [allPostalList, props.filter]);

	if (mapReady == false) {
		return (
			<View style={{ ...styles.loadingContainer }}>
				<Text style={{ ...styles.current }}>Đang tải bản đồ</Text>
			</View>
		);
	}

	let searchWaiting;

	// let textSearch = props.route.params.textSearch.length != null ? props.route.params.textSearch : 'Tìm kiếm'
	let textSearch = "Tìm kiếm";

	return (
		<React.Fragment>
			<Container>
				<HeaderComponent />

				<Spinner visible={loading} />
				{/*<View>
					<View
						style={styles.messageInputContainer}
						// offset={keyboardOffset}
					>
						<Input
							style={styles.messageInput}
							placeholder="Message..."
							// value={message}
							// onChangeText={setMessage}
							// icon={MicIcon}
						/>
						<Button
							appearance="ghost"
							style={[styles.iconButton, styles.sendButton]}
							icon={PaperPlaneIcon}
							// disabled={!sendButtonEnabled()}
							// onPress={onSendButtonPress}
						/>
					</View>
				</View>*/}
				<View style={{ flex: 1 }}>
					<Map
						filteredPlaces={filteredPlaces}
						userPosition={{ currentLat, currentLong }}
						region={region}
						askPermissions={() => askPermissions()}
					/>
					{/*{mapListIndex === 0 ? (
						<Map
							filteredPlaces={filteredPlaces}
							userPosition={{ currentLat, currentLong }}
							region={region}
							askPermissions={() => askPermissions()}
						/>
					) : (
						<List
							filteredPlaces={filteredPlaces}
							loading={loadingPostal}
						/>
					)}*/}

					<View
						style={{
							flex: 1,
							alignSelf: "center",
							marginTop: "2%",
							position: "absolute",
						}}
					>
						<View style={{ width: 300 }}>
							{/*<SegmentedControl
								appearance="light" // 'dark', 'light'
								// fontStyle={{color:mint}}             // An object container with color, fontSize, fontFamily   // NOT WORKING ON iOS13+
								// activeFontStyle={{color:'white'}}     // An object container with color, fontSize, fontFamily  // NOT WORKING ON iOS13+
								// tintColor={mint}                      // Accent color of the control
								backgroundColor="white" // Background color color of the control // NOT WORKING ON iOS13+
								values={["Bản đồ", "Danh sách"]}
								selectedIndex={mapListIndex}
								onChange={(event) => {
									setMapListIndex(
										event.nativeEvent.selectedSegmentIndex
									);
								}}
							/>*/}

							<View
								style={{
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<TouchableOpacity
									style={{ flex: 1, alignItems: "center" }}
									onPress={() =>
										navigation.navigate("SearchExplore")
									}
								>
									<View style={styles.inputBadge}>
										<Text style={styles.textBadge}>
											{textSearch}
										</Text>
									</View>
								</TouchableOpacity>
								{/*<TouchableOpacity>
									<Input
										style={styles.inputBadge}
										value={valueSearch}
										// onChangeTexm={(valueSearch) =>
										// 	findPostal(valueSearch)
										// }
										autoFocus={false}
										onKeyPress={(e) => handleKeyPress(e)}
										placeholder="Tìm kiếm"
									/>
								</TouchableOpacity>*/}
							</View>

							{/*<
							TouchableOpacity
							style={{ flex: 1, alignItems: "center" }}
							onPress={() => navigation.navigate("SearchExplore")}
						>
							<View style={styles.inputBadge}>
								<Text style={styles.textBadge}>Tìm kiếm</Text>
							</View>
						</TouchableOpacity>*/}
						</View>
					</View>
				</View>
				<StatusBar style="auto" />
				{/*
					<Text>
						network: {networkStatus} - error: {errorPostal == true ? "1" : 0} -
						called: {calledPostal == true ? "1" : 0} - loading:{" "}
						{loadingPostal == true ? "1" : 0} - onCompleted:{" "}
						{onCompleted == true ? "1" : 0}
					</Text>
					<Text>
						personal: {props.filter.personal == true ? 1 : 0} - organize:{" "}
						{props.filter.organize == true ? 1 : 0}
					</Text>
				*/}
			</Container>
		</React.Fragment>
	);
}

// colors vars
var blueDark = "#033C47";
var mintLight = "#D5EFE8";
var mint = "#2DB08C";
var grayMedium = "#879299";
var graySuperLight = "#f4f4f4";
var greyLight = "#d8d8d8";
var gold = "#E8BA00";
var goldLight = "#faf1cb";
var tomato = "#ec333b";
var peach = "#ef7e67";
var peachLight = "#FED4CB";

const styles = StyleSheet.create({
	imgBackgroundHeader: {
		width: null,
	},
	header: {
		height: 100,
		paddingLeft: 0,
		paddingRight: 0,
		backgroundColor: "rgba(0,0,0,0.25)",
	},

	logoTop: {
		width: 60,
		height: 60,
	},
	flag: {
		width: 30,
		height: 20,
		marginLeft: 8,
	},
	hleft1: {
		flex: 0.4,
		height: "100%",
		justifyContent: "center",
		paddingLeft: 2,
		alignItems: "center",
	},
	body1: {
		height: "100%",
		justifyContent: "center",
		paddingLeft: 5,
		paddingRight: 5,
	},
	bview1: {
		flexDirection: "row-reverse",
		width: "100%",
		alignItems: "flex-end",
		paddingRight: 15,
		paddingBottom: 5,
		marginTop: -15,
	},
	txth1: { color: "#ffffff", fontSize: 15, fontWeight: "600", marginTop: 2 },
	txth2: { color: "#ffffff", fontSize: 16, fontWeight: "bold", marginTop: 5 },
	btext: {
		width: "100%",
	},

	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	loadingContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
	},
	modalContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
		backgroundColor: "#fff",
	},
	current: {
		fontSize: 16,
		color: blueDark,
		textAlign: "left",
		lineHeight: 26,
	},
	currentBold: {
		fontSize: 16,
		color: blueDark,
		textAlign: "left",
		lineHeight: 26,
		fontWeight: "bold",
	},
	mapStyle: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
	},
	inputBadge: {
		// flexDirection: "row",
		// justifyContent: "flex-start",
		// alignItems: "center",
		// height: 32,
		// width: "100%",
		// // backgroundColor: graySuperLight,
		// borderRadius: 16,
		// borderColor: "#0469c1",
		// // borderWidth: 1,
		// paddingHorizontal: 15,
		// paddingVertical: 0,
		// margin: 10,

		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		height: 32,
		width: "100%",
		backgroundColor: graySuperLight,
		borderRadius: 16,
		borderColor: grayMedium,
		borderWidth: 1,
		paddingHorizontal: 15,
		paddingVertical: 0,
		margin: 10,
	},
	textBadge: {
		color: grayMedium,
	},

	chatContent: {
		paddingHorizontal: 8,
		paddingVertical: 12,
	},
	messageInputContainer: {
		flexDirection: "row",
		paddingHorizontal: 8,
		paddingVertical: 16,
		// backgroundColor: "background-basic-color-1",
	},
	// attachButton: {
	// 	borderRadius: 24,
	// 	marginHorizontal: 8,
	// },
	messageInput: {
		flex: 1,
		marginHorizontal: 8,
	},
	sendButton: {
		marginRight: 4,
	},
	iconButton: {
		width: 24,
		height: 24,
	},
});

function mapDispatchToProps(dispatch) {
	return {
		storeFilterDatas: function (filterDatas) {
			dispatch({ type: "saveFilterData", filterDatas });
		},
		storeFav: function (favs) {
			dispatch({ type: "saveFavs", favs });
		},
	};
}

function mapStateToProps(state) {
	return { token: state.token, filter: state.filter };
}

// keep this line at the end
export default connect(mapStateToProps, mapDispatchToProps)(ExploreScreen);
