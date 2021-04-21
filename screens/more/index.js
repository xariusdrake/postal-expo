import React from "react";

import {
	StyleSheet,
	View,
	ScrollView,
	TouchableOpacity,
	Text,
	Image,
	Platform,
	AsyncStorage,
	SafeAreaView,
} from "react-native";
import { ListItem } from "react-native-elements";

import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { connect } from "react-redux";

import * as Linking from "expo-linking";

/* Color ref */
var mint = "#0469c1";

function MoreInfoScreen(props) {
	const logout = async () => {
		console.log("logout");
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

	async function UpdateApp() {
		try {
	const update = await Updates.checkForUpdateAsync();
	if (update.isAvailable) {
		await Updates.fetchUpdateAsync();
		// ... notify user of update ...
		await Updates.reloadAsync();
	}
} catch (e) {
	// handle or log error
}
	}
	

	return (
		<SafeAreaView>
			<ScrollView style={{ backgroundColor: "white" }}>
				<ListItem
					titleStyle={styles.h1}
					title="Tài khoản"
					bottomDivider
				/>

				{props.token.length > 0 && (
					<View>
						<TouchableOpacity
							// onPress={() => props.navigation.navigate("Account")}
							onPress={() =>
								props.navigation.navigate("ProfileScreen2")
							}
						>
							<ListItem
								rightIcon={
									<FontAwesome
										name="user"
										size={20}
										color={mint}
									/>
								}
								titleStyle={{ color: "#033C47" }}
								title="Chỉnh sửa tài khoản"
								bottomDivider
							/>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => logout}>
							<ListItem
								rightIcon={
									<AntDesign
										name="logout"
										size={20}
										color={mint}
									/>
								}
								titleStyle={{ color: "#033C47" }}
								title="Đăng xuất"
								bottomDivider
							/>
						</TouchableOpacity>
					</View>
				)}

				{!props.token && (
					<TouchableOpacity onPress={signin}>
						<ListItem
							rightIcon={
								<FontAwesome
									name="sign-in"
									size={20}
									color={mint}
								/>
							}
							titleStyle={{ color: "#033C47" }}
							title="Đăng nhập x"
							bottomDivider
						/>
					</TouchableOpacity>
				)}

				<ListItem
					titleStyle={styles.h1}
					title="Mã bưu chính"
					bottomDivider
				/>
				<View>
					<TouchableOpacity
						onPress={() =>
							props.navigation.navigate("CreatePostal", {isUpdate: false})
						}
					>
						<ListItem
							titleStyle={{ color: "#033C47" }}
							title="Đăng ký mã bưu chính"
							bottomDivider
						/>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => props.navigation.navigate("ScanQR")}
					>
						<ListItem
							titleStyle={{ color: "#033C47" }}
							title="Quét mã QR"
							bottomDivider
						/>
					</TouchableOpacity>
				</View>

				<ListItem
					titleStyle={styles.h1}
					title="Thông tin"
					bottomDivider
				/>
				<View>
					<TouchableOpacity
						onPress={() => props.navigation.navigate("IntroModal")}
					>
						<ListItem
							titleStyle={{ color: "#033C47" }}
							title="Giới thiệu"
							bottomDivider
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => props.navigation.navigate("GuideModal")}
					>
						<ListItem
							titleStyle={{ color: "#033C47" }}
							title="Hướng dẫn"
							bottomDivider
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() =>
							props.navigation.navigate("DocumentModal")
						}
					>
						<ListItem
							titleStyle={{ color: "#033C47" }}
							title="Văn bản"
							bottomDivider
						/>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	h1: {
		color: mint,
		fontSize: 18,
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
	return { token: state.token };
}

export default connect(mapStateToProps, mapDispatchToProps)(MoreInfoScreen);
