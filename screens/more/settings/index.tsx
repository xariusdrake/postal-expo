import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	TouchableOpacity,
	TouchableOpacityProps,
	AsyncStorage,
	View,
	SafeAreaView,
	ScrollView,
	Alert,
} from "react-native";

import { connect } from "react-redux";
import * as Updates from "expo-updates";

import {
	Layout,
	Toggle,
	Text,
	TopNavigation,
	Divider,
	Avatar,
	Button,
} from "@ui-kitten/components";
import { Setting } from "./extra/settings-section.component";
import {
	useQuery,
	useLazyQuery,
	useMutation,
	useSubscription,
	gql,
} from "@apollo/client";

const SUBSCRIPTION_USER_INFO = gql`
	subscription MySubscription {
		users(where: { id: { _eq: 32 } }) {
			id
			fullname
			is_actived
		}
	}
`;

function MoreInfoScreen(props) {
	// const [
	// 	liveUserInfo,
	// 	{
	// 		error: errorInfo,
	// 		called: calledInfo,
	// 		loading: loadingInfo,
	// 		data: dataInfo,
	// 	},
	// ] = useSubscription(SUBSCRIPTION_USER_INFO, {
	// 	onCompleted: (dataInfo) => {
	// 		console.log(47, dataInfo);
	// 	},
	// 	onError: (errorInfo) => {},
	// });

	// const { data, loading } = useSubscription(SUBSCRIPTION_USER_INFO, {
	// 	onSubscriptionData: (data) => {
	// 		console.log(47, data);
	// 	},
	// 	// onError: (errorInfo) => {},
	// });

	// const [soundEnabled, setSoundEnabled] = React.useState < boolean > false;

	// const toggleSound = (): void => {
	// 	setSoundEnabled(!soundEnabled);
	// };

	const [newUpdate, setNewUpdate] = useState(false);

	const logout = async () => {
		try {
			await AsyncStorage.removeItem("@token");
			await props.storeData("");
			props.navigation.navigate("More");
		} catch (exception) {
			console.log(exception);
		}
	};

	function signin() {
		props.navigation.navigate("SignIn");
	}

	useEffect(() => {
		// if (!!props.infos.id) {
		// 	liveUserInfo()
		// }

		checkUpdate();
	});

	// function signin() {
	// 	props.navigation.navigate("SignIn");
	// }

	async function checkUpdate() {
		console.log("UpdateApp");
		try {
			const update = await Updates.checkForUpdateAsync();
			if (update.isAvailable) {
				setNewUpdate(false);
				// Alert.alert("Phiên bản mới nhất đang bắt đầu cập nhật");

				// await Updates.fetchUpdateAsync();
				// await Updates.reloadAsync();
			} else {
				setNewUpdate(true);
				// Alert.alert("Bạn đang sử dụng phiên bản mới nhất");
				console.log("nothing");
			}
		} catch (e) {
			console.log(e);
		}
	}

	async function updateVersion() {
		if (newUpdate == true) {
			console.log("updateVersion");
			Alert.alert("Phiên bản mới nhất đang bắt đầu cập nhật");
			await Updates.fetchUpdateAsync();
			await Updates.reloadAsync();
		} else {
			Alert.alert("Bạn đang sử dụng phiên bản mới nhất");
		}
	}

	return (
		<Layout style={styles.container}>
			<ScrollView>
				<SafeAreaView>
					{props.token.length > 0 && (
						<React.Fragment>
							<Layout style={styles.header} level="1">
								<View style={styles.profileContainer}>
									<View
										style={styles.profileDetailsContainer}
									>
										<Text category="h5">
											{props.infos.fullname}
										</Text>
										<View
											style={
												styles.profileLocationContainer
											}
										>
											<Text
												// style={styles.profileLocation}
												appearance="hint"
												category="s1"
											>
												{props.infos.phone}
											</Text>
										</View>
									</View>

									{/*<Avatar
									style={styles.profileAvatar}
									size="large"
									source={{
										uri:
											"https://cdn0.iconfinder.com/data/icons/octicons/1024/mark-github-512.png",
									}}
								/>*/}
								</View>

								{props.infos.is_actived == 0 && (
									<View
										style={styles.profileButtonsContainer}
									>
										<Button
											appearance="outline"
											status=""
											style={styles.profileButton}
											onPress={() =>
												props.navigation.navigate(
													"VerifyPhoneNumber"
												)
											}
										>
											<Text style={{ color: "#0469c1" }}>
												Xác thực
											</Text>
										</Button>
									</View>
								)}
							</Layout>
							<Divider />
							<Setting
								style={styles.setting}
								hint="Chỉnh sửa tài khoản"
								onPress={() =>
									props.navigation.navigate("ProfileSetting")
								}
							/>
							{/*<Text>{data.users[0].id}</Text>*/}
							<Setting
								style={styles.setting}
								hint="Thay đổi số điện thoại"
								onPress={() =>
									props.navigation.navigate(
										"ChangePhoneNumber"
									)
								}
							/>
							<Setting
								style={styles.setting}
								hint="Thay đổi mật khẩu"
								onPress={() =>
									props.navigation.navigate("ChangePassword")
								}
							/>
							<Setting
								style={styles.setting}
								hint="Đăng xuất"
								onPress={logout}
							/>
						</React.Fragment>
					)}

					{props.token.length == 0 && (
						<React.Fragment>
							<Setting
								style={styles.setting}
								hint="Đăng nhập"
								onPress={() =>
									props.navigation.navigate("SignIn")
								}
							/>
							<Setting
								style={styles.setting}
								hint="Đăng ký"
								onPress={() =>
									props.navigation.navigate("SignUp")
								}
							/>
						</React.Fragment>
					)}

					<TouchableOpacity
						// {...touchableOpacityProps}
						style={[styles.containerSetting, styles.setting]}
					>
						<Text
							status="info"
							category="s1"
							style={{ color: "#0469c1" }}
						>
							Mã bưu chính
						</Text>
					</TouchableOpacity>
					<Divider />
					<Setting
						style={styles.setting}
						hint="Đăng ký mã bưu chính"
						onPress={() =>
							props.navigation.navigate("CreatePostal", {
								isUpdate: false,
							})
						}
					/>
					<TouchableOpacity
						// {...touchableOpacityProps}
						style={[styles.containerSetting, styles.setting]}
					>
						<Text
							status="info"
							category="s1"
							style={{ color: "#0469c1" }}
						>
							Phiên bản 2.4.3
						</Text>
					</TouchableOpacity>
					<Divider />

					{/*{newUpdate == true && (*/}
					<Setting
						style={styles.setting}
						hint="Cập nhật phiên bản mới"
						onPress={() => updateVersion()}
					/>
					{/*)}*/}

					{/*<Setting
					style={styles.setting}
					hint="Đăng ký mã bưu chính [X]"
					onPress={() =>
						props.navigation.navigate("CreatePostalLocation", {
							isUpdate: false,
						})
					}
				/>*/}

					{/*<TouchableOpacity
						style={[styles.containerSetting, styles.setting]}
					>
						<Text
							status="info"
							category="s1"
							style={{ color: "#0469c1" }}
						>
							Thông tin
						</Text>
					</TouchableOpacity>
					<Divider />
					<Setting
						style={styles.setting}
						hint="Giới thiệu"
						onPress={() => props.navigation.navigate("IntroModal")}
					/>
					<Setting
						style={styles.setting}
						hint="Hướng dẫn"
						onPress={() => props.navigation.navigate("GuideModal")}
					/>
					<Setting
						style={styles.setting}
						hint="Văn bản"
						onPress={() =>
							props.navigation.navigate("DocumentModal")
						}
					/>*/}
					{/*<Setting
						style={styles.setting}
						hint="Văn bản"
						onPress={() => props.navigation.navigate("MapScreen")}
					/>*/}
				</SafeAreaView>
			</ScrollView>
		</Layout>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 30,
	},
	header: {
		padding: 10,
	},

	profileContainer: {
		flexDirection: "row",
	},
	profileDetailsContainer: {
		flex: 1,
		marginHorizontal: 8,
	},
	profileLocationContainer: {
		paddingTop: 5,
		flexDirection: "row",
		alignItems: "center",
	},
	containerSetting: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	profileButtonsContainer: {
		flexDirection: "row",
		marginVertical: 24,
	},
	profileButton: {
		flex: 1,
		marginHorizontal: 4,
		borderColor: "#0469c1",
		color: "#0469c1",
	},
	setting: {
		padding: 16,
	},
	section: {
		paddingTop: 32,
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

export default connect(mapStateToProps, mapDispatchToProps)(MoreInfoScreen);
