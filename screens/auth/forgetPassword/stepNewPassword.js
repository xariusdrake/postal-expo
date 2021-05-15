import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	ScrollView,
	View,
	TouchableWithoutFeedback,
	Keyboard,
	Platform,
	AsyncStorage,
	TouchableOpacity,
	TextInput,
	Alert,
} from "react-native";
import { Text } from "@ui-kitten/components";

import { StatusBar } from "expo-status-bar";
import { connect } from "react-redux";

// custom fonts
import { AppLoading } from "expo";
import SMS from "../../../functions/sms";

import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { MUTATION_FORGET_PASSWORD_CHANGE } from "../../../graphql/query";

import { isEmpty, isMin } from "../../../functions/strings";

import appConfigs from "../../../config";

import Spinner from "react-native-loading-spinner-overlay";

function ForgetPasswordScreen(props) {
	const [
		changePassword,
		{
			error: errorChange,
			called: calledChange,
			loading: loadingChange,
			data: dataChange,
		},
	] = useMutation(MUTATION_FORGET_PASSWORD_CHANGE, {
		onCompleted: (dataChange) => {
			console.log("onCompleted");
			setLoading(false);
			console.log(44, dataChange);

			if (isEmpty(dataChange.update_users.returning[0]) == true) {
				console.log("false");

				setTimeout(() => {
					Alert.alert("Có lỗi xảy ra.");
				}, 800);
			} else {
				console.log("success");

				props.navigation.navigate("SignIn");

				setTimeout(() => {
					Alert.alert("Mật khẩu đã được thay đổi");
				}, 1000);
			}
		},
		onError: (errorChange) => {
			console.log("onError");
			setLoading(false);
			console.log(errorChange);
		},
	});
	const [passwordInput, setPasswordInput] = useState(null);
	const [rePasswordInput, setRePasswordInput] = useState(null);
	const [loading, setLoading] = useState(false);

	const onSubmit = async () => {
		console.log(100, "onClickSubmit");

		if (passwordInput.length < 1) {
			Alert.alert("Vui lòng nhập mật khẩu hiện tại");
			return;
		} else if (passwordInput.length < 1) {
			Alert.alert("Vui lòng nhập mật khẩu mới");
			return;
		} else if (passwordInput.length < 1) {
			Alert.alert("Vui lòng nhập lại mật khẩu mới");
			return;
		} else if (passwordInput != rePasswordInput) {
			Alert.alert("Mật khẩu mới không giống nhau");
			return;
		}

		setLoading(true);

		changePassword({
			variables: {
				uid: props.route.params.uid,
				newPassword: rePasswordInput.toString(),
			},
		});
	};

	if (props.token) {
		props.navigation.navigate("Explore");
		return <AppLoading />;
	} else {
		return (
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={styles.scrollview}
			>
				<Spinner visible={loadingChange} />
				<View style={{ ...styles.container }}>
					<TouchableWithoutFeedback
						onPress={Keyboard.dismiss}
						style={{ width: "100%" }}
					>
						<View
							style={{
								flexDirection: "column",
								margin: 50,
								marginTop: -120,
								paddingTop: 300,
							}}
						>
							<Text
								style={{
									fontSize: 22,
									color: "#000",
								}}
							>
								Đặt lại mật khẩu
							</Text>

							<Text style={[styles.textBlackSize14]}>
								Mật khẩu mới
							</Text>
							<TextInput
								value={passwordInput}
								autoCapitalize="none"
								underlineColorAndroid="#00000000"
								returnKeyType={"next"}
								onSubmitEditing={() => {}}
								style={styles.customEditText}
								clearButtonMode="while-editing"
								enablesReturnKeyAutomatically={true}
								blurOnSubmit={false}
								placeholder={"Nhập mật khẩu"}
								onChangeText={(text) => setPasswordInput(text)}
							/>

							<Text style={[styles.textBlackSize14]}>
								Nhập lại mật khẩu
							</Text>
							<TextInput
								value={rePasswordInput}
								autoCapitalize="none"
								underlineColorAndroid="#00000000"
								returnKeyType={"next"}
								onSubmitEditing={() => {}}
								style={styles.customEditText}
								clearButtonMode="while-editing"
								enablesReturnKeyAutomatically={true}
								blurOnSubmit={false}
								placeholder={"Nhập lại mật khẩu"}
								onChangeText={(text) =>
									setRePasswordInput(text)
								}
							/>

							<View
								style={{ flexDirection: "row", marginTop: 24 }}
							>
								<TouchableOpacity
									style={styles.buttonBackgroundBlue}
									activeOpacity={0.5}
									onPress={() => onSubmit()}
								>
									<View style={{ padding: 10 }}>
										<Text
											style={[
												styles.textWhite,
												{ fontSize: 16 },
											]}
										>
											Lưu
										</Text>
									</View>
								</TouchableOpacity>
							</View>

							<View
								style={{
									flexDirection: "row",
									marginTop: 20,
									height: 40,
								}}
							>
								<TouchableOpacity
									style={styles.buttonBorderBlue}
									activeOpacity={0.5}
									onPress={() =>
										props.navigation.navigate("SignIn")
									}
								>
									<Text style={styles.textSignUp}>
										Quay về đăng nhập
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
	},
	forgotContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	forgotPass: {
		color: "#0469c1",
		fontSize: 12,
	},

	textBlackSize14: {
		color: "#202020",
		fontSize: 15,
		marginTop: 20,
		marginBottom: 10,
	},
	buttonBackgroundBlue: {
		flex: 1,
		backgroundColor: "#0469c1",
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonBorderBlue: {
		flex: 1,
		borderColor: "#0469c1",
		borderRadius: 20,
		borderWidth: 1.5,
		alignItems: "center",
		justifyContent: "center",
	},
	textSignUp: {
		fontSize: 16,
		color: "#0469c1",
	},
	customEditText: {
		backgroundColor: "#F4F5F6",
		borderRadius: 10,
		padding: 8,
		paddingStart: 15,
		color: "#9597A1",
	},
	textWhite: {
		fontSize: 18,
		color: "#fff",
	},

	scrollview: {
		backgroundColor: "#fff",
	},
});

function mapStateToProps(state) {
	return { token: state.token };
}

export default connect(mapStateToProps, null)(ForgetPasswordScreen);
