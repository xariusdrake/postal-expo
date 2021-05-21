import React, { useState, useEffect } from "react";
import {
	ImageBackground,
	Platform,
	View,
	SafeAreaView,
	StyleSheet,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	Alert,
} from "react-native";
import { connect } from "react-redux";

import * as Location from "expo-location";
import MapView from "react-native-maps";

import {
	Input,
	Layout,
	StyleService,
	Text,
	useStyleSheet,
	TopNavigation,
	TopNavigationAction,
	Divider,
	Icon,
	Avatar,
	Button,
	Modal,
	OverflowMenu,
	MenuItem,
} from "@ui-kitten/components";

import Geocode from "react-geocode";
import QRCode from "react-native-qrcode-svg";
import Hashids from "hashids";
import Geohash from "latlon-geohash";
import Spinner from "react-native-loading-spinner-overlay";

import { OpenMapDirections } from "react-native-navigation-directions";
import MapViewDirections from "react-native-maps-directions";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const hashids = new Hashids("encode", 7, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
//1234567890

import appConfigs from "../../config";

import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import {
	MUTATION_DELETE_POSTAL,
	QUERY_GET_INFO_USER,
	// MUTATION_UPDATE_STATUS_POSTAL,
	MUTATION_UPDATE_ACTIVE_POSTAL,
} from "../../graphql/query";

const keyboardOffset = (height: number): number =>
	Platform.select({
		android: 0,
		ios: height,
	});

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const EditIcon = (props) => <Icon {...props} name="edit-outline" />;
const ArchiveIcon = (props) => <Icon {...props} name="archive-outline" />;
const DeleteIcon = (props) => <Icon {...props} name="trash-outline" />;
const ReportIcon = (props) => <Icon {...props} name="alert-circle-outline" />;

Geocode.setApiKey(appConfigs.GOOGLE_MAP.API_KEY_2);

function DetailPostalScreen(props) {
	const [
		updateActivePostal,
		{
			error: errorActive,
			called: calledActive,
			loading: loadingActive,
			data: dataActive,
		},
	] = useMutation(MUTATION_UPDATE_ACTIVE_POSTAL, {
		fetchPolicy: "no-cache",
		onCompleted: (dataActive) => {
			setLoading(false);

			console.log(87, dataActive);

			// if (dataActive.update_postals.returning[0].is_actived == -1) {
			setValueActive(dataActive.update_postals.returning[0].is_actived);
			// }

			setTimeout(function () {
				Alert.alert("", "Đã cập nhật");
			}, 700);
		},
		onError: (errorActive) => {
			setLoading(false);
			Alert.alert("", "Có lỗi xảy ra. Vui lòng thử lại sau!");
		},
	});
	const [
		deletePostal,
		{
			error: errorDelete,
			called: calledDelete,
			loading: loadingDelete,
			data: dataDelete,
		},
	] = useMutation(MUTATION_DELETE_POSTAL, {
		fetchPolicy: "no-cache",
		onCompleted: (dataDelete) => {
			console.log("onCompleted");
			console.log(dataDelete);

			if (dataDelete.update_postals.returning[0].id) {
				getInfoUser({ variables: { uid: props.infos.id } });
			}
		},
		onError: (errorDelete) => {
			setLoading(false);

			console.log("onError");
			console.log(errorLogin);
			Alert.alert("", "Có lỗi xảy ra. Vui lòng thử lại sau!");
		},
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
		onError: (errorUser) => {
			setLoading(false);
			console.log("onError");
			console.log(errorUser);
		},
	});

	const styles = useStyleSheet(themedStyles);

	var response = props.route.params;

	const [menuVisible, setMenuVisible] = useState(false);

	const [getAddress, setAddress] = useState(null);
	const [getValueActive, setValueActive] = useState(null);

	const [visibleModal, setVisibleModal] = useState(false);
	const [getLatitude, setLatitude] = useState(null);
	const [getLongtitude, setLongtitude] = useState(null);
	const [loading, setLoading] = useState(false);

	console.log(60, response.postal.uid, props.infos.id);
	console.log(61, response);

	useEffect(() => {
		(async () => {
			setValueActive(response.postal.is_actived);
			if (response.postal.type == 99) {
				if (response.postal.lat > 0) {
					setLatitude(Number(response.postal.lat));
					setLongtitude(Number(response.postal.lng));
				}
			} else {
				attemptGeocodeAsync();
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
		setAddress(response.postal.address);

		if (response.postal.type != 99) {
			Geocode.fromAddress(valueSearch).then(
				(response) => {
					console.log("from address");
					console.log(response);

					if (response.results[0].geometry.location.lat > 1) {
						console.log("work");
						setLatitude(response.results[0].geometry.location.lat);
						setLongtitude(
							response.results[0].geometry.location.lng
						);

						// let address = response.results[0].formatted_address;
						// address = address.replace(", Vietnam", "");
						// setAddress(address);
					}
				},
				(error) => {
					console.error(error);
				}
			);
		}

		// try {
		// 	let result = await Location.geocodeAsync(valueSearch);

		// 	console.log("geo result: " + result);
		// 	console.log(result);

		// 	if (result[0].latitude > 1) {
		// 		console.log("work");
		// 		setLatitude(result[0].latitude);
		// 		setLongtitude(result[0].lngitude);
		// 	}
		// } catch (e) {
		// 	console.log("geo catch: " + e.message);
		// } finally {
		// 	console.log("geo finally");
		// }

		// console.log(90, getLocation);
	};

	const onClickChangeActive = (value) => {
		toggleMenu();

		let messageLabel;
		let submitLabel;

		if (value == -1) {
			messageLabel =
				"Bạn có muốn gỡ mã bưu chính này xuống không? Bạn có thể khôi phục lại sau.";
			submitLabel = "Tạm dừng";
		} else if (value == 1) {
			messageLabel = "Bạn có muốn khôi phục không?";
			submitLabel = "Khôi phục";
		} else {
			return;
		}

		Alert.alert(
			"",
			messageLabel,
			[
				{
					text: "Đóng",
				},
				{
					text: submitLabel,
					onPress: () => {
						setLoading(true);
						updateActivePostal({
							variables: {
								id: response.postal.id,
								is_actived: value,
							},
						});
					},
				},
			],
			{ cancelable: false }
		);
	};

	const onClickDelete = () => {
		toggleMenu();
		Alert.alert(
			"",
			"Bạn có chắc chắn muốn xoá địa điểm này không?",
			[
				{
					text: "Đóng",
				},
				{
					text: "Xoá",
					onPress: () => {
						setLoading(true);
						deletePostal({ variables: { id: response.postal.id } });
					},
				},
			],
			{ cancelable: false }
		);
	};

	const onOpenQR = () => {
		setVisibleModal(true);
	};

	const toggleMenu = () => {
		setMenuVisible(!menuVisible);
	};

	const renderBackAction = () => (
		<TopNavigationAction
			icon={BackIcon}
			onPress={() => props.navigation.goBack()}
		/>
	);
	const MenuIcon = (props) => <Icon {...props} name="more-vertical" />;

	const renderMenuAction = () => (
		<TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
	);

	const renderRightActions = () => {
		return (
			<React.Fragment>
				{response.postal.uid != null &&
					props.infos.id == response.postal.uid && (
						<React.Fragment>
							<TopNavigationAction
								icon={EditIcon}
								onPress={() => {
									props.navigation.navigate("CreatePostal", {
										postal: response.postal,
										isUpdate: true,
									});
								}}
							/>
							<OverflowMenu
								anchor={renderMenuAction}
								visible={menuVisible}
								onBackdropPress={toggleMenu}
							>
								{getValueActive == 1 && (
									<MenuItem
										accessoryLeft={ArchiveIcon}
										onPress={() => onClickChangeActive(-1)}
										title="Tạm dừng"
									/>
								)}
								{getValueActive == -1 && (
									<MenuItem
										accessoryLeft={ArchiveIcon}
										onPress={() => onClickChangeActive(1)}
										title="Khôi phục"
									/>
								)}

								<MenuItem
									accessoryLeft={DeleteIcon}
									onPress={onClickDelete}
									title="Xoá"
								/>
								{/*	<TopNavigationAction
									icon={DeleteIcon}
									
								/>*/}
							</OverflowMenu>
						</React.Fragment>
					)}
				{response.postal.uid != null &&
					props.infos.id != response.postal.uid && (
						<React.Fragment>
							<TopNavigationAction
								icon={ReportIcon}
								onPress={() => {
									Alert.alert(
										"",
										"Bạn có chắc chắn muốn báo cáo địa điểm này?",
										[
											{
												text: "Đóng",
											},
											{
												text: "Báo cáo",
												onPress: () => {
													if (!props.token) {
														props.navigation.navigate(
															"SignIn"
														);
														return;
													} else {
														props.navigation.navigate(
															"ReportPostal",
															{
																postal:
																	response.postal,
															}
														);
													}
												},
											},
										],
										{ cancelable: false }
									);
								}}
							/>
						</React.Fragment>
					)}
			</React.Fragment>
		);

		{
			/*if (props.infos.id.length > 0 && response.postal.uid != null) {
			if (props.infos.id == response.postal.id) {
				return (
					<React.Fragment>
						<TopNavigationAction
							icon={EditIcon}
							onPress={() => {
								props.navigation.navigate("CreatePostal", {
									postal: response.postal,
									isUpdate: true,
								});
							}}
						/>
						<TopNavigationAction
							icon={DeleteIcon}
							onPress={() => props.navigation.goBack()}
						/>
					</React.Fragment>
				);
			}
		}*/
		}
	};

	const postalCode = (postal) => {
		return response.postal.postcode
			? response.postal.postcode
			: response.postal.code;

		// if (postal.type == 1) {
		// 	return response.postal.code;
		// } else if (postal.type == 2) {
		// 	return hashids.encode(postal.id);
		// } else {
		// 	return null;
		// }
	};

	const postalCodeReturn = postalCode(response.postal);

	const _callShowDirections = () => {
		console.log("_callShowDirections");
		// const startPoint = {
		// 	longitude: -8.945406,
		// 	latitude: 38.575078,
		// };

		const endPoint = {
			longitude: getLongtitude,
			latitude: getLatitude,
		};

		const transportPlan = "d";

		OpenMapDirections(null, endPoint, transportPlan).then((res) => {
			console.log(res);
		});
	};

	function translateAddress(address) {
		let address_edited = address.replace(" District", "");
		return address_edited;
	}

	return (
		<SafeAreaView
			style={{
				backgroundColor: "#fff",
				height: Dimensions.get("window").height,
				paddingTop: 20,
				// paddingTop: Platform.OS === 'android' ? 25 : 0
			}}
		>
			<ScrollView>
				<TopNavigation
					alignment="center"
					title="Mã bưu chính"
					accessoryLeft={renderBackAction}
					accessoryRight={renderRightActions}
				/>
				<Divider />
				<Spinner visible={loading} />
				<Layout style={styles.header} level="1">
					{(response.is_search == 1 ||
						response.postal.is_approved == 2) && (
						<TouchableOpacity
							style={{ paddingLeft: 10 }}
							// style={{ flex: 1, alignItems: "center" }}
							onPress={() => onOpenQR()}
						>
							<QRCode
								value={postalCodeReturn}
								size={50}
								logoBackgroundColor="transparent"
							/>
						</TouchableOpacity>
					)}

					<View style={styles.profileDetailsContainer}>
						<Text category="h4">
							{response.postal.name
								.replace("X. ", "Xã ")
								.replace("P. ", "Phường ")}
						</Text>
					</View>
				</Layout>

				{(response.is_search == 1 ||
					response.postal.is_approved == 2 ||
					response.postal.is_approved == 0) && (
					<Text
						style={{
							marginHorizontal: 16,
							marginTop: 10,
							marginBottom: 10,
						}}
						category="s1"
					>
						Mã bưu chính:{" "}
						{postalCodeReturn != null
							? postalCodeReturn
							: "Đang cập nhật"}{" "}
					</Text>
				)}

				<Text
					style={{
						marginHorizontal: 16,
						marginTop: 10,
						marginBottom: 10,
					}}
					category="s1"
				>
					Số điện thoại:{" "}
					{response.postal.phone != null
						? response.postal.phone
						: "Đang cập nhật"}{" "}
				</Text>

				{response.postal.type != 99 && (
					<Text
						style={{
							marginHorizontal: 16,
							marginTop: 0,
							marginBottom: 20,
						}}
						category="s1"
					>
						Địa chỉ:{" "}
						{getAddress != null
							? translateAddress(getAddress)
							: "Đang cập nhật"}
					</Text>
				)}
				{response.postal.type == 99 && (
					<Text
						style={{
							marginHorizontal: 16,
							marginTop: 0,
							marginBottom: 20,
						}}
						category="s1"
					>
						Địa chỉ:{" "}
						{response.postal.address != null
							? translateAddress(
									response.postal.address +
										", " +
										response.postal.area_text
							  )
							: "Đang cập nhật"}
					</Text>
				)}

				{/*<ImageBackground style={styles.image} source={data.image} />*/}
				{getLatitude != null && getLongtitude != null && (
					<MapView
						initialRegion={{
							latitude: getLatitude,
							longitude: getLongtitude,
							// latitudeDelta: appConfigs.GOOGLE_MAP.latitudeDelta,
							// lngitudeDelta: appConfigs.GOOGLE_MAP.lngitudeDelta,
							latitudeDelta: 0.009,
							longitudeDelta: 0.001,
						}}
						//hiển thị chấm xanh
						// showsUserLocation={true}
						// showsMyLocationButton={true}
						// followsUserLocation={true}
						// showsMyLocationButton={true}
						loadingEnabled={true}
						style={styles.image}
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

						<MapViewDirections
							origin={{
								latitude: 21.0023521,
								longitude: 105.7915466,
							}}
							destination={{
								latitude: getLatitude,
								longitude: getLongtitude,
							}}
							apikey={appConfigs.GOOGLE_MAP.API_KEY_2}
							timePrecision={"now"}
							mode={"DRIVING"}
							language="vi"
							strokeWidth={3}
							strokeColor="hotpink"
							optimizeWaypoints={true}
							onStart={(params) => {
								console.log(params);

								console.log(
									`Started routing between "${params.origin}" and "${params.destination}"`
								);
							}}
							onReady={(result) => {
								console.log(437, result);

								console.log(`Distance: ${result.distance} km`);
								console.log(
									`Duration: ${result.duration} min.`
								);

								// this.mapView.fitToCoordinates(
								// 	result.coordinates,
								// 	{
								// 		edgePadding: {
								// 			right: width / 20,
								// 			bottom: height / 20,
								// 			left: width / 20,
								// 			top: height / 20,
								// 		},
								// 	}
								// );
							}}
							onError={(errorMessage) => {
								// console.log('GOT AN ERROR');
							}}
						/>
					</MapView>
				)}

				<Modal
					visible={visibleModal}
					backdropStyle={styles.backdrop}
					onBackdropPress={() => setVisibleModal(false)}
				>
					<QRCode
						value={postalCodeReturn}
						size={300}
						logoBackgroundColor="transparent"
					/>
				</Modal>

				{/*<Text style={styles.contentLabel}>{data.content}</Text>
					<View style={styles.authoringContainer}>
						<Text appearance="hint" category="p2">
							{`By ${data.author.fullName}`}
						</Text>
						<Text
							style={styles.dateLabel}
							appearance="hint"
							category="p2"
						>
							{data.date}
						</Text>
					</View>*/}

				{/*<View style={styles.activityContainer}>
						<Avatar
							source={{
								uri:
									"https://cdn0.iconfinder.com/data/icons/octicons/1024/mark-github-512.png",
							}}
						/>
						<View style={styles.authoringInfoContainer}>
							<Text>fullName</Text>
							<Text appearance="hint" category="p2">
								date
							</Text>
						</View>

						<Button
							style={styles.iconButton}
							appearance="ghost"
							status="basic"
							icon={MessageCircleIcon}
						>
							{`${data.comments.length}`}
						</Button>
						<Button
							style={styles.iconButton}
							appearance="ghost"
							status="danger"
							icon={HeartIcon}
						>
							{`${data.likes.length}`}
						</Button>
					</View>*/}
			</ScrollView>

			<TouchableOpacity
				style={{ ...themedStyles.filterMap }}
				onPress={() => _callShowDirections()}
			>
				<Icon
					name="navigation-outline"
					style={{
						width: 24,
						height: 24,
					}}
					fill="#fff"
				/>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const themedStyles = StyleService.create({
	container: {
		flex: 1,
		backgroundColor: "background-basic-color-2",
		paddingBottom: 8,
	},
	list: {
		flex: 1,
	},
	header: {
		// marginBottom: 8,
		flexDirection: "row",
		// marginHorizontal: -16,
		paddingHorizontal: 8,
		paddingTop: 16,
		paddingBottom: 7,
		// marginBottom: 8,
	},
	profileDetailsContainer: {
		flex: 1,
		marginHorizontal: 8,
	},

	backdrop: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	image: {
		height: 240,
	},
	typeLabel: {
		marginLeft: 20,
		height: 30,
		width: 50,
		alignItems: "center",
		borderRadius: 10,
		marginVertical: 2,
		backgroundColor: "#3366FF",
	},
	descriptionLabel: {
		margin: 24,
	},
	contentLabel: {
		margin: 24,
	},
	authoringContainer: {
		flexDirection: "row",
		marginHorizontal: 24,
	},
	dateLabel: {
		marginHorizontal: 8,
	},
	commentInputLabel: {
		fontSize: 16,
		marginBottom: 8,
		color: "text-basic-color",
	},
	commentInput: {
		marginHorizontal: 24,
		marginTop: 24,
		marginBottom: 20,
	},
	activityContainer: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
	},
	authoringInfoContainer: {
		flex: 1,
		marginHorizontal: 16,
	},
	iconButton: {
		paddingHorizontal: 0,
	},
	profileAvatar: {
		marginHorizontal: 8,
	},
	filterMap: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		alignSelf: "center",
		padding: 10,
		backgroundColor: "#0469c1",
		position: "absolute",
		bottom: 20,
		right: 15,
		borderRadius: 30,
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

const stylesX = StyleSheet.create({
	mapStyle: {
		width: Dimensions.get("window").width,
		height: 275,
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailPostalScreen);
