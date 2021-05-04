import React, { useEffect, useState } from "react";
import {
	SafeAreaView,
	Dimensions,
	StyleSheet,
	View,
	Platform,
	Alert,
	Linking,
} from "react-native";

import { StatusBar } from "expo-status-bar";
// import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { connect } from "react-redux";
import {
	Text,
	Input,
	Button,
	Icon,
	Tab,
	TabBar,
	TabView,
	Layout,
} from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

// import {
// 	AndroidImportance,
// 	AndroidNotificationVisibility,
// 	NotificationChannel,
// 	NotificationChannelInput,
// 	NotificationContentInput,
// } from "expo-notifications";
// import * as FileSystem from "expo-file-system";

import Spinner from "react-native-loading-spinner-overlay";
// import { downloadToFolder } from "expo-file-dl";

import { TouchableOpacity } from "react-native-gesture-handler";

import GuideModalScreen from "../more/guide";
import IntroModalScreen from "../more/intro";
import DocumentModalScreen from "../more/document";

// import data_one from "./data/data_one";
// import * as data_one from "./data/data_one.json";
// import * as data_two from "./data/data_two.json";
// import * as data_three from "./data/data_three.json";
// import * as data_post from "./data/postals.json";

// import * as data_four from "./data/data_four.json";

import { gql, useMutation, useLazyQuery } from "@apollo/client";

const MUTATION_ADD_POSTAL = gql`
	mutation Mutation_AddPostal(
		$id_tinh: Int
		$id_huyen: Int
		$parent_id: Int
		$name: String!
		$code: String
		$district: Int
		$region: Int
		$type: Int!
		$note: String
	) {
		insert_postals_one(
			object: {
				id_tinh: $id_tinh
				id_huyen: $id_huyen
				parent_id: $parent_id
				name: $name
				code: $code
				district: $district
				region: $region
				type: $type
				note: $note
			}
		) {
			id
			name
		}
	}
`;

// Notifications.setNotificationHandler({
// 	handleNotification: async () => ({
// 		shouldShowAlert: true,
// 		shouldPlaySound: false,
// 		shouldSetBadge: false,
// 	}),
// });

const channelId = "DownloadInfo";

