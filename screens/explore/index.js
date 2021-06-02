import React, { useEffect, useState, useRef } from "react";
import {
	SafeAreaView,
	Dimensions,
	StyleSheet,
	View,
	Platform,
	Alert,
	Linking,
	AsyncStorage,
} from "react-native";

import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

import { StatusBar } from "expo-status-bar";
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

import Spinner from "react-native-loading-spinner-overlay";

import { TouchableOpacity } from "react-native-gesture-handler";

import {
	getDataFromStorage,
	retrieveSession,
	savePushtoken,
} from "../../functions/helpers";

import GuideModalScreen from "../more/guide";
import IntroModalScreen from "../more/intro";
import DocumentModalScreen from "../more/document";

import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { MUTATION_UPDATE_NOTIFI_PUSHTOKEN } from "../../graphql/query";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

async function schedulePushNotification() {
	await Notifications.scheduleNotificationAsync({
		content: {
			title: "You've got mail! 📬",
			body: "Here is the notification body",
			data: { data: "goes here" },
		},
		trigger: { seconds: 2 },
	});
}

const channelId = "DownloadInfo";

function ExploreScreen(props) {
	const navigation = useNavigation();

	const [hasPermissionLocation, setHasPermissionLocation] = useState(null);
	const [hasPermissionCamera, setHasPermissionCamera] = useState(null);

	const [selectedIndex, setSelectedIndex] = useState(0);

	const [expoPushToken, setExpoPushToken] = useState("");
	const [notification, setNotification] = useState(false);
	const notificationListener = useRef();
	const responseListener = useRef();

	async function getLocationAsync() {
		// permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
		const { status, permissions } = await Permissions.askAsync(
			Permissions.LOCATION
		);
		if (status === "granted") {
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
			console.log(110, status)
			throw new Error("Location permission not granted");
		}
	}

	async function askPermissions() {
		getLocationAsync();
		// var responseLocation = await Permissions.askAsync(Permissions.LOCATION);

		// console.log("askPermissions response");
		// console.log(responseLocation);

		// if (responseLocation.status === "granted") {
		// 	setHasPermissionLocation(true);

		// 	console.log("askPermissions granted");

		// 	let location = await Location.getCurrentPositionAsync();

		// 	if (
		// 		location.coords.latitude != null &&
		// 		location.coords.longitude != null
		// 	) {
		// 		console.log(
		// 			"askPermissions here location: ",
		// 			location.coords.latitude,
		// 			location.coords.longitude
		// 		);
		// 	}
		// } else {
		// 	setHasPermissionLocation(false);
		// 	Alert.alert("Quyền vị trị không được cấp. Vào cài đặt để đặt lại.");
		// }

		// var responseCamera = await Permissions.askAsync(Permissions.CAMERA);

		// console.log("camera ask");
		// console.log(responseCamera);

		// if (responseCamera.status === "granted") {
		// 	console.log("camera true");
		// 	setHasPermissionCamera(true);
		// } else {
		// 	setHasPermissionCamera(false);
		// 	console.log("camera false");
		// 	Alert.alert("Quyền vị trị không được cấp. Vào cài đặt để đặt lại.");
		// }
	}

	async function registerForPushNotificationsAsync() {
		let token;
		if (Constants.isDevice) {
			const {
				status: existingStatus,
			} = await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;
			if (existingStatus !== "granted") {
				const {
					status,
				} = await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}
			if (finalStatus !== "granted") {
				console.log("Failed to get push token for push notification!");
				return;
			}
			token = (await Notifications.getExpoPushTokenAsync()).data;
			savePushtoken(token);
			// console.log(token);

			// if (!!props.infos) {
			// 	updateNotifPushtoken({
			// 		variables: { uid: 85, pushtoken: token },
			// 	});
			// }
		} else {
			console.log("Must use physical device for Push Notifications");
		}

		if (Platform.OS === "android") {
			Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			});
		}

		return token;
	}

	useEffect(() => {
		askPermissions();
		retrieveSession(props);

		// registerForPushNotificationsAsync().then((token) =>
		// 	setExpoPushToken(token)
		// );

		// notificationListener.current = Notifications.addNotificationReceivedListener(
		// 	(notification) => {
		// 		setNotification(notification);
		// 	}
		// );

		// responseListener.current = Notifications.addNotificationResponseReceivedListener(
		// 	(response) => {
		// 		console.log(response);
		// 	}
		// );

		// return () => {
		// 	Notifications.removeNotificationSubscription(
		// 		notificationListener.current
		// 	);
		// 	Notifications.removeNotificationSubscription(
		// 		responseListener.current
		// 	);
		// };
	}, []);

	const downloadPostal = async () => {
		// direct to file: https://drive.google.com/file/d/1Dhg1PAiXbXpz_-qADqJC5kRAkAJmlFOa/view?usp=sharing

		Linking.openURL(
			"https://drive.google.com/drive/folders/1FAoriBztHnGqqAiSpoDOjc3WcvOLe-lp?usp=sharing"
		);
	};

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
								}}
								style={{ paddingTop: 10 }}
								pointerEvents="none"
								showSoftInputOnFocus={false}
							>
								<Text>Tải bộ mã bưu chính</Text>
							</TouchableOpacity>
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
					{/*<Tab title="DEBUG" style={{ height: 40 }}>
						<Layout style={styles.container}>
							<View
								style={{
									flex: 1,
									alignItems: "center",
									justifyContent: "space-around",
								}}
							>
								<Text>
									Your expo push token: {expoPushToken}
								</Text>
								<View
									style={{
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Text>
										Title:{" "}
										{notification &&
											notification.request.content
												.title}{" "}
									</Text>
									<Text>
										Body:{" "}
										{notification &&
											notification.request.content.body}
									</Text>
									<Text>
										Data:{" "}
										{notification &&
											JSON.stringify(
												notification.request.content
													.data
											)}
									</Text>
								</View>
								<Button
									onPress={async () => {
										await schedulePushNotification();
									}}
								>
									Press to schedule a notification
								</Button>
							</View>
						</Layout>
					</Tab>*/}
				</TabView>
			</SafeAreaView>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: -250,
	},
	title: {
		paddingTop: 0,
		padding: 17,
		textAlign: "center",
		color: "#0469c1",
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
		storeData: function (token) {
			dispatch({ type: "saveToken", token });
		},
		storeUserInfo: function (infos) {
			dispatch({ type: "saveUserInfo", infos });
		},
	};
}

// function mapDispatchToProps(dispatch) {
// 	return {
// 		storeFilterDatas: function (filterDatas) {
// 			dispatch({ type: "saveFilterData", filterDatas });
// 		},
// 		storeFav: function (favs) {
// 			dispatch({ type: "saveFavs", favs });
// 		},
// 		storeUserInfo: function (infos) {
// 			dispatch({ type: "saveUserInfo", infos });
// 		},
// 	};
// }

function mapStateToProps(state) {
	return { token: state.token, infos: state.infos, filter: state.filter };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreScreen);
