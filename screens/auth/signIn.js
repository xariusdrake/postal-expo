import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	ScrollView,
	View,
	TouchableWithoutFeedback,
	Keyboard,
	KeyboardAvoidingView,
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

import { useQuery, useLazyQuery } from "@apollo/client";
import { QUERY_LOGIN_USER, QUERY_CHECK_USER_TOKEN } from "../../graphql/query";

import { isEmpty, isMin, isPhoneNumber } from "../../functions/strings";
import { saveUserdata, saveToken } from "../../functions/helpers.js";

import appConfigs from "../../config";

import Spinner from "react-native-loading-spinner-overlay";

const color_blue = "#0469c1";

function SignInScreen(props) {
	const [
		loginUser,
		{
			error: errorLogin,
			called: calledLogin,
			loading: loadingLogin,
			data: dataLogin,
		},
	] = useLazyQuery(QUERY_LOGIN_USER, {
		fetchPolicy: "no-cache",
		onCompleted: (dataLogin) => {
			console.log("onCompleted");
			console.log(48, dataLogin);
			saveUserData();
		},
		onError: (errorLogin) => {
			setTimeout(function () {
				Alert.alert("Có lỗi xảy ra");
			}, 700);

			console.log("onError");
			console.log(errorLogin);
		},
	});

	// const [
	// 	checkUserToken,
	// 	{
	// 		error: errorCheckToken,
	// 		called: calledCheckToken,
	// 		loading: loadingCheckToken,
	// 		data: dataCheckToken,
	// 	},
	// ] = useLazyQuery(QUERY_CHECK_USER_TOKEN, {
	// 	// fetchPolicy: "no-cache",
	// 	onCompleted: (dataCheckToken) => {
	// 		console.log("dataCheckToken onCompleted");
	// 		console.log(dataCheckToken);
	// 	},
	// 	onError: (errorCheckToken) => {
	// 		console.log("onError errorCheckToken");
	// 		console.log(errorCheckToken);
	// 	},
	// });

	const [phoneInput, setPhoneInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	const [loading, setLoading] = useState(false);

	const saveUserData = async () => {
		if (isEmpty(dataLogin.users[0]) == true) {
			setLoading(false);
			Alert.alert("Tài khoản mật khẩu của bạn không chính xác");
			setPasswordInput("");
			// this.firstInput.focus();
			return;
		}

		if (dataLogin) {
			if (dataLogin.users[0].id) {
				let user = dataLogin.users[0];

				console.log(126, user);

				if (user.is_actived == -1) {
					Alert.alert(
						"Tài khoản của bạn đã bị khoá" +
							(!!user.block_message
								? "\n Lý do: " + user.block_message
								: "")
					);
					return;
				}

				saveToken(user.token, props);
				saveUserdata(user, props);

				props.navigation.navigate("Explore");
			} else {
			}
		} else {
			console.log("sucess graphql but not right response");
		}
	};

	const onClickLogin = async () => {
		Keyboard.dismiss();

		if (!phoneInput.trim()) {
			Alert.alert("Vui lòng nhập số điện thoại");
			return;
		} else if (isPhoneNumber(phoneInput) == false) {
			Alert.alert("Số điện thoại không hợp lệ");
			return;
		} else if (!passwordInput.trim()) {
			Alert.alert("Vui lòng nhập mật khẩu");
			return;
		}
		// if (isMin(phoneInput, appConfigs.VALIDATE.AUTH.MIN_USERNAME)) {
		// 	Alert.alert("Tên tài khoản từ 6 đến 15 ký tự");
		// 	return;
		// } else if (isMin(passwordInput, appConfigs.VALIDATE.AUTH.MIN_PASSWORD)) {
		// 	Alert.alert("Mật khẩu từ 6 đến 15 ký tự");
		// 	// secondInput.focus();
		// 	return;
		// }

		setLoading(true);

		console.log(126, phoneInput, passwordInput);

		loginUser({
			variables: {
				phone: phoneInput.toString(),
				password: passwordInput,
			},
		});
		// loginUser({ variables: { phone: '0964940256', password: 'htn@2021' } });
	};

	if (props.token) {
		props.navigation.navigate("Explore");
		return <AppLoading />;
	} else {
		return (
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.container}
			>
				<ScrollView
					showsVerticalScrollIndicator={false}
					style={styles.scrollview}
				>
					<Spinner visible={loadingLogin} />
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
									Đăng nhập
								</Text>

								<Text style={[styles.textBlackSize14]}>
									Số điện thoại
								</Text>
								<TextInput
									maxLength={11}
									value={phoneInput}
									autoCapitalize="none"
									underlineColorAndroid="#00000000"
									returnKeyType={"next"}
									onSubmitEditing={() => {}}
									style={styles.customEditText}
									clearButtonMode="while-editing"
									enablesReturnKeyAutomatically={true}
									blurOnSubmit={false}
									placeholder={"Nhập số điện thoại"}
									onChangeText={(text) => setPhoneInput(text)}
									keyboardType="numeric"
								/>

								<Text style={styles.textBlackSize14}>
									Mật khẩu
								</Text>

								<TextInput
									value={passwordInput}
									autoCapitalize="none"
									secureTextEntry
									underlineColorAndroid="#00000000"
									returnKeyType={"next"}
									onSubmitEditing={() => {}}
									style={styles.customEditText}
									clearButtonMode="while-editing"
									enablesReturnKeyAutomatically={true}
									blurOnSubmit={false}
									placeholder={"Nhập mật khẩu"}
									onChangeText={(text) =>
										setPasswordInput(text)
									}
								/>
								<TouchableOpacity
									style={[
										styles.forgotContainer,
										{ height: 44, marginTop: 16 },
									]}
									onPress={() =>
										props.navigation.navigate(
											"ForgetPassword"
										)
									}
								>
									<Text style={styles.forgotPass}>
										Quên mật khẩu ?
									</Text>
								</TouchableOpacity>

								<View
									style={{
										flexDirection: "row",
										marginTop: 24,
									}}
								>
									<TouchableOpacity
										style={styles.buttonBackgroundBlue}
										activeOpacity={0.5}
										onPress={() => onClickLogin()}
									>
										<View style={{ padding: 10 }}>
											<Text
												style={[
													styles.textWhite,
													{ fontSize: 16 },
												]}
											>
												Đăng nhập
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
											props.navigation.navigate("SignUp")
										}
									>
										<Text style={styles.textSignUp}>
											Đăng ký
										</Text>
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
											props.navigation.navigate("Explore")
										}
									>
										<Text style={styles.textSignUp}>
											Quay về
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
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
		color: color_blue,
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
		backgroundColor: color_blue,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonBorderBlue: {
		flex: 1,
		borderColor: color_blue,
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

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);