function ExploreScreen(props) {
	const navigation = useNavigation();

	const [
		createPostal,
		{ loading: queryLoading, error: queryError, data: dataCreatePostal },
	] = useMutation(MUTATION_ADD_POSTAL, {
		onCompleted: (dataCreatePostal) => {
			// console.log(dataCreatePostal)
			// console.log(
			// 	dataCreatePostal.insert_postals_new_one.id +
			// 		" - " +
			// 		dataCreatePostal.insert_postals_new_one.name
			// );
			// console.log("onCompleted");
			// console.log(dataCreatePostal);
			// if (dataCreatePostal.insert_postals.returning[0].id) {
			// 	getInfoUser({ variables: { uid: props.infos.id } });
			// } else {
			// 	console.log("some errror in response");
			// }
			// setAllPostalList(data.postals);
		},
		onError: (queryError) => {
			// setLoading(false);
			console.log("onError");
			console.log(queryError);
		},
	});

	const [hasPermissionLocation, setHasPermissionLocation] = useState(null);
	const [hasPermissionCamera, setHasPermissionCamera] = useState(null);

	const [selectedIndex, setSelectedIndex] = useState(0);

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

	// async function TestThisShit() {
	// 	await axios(
	// 		"https://api.mabuuchinh.vn/api/v1/MBC/GetAdministrativeAgencies?parentPostCode=51-52",
	// 		{
	// 			method: "get",
	// 			headers: {
	// 				// "Content-type": "Application/json",
	// 				// Accept: "Application/json",
	// 				// Authorization: jwt,
	// 			},
	// 			data: {},
	// 		}
	// 	).then((res) => {
	// 		console.log(188, res);
	// 	});
	// }

	useEffect(() => {
		askPermissions();

		// fetch(
		// 	"https://api.mabuuchinh.vn/api/v1/MBC/GetAdministrativeAgencies?parentPostCode=51-52"
		// )
		// 	.then((res) => console.log(596, res))
		// 	.then((json) => console.log(json));

		// axios
		// 	.get(
		// 		`http://api.mabuuchinh.vn/api/v1/MBC/GetAdministrativeAgencies?parentPostCode=51-52`
		// 	)
		// 	.then((res) => {
		// 		console.log(18822, res);
		// 		Alert.alert("WORK");
		// 	})
		// 	.catch((error) => {
		// 		console.log(123, error);
		// 		Alert.alert("ERR");
		// 	});

		// fetch("https://api.mabuuchinh.vn/api/v1/MBC/GetAdministrativeAgencies?parentPostCode=51-52")
		// 	.then((response) => response.json())
		// 	.then((json) => {
		// 		return json.movies;
		// 	})
		// 	.catch((error) => {
		// 		console.error(error);
		// 	});

		// TestThisShit();
		// axios({
		// 	method: "get",
		// 	// baseURL: baseUrl,
		// 	url:
		// 		"https://api.mabuuchinh.vn/api/v1/MBC/GetAdministrativeAgencies?parentPostCode=51-52",
		// 	headers: {
		// 		accept: "text/plain",
		// 		// 'x-app-key': baseUrl == appConfigs.API.URL.EID_URL ? appConfigs.API.SECRET_KEY : '',
		// 		// 'x-app-key': appConfigs.API.SECRET_KEY,
		// 		// 'Authorization': 'Bearer ' + token || '',
		// 	},
		// 	// params: params,
		// });
	}, []);

	const renderIconSearch = (props) => (
		<Icon {...props} name="search-outline" />
	);

	const downloadPostal = async () => {
		console.log("downloadToFolder");

		// await FileSystem.downloadAsync(
		// 	"https://i.imgur.com/XIzdgPe.jpg",
		// 	FileSystem.documentDirectory + "XIzdgPe.mp4"
		// )
		// 	.then(({ uri }) => {
		// 		console.log("Finished downloading to ", uri);
		// 	})
		// 	.catch((error) => {
		// 		console.error(error);
		// 	});

		// await downloadToFolder(
		// 	"https://i.imgur.com/XIzdgPe.jpg",
		// 	"XIzdgPe.jpg",
		// 	"Download",
		// 	"DownloadInfo"
		// );

		Linking.openURL(
			"https://drive.google.com/drive/folders/1FAoriBztHnGqqAiSpoDOjc3WcvOLe-lp?usp=sharing"
		);
	};

	const excuteData = async () => {
		// let data
		// console.log("excuteData");
		// // var data = JSON.parse(data_one)
		// // console.log(data_post[22].name);
		// Object.entries(data_four).forEach(([k, item]) => {
		// 	// console.log(k)
		// 	if (item.name != null) {
		// 		console.log(item.id, item.name)
		// 		createPostal({variables: {
		// 			// id: parseInt(item.id),
		// 			id_tinh: parseInt(item.id_tinh),
		// 			id_huyen: parseInt(item.id_huyen),
		// 			parent_id: parseInt(item.parent_id),
		// 			type: parseInt(item.type),
		// 			name: item.name,
		// 			region: parseInt(item.region),
		// 			district: parseInt(item.district),
		// 			code: item.code,
		// 			note: item.id,
		// 		}})
		// 	}
		// });
		// console.log(
		// 	Object.entries(data_three).filter(function (id_huyen) {
		// 		return item.id_huyen == "449";
		// 	})
		// );
		// const family = [
		// 	{ name: "Jack", age: 26 },
		// 	{ name: "Jill", age: 22 },
		// 	{ name: "James", age: 5 },
		// 	{ name: "Jenny", age: 2 },
		// ];
		// const adults = Object.entries(data_three).filter(({ id }) => console.log(id.ten));
		// console.log(adults);
		// Object.entries(data_two).forEach(([k_two, item_two]) => {
		// 	if (item_two.ten != null) {
		// 		console.log(item.id, item.ten)
		// 		Object.entries(data).forEach(([k_two, item_two]) => {
		// 	}
		// 	// console.log("The value: ",v)
		// });
	};

	const [uri, setUri] = useState("");
	const [filename, setFilename] = useState("");

	// async function setNotificationChannel() {
	// 	const loadingChannel: NotificationChannel | null = await Notifications.getNotificationChannelAsync(
	// 		channelId
	// 	);

	// 	// // if we didn't find a notification channel set how we like it, then we create one
	// 	// if (loadingChannel == null) {
	// 	// 	const channelOptions: NotificationChannelInput = {
	// 	// 		name: channelId,
	// 	// 		importance: AndroidImportance.HIGH,
	// 	// 		lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
	// 	// 		sound: "default",
	// 	// 		vibrationPattern: [250],
	// 	// 		enableVibrate: true,
	// 	// 	};
	// 	// 	await Notifications.setNotificationChannelAsync(
	// 	// 		channelId,
	// 	// 		channelOptions
	// 	// 	);
	// 	// }
	// }

	// useEffect(() => {
	// 	setNotificationChannel();
	// });

	// IMPORTANT: You MUST attain CAMERA_ROLL permissions for the file download to succeed
	// If you don't the downloads will fail
	// async function getCameraRollPermissions() {
	// 	await Permissions.askAsync(Permissions.CAMERA_ROLL);
	// }
	// useEffect(() => {
	// 	getCameraRollPermissions();
	// });

	return (
		<React.Fragment>
			<SafeAreaView style={styles.droidSafeArea}>
				<TabView
					selectedIndex={selectedIndex}
					onSelect={(index) => setSelectedIndex(index)}
				>
					<Tab title="Trang chủ">
						<Layout style={styles.container}>
							<Text style={styles.title} category="h6">
								MÃ BƯU CHÍNH QUỐC GIA VIỆT NAM
							</Text>
							<TouchableOpacity
								onPress={() =>
									navigation.navigate("SearchExplore")
								}
							>
								{/*<Input
									style={{ width: 230 }}
									placeholder="Tìm kiếm mã bưu chính"
									onPress={() => {
										navigation.navigate("SearchExplore");
									}}
									keyboardType={null}
									accessoryLeft={renderIconSearch}
								/>*/}

								<View style={styles.input}>
									<Icon
										style={styles.input_icon}
										name="search"
									></Icon>
									<Text style={styles.input_text}>
										Tìm kiếm mã bưu chính tại đây
									</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={async () => {
									console.log("downloadToFolder");
									downloadPostal();
									// Linking.openURL(
									// 	"http://mabuuchinh.vn/Images/danhbamabuuchinhquocgia.pdf"
									// );
									// await downloadToFolder(
									// 	"https://i.imgur.com/XIzdgPe.jpg",
									// 	"XIzdgPe.jpg",
									// 	"Download",
									// 	channelId
									// );
								}}
								style={{ paddingTop: 10 }}
								pointerEvents="none"
								showSoftInputOnFocus={false}
							>
								<Text>Tải bộ mã bưu chính</Text>
							</TouchableOpacity>
							{/*<TouchableOpacity
								onPress={async () => {
									excuteData();
								}}
								style={{ paddingTop: 10 }}
								pointerEvents="none"
								showSoftInputOnFocus={false}
							>
								<Text>Excute data</Text>
							</TouchableOpacity>*/}
						</Layout>
					</Tab>
					<Tab title="Giới thiệu">
						<Layout style={styles.tabContainer}>
							<IntroModalScreen no_header={true} />
						</Layout>
					</Tab>
					<Tab title="Văn bản">
						<Layout style={styles.tabContainer}>
							<DocumentModalScreen no_header={true} />
						</Layout>
					</Tab>
					<Tab title="Hướng dẫn" style={{ height: 40 }}>
						<Layout style={styles.tabContainer}>
							<GuideModalScreen no_header={true} />
						</Layout>
					</Tab>
				</TabView>
			</SafeAreaView>
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
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: -250,
		// paddingTop: 200,
		// paddingHorizontal: 25,
		// backgroundColor: "#FFFFFF",
	},
	title: {
		paddingTop: 0,
		padding: 17,
		textAlign: "center",
		color: "#0469c1",
	},

	loadingView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "transparent",
	},
	current20: {
		color: "#033C47",
		fontSize: 20,
	},
	input: {
		height: 45,
		borderColor: "#337ab7",
		borderWidth: 1,
		borderRadius: 11,
		paddingRight: 10,
		justifyContent: "center",
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
	droidSafeArea: {
		paddingTop: Platform.OS === "android" ? 25 : 0,
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
