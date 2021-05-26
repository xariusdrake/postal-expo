import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	Image,
	View,
	TouchableOpacity,
	ImageBackground,
	TouchableWithoutFeedback,
	Keyboard,
	KeyboardAvoidingView,
	Dimensions,
	Alert,
} from "react-native";
import * as Permissions from "expo-permissions";

import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery, useLazyQuery } from "@apollo/client";
import { Button } from "@ui-kitten/components";

import { BarCodeScanner } from "expo-barcode-scanner";
import appConfigs from "../../config";

import { Ionicons } from "@expo/vector-icons";
import ScanSVG from "../../components/ScanSVG";

import { QUERY_GET_POSTAL_BY_BARCODE } from "../../graphql/query";

function ScanQRScreen(props) {
	const [
		getPostal,
		{
			networkStatus,
			error: errorPostal,
			called: calledPostal,
			loading: loadingPostal,
			data: dataPostal,
		},
	] = useLazyQuery(QUERY_GET_POSTAL_BY_BARCODE, {
		fetchPolicy: "no-cache",
		onCompleted: () => {
			console.log("onCompleted");
			console.log(dataPostal);
			// console.log(dataPostal.postals[0].id)

			// setLoading(false)
			//
			console.log("done getPostal");

			setScanMode(true);
			setLoading(false);

			if (dataPostal.postals.length > 0) {
				navigation.navigate("Postal", {
					postal: dataPostal.postals[0],
				});
			} else {
				console.log("không tìm được");
				Alert.alert("Không tìm thấy địa điểm");
			}
		},
		onError: () => {
			setLoading(false);
			setTimeout(function () {
				Alert.alert("Có lỗi xảy ra");
			}, 700);
			console.log("onError");
			console.log(errorPostal);
		},
	});

	const navigation = useNavigation();

	const windowHeight = Dimensions.get("window").height;
	const windowWidth = Dimensions.get("window").width;

	const [clicked, setClicked] = useState(false);

	const [hasPermission, setHasPermission] = useState(null);

	const [loader, setLoader] = useState(false);

	const [scanMode, setScanMode] = useState(true);
	const [loading, setLoading] = useState(true);

	// const [permission, askForPermission] = usePermissions(null);
	// const [searchResult, setSearchResult] = useState();

	// async function ifDisablePermissionCamera() {
	// 	const { status } = await Permissions.getAsync(Permissions.CAMERA);

	// 	if (status !== "granted") {
	// 		setHasPermission(false);
	// 	}
	// }

	// const route = useRoute();

	useEffect(() => {
		(async () => {
			// const { status } = await Permissions.askAsync(Permissions.CAMERA);
			var response = await Permissions.askAsync(Permissions.CAMERA);
			// setHasPermission(response.status === "granted");

			if (response.status == "granted") {
				setHasPermission(true);
			} else {
				setHasPermission(false);

				// if (clicked == true) {
				Alert.alert(
					"Quyền truy cập Camera không được cấp. Vào cài đặt để đặt lại."
				);
				setClicked(false);
				// }
			}

			setLoading(false);
		})();
	}, []);

	async function askPermissions() {
		// console.log('#6 demande la permision')
		var response = await Permissions.askAsync(Permissions.CAMERA);

		console.log("askPermissions CAMERA");
		console.log(response);

		if (response.status == "granted") {
			setHasPermission(true);
		} else {
			setHasPermission(false);

			// if (clicked == true) {
			Alert.alert(
				"Quyền truy cập Camera không được cấp. Vào cài đặt để đặt lại."
			);
			setClicked(false);
			// }
		}

		setLoading(false);
	}

	// useEffect(() => {
	// 	// ifDisablePermissionCamera();
	// 	askPermissions();
	// }, []);

	// successfully scan something
	const handleBarCodeScanned = async ({ type, data }) => {
		if (String(props.route.name) != "ScanQR") {
			console.log("stop");
			return false;
		}

		console.log(236, type, data);
		console.log(237, loading, scanMode, loadingPostal);

		if (!loadingPostal) {
			setScanMode(false);
			setLoading(true);

			getPostal({ variables: { code: data } });
		}
	};

	// if (
	// 	loading == false &&
	// 	(hasPermission === false || hasPermission == null)
	// ) {
	// 	return (
	// 		<View
	// 			style={{
	// 				position: "absolute",
	// 				height: "100%",
	// 				top: 0,
	// 				flex: 1,
	// 				flexDirection: "column",
	// 				justifyContent: "space-between",
	// 			}}
	// 		>
	// 			<View
	// 				style={{
	// 					width: windowWidth,
	// 					flexGrow: 1,
	// 					justifyContent: "center",
	// 				}}
	// 			>
	// 				<TouchableOpacity
	// 					onPress={() => {
	// 						setScanMode(false);
	// 					}}
	// 				>
	// 					<Ionicons
	// 						name="md-close"
	// 						size={34}
	// 						color={"#2DB08C"}
	// 						style={{ textAlign: "right", marginRight: 34 }}
	// 						onPress={() => navigation.navigate("Explore")}
	// 					/>
	// 				</TouchableOpacity>
	// 			</View>

	// 			<View
	// 				style={{
	// 					flex: 1,
	// 					flexDirection: "column",
	// 					justifyContent: "flex-end",
	// 					justifyContent: "center",
	// 					alignItems: "center",
	// 				}}
	// 			>
	// 				<Text style={{ paddingBottom: 20 }}>
	// 					Không thể truy cập camera
	// 				</Text>
	// 				<Button
	// 					onPress={() => {
	// 						console.log(clicked);
	// 						setClicked(true);
	// 						askPermissions();
	// 					}}
	// 				>
	// 					Cấp quyền CAMERA
	// 				</Button>
	// 			</View>

	// 			<View style={{ width: windowWidth, flexGrow: 1 }}>
	// 				<Text style={{ height: 34 }}></Text>
	// 			</View>
	// 		</View>
	// 	);
	// }

	let responseCamera = Permissions.askAsync(Permissions.CAMERA);

	return (
		<View
			style={{
				flex: 1,
				flexDirection: "column",
				justifyContent: "flex-end",
			}}
		>
			{hasPermission != true && (
				<React.Fragment>
					<View
						style={{
							width: windowWidth,
							flexGrow: 1,
							justifyContent: "center",
						}}
					>
						<TouchableOpacity
							onPress={() => {
								setScanMode(false);
							}}
						></TouchableOpacity>
					</View>

					<View
						style={{
							flex: 1,
							flexDirection: "column",
							justifyContent: "flex-end",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Text style={{ paddingBottom: 20 }}>
							Không thể truy cập camera
						</Text>
						<Button
							onPress={() => {
								console.log(clicked);
								setClicked(true);
								askPermissions();
							}}
						>
							Cấp quyền CAMERA
						</Button>
					</View>

					<View style={{ width: windowWidth, flexGrow: 1 }}>
						<Text style={{ height: 34 }}></Text>
					</View>
				</React.Fragment>
			)}

			{hasPermission == true && (
				<React.Fragment>
					<BarCodeScanner
						onBarCodeScanned={
							loading == false ? handleBarCodeScanned : undefined
						}
						style={StyleSheet.absoluteFillObject}
					/>
					<View
						style={{
							position: "absolute",
							height: "100%",
							top: 0,
							flex: 1,
							flexDirection: "column",
							justifyContent: "space-between",
						}}
					>
						<View
							style={{
								width: windowWidth,
								flexGrow: 1,
								justifyContent: "center",
							}}
						></View>
						<View
							style={{
								width: windowWidth,
								flexGrow: 12,
								flex: 1,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<ScanSVG
								style={{
									color: "#0469c1",
									borderColor: "#0469c1",
								}}
							/>
						</View>
						<View style={{ width: windowWidth, flexGrow: 1 }}>
							<Text style={{ height: 34 }}></Text>
						</View>
					</View>
					{loading == true && loadingPostal != true && (
						<Button
							onPress={() => {
								setScanMode(true);
								setLoading(false);
							}}
						>
							Quét lại
						</Button>
					)}
					{loadingPostal == true && (
						<Button status="basic">Đang xử lý</Button>
					)}
					{!hasPermission && (
						<Button
							onPress={() => {
								askPermissions();
							}}
						>
							Cấp quyền
						</Button>
					)}
				</React.Fragment>
			)}
		</View>
	);
}

const stylesX = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 25,
		backgroundColor: "#FFFFFF",
	},
	loadingView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "transparent",
	},
});

export default ScanQRScreen;
