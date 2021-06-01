import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	ScrollView,
	View,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
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
import { saveUserdata, saveToken } from "../../functions/helpers.js";
// custom fonts
import { AppLoading } from "expo";
import Spinner from "react-native-loading-spinner-overlay";

import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { MUTATION_SIGNUP_USER } from "../../graphql/query";

import {
	isEmpty,
	isMin,
	isMax,
	allLetter,
	allNumeric,
	isPhoneNumber,
	isPassword,
} from "../../functions/strings";

import appConfigs from "../../config";

const color_blue = "#0469c1";

const QUERY_CHECK_PHONE = gql`
	query QueryCheckPhone($phone: String!) {
		users(where: { phone: { _eq: $phone } }) {
			id
		}
	}
`;

function SignUpScreen(props) {
	const [
		signUpUser,
		{
			error: errorSignUp,
			called: calledSignUp,
			loading: loadingSignUp,
			data: dataSignUp,
		},
	] = useMutation(MUTATION_SIGNUP_USER, {
		fetchPolicy: "no-cache",
		onCompleted: (dataSignUp) => {
			console.log("onCompleted");
			console.log(62, dataSignUp);
			console.log(63, dataSignUp.insert_users);
			console.log(64, dataSignUp.insert_users.returning[0]);

			saveToken(dataSignUp.insert_users.returning[0].token, props);
			saveUserdata(dataSignUp.insert_users.returning[0], props);

			// setTimeout(function () {
				setLoading(false);
				props.navigation.navigate("Explore");
			// }, 850);
		},
		onError: (errorSignUp) => {
			setLoading(false);
			setTimeout(function () {
				Alert.alert("Có lỗi xảy ra");
			}, 700);
			console.log("onErrorX");
			console.log(errorSignUp);
		},
	});

	const [
		checkPhone,
		{
			error: errorCheckPhone,
			called: calledCheckPhone,
			loading: loadingCheckPhone,
			data: dataCheckPhone,
		},
	] = useLazyQuery(QUERY_CHECK_PHONE, {
		fetchPolicy: "no-cache",
		onCompleted: (dataCheckPhone) => {
			console.log("dataCheckToken onCompleted");
			console.log(dataCheckPhone);
			// console.log(dataCheckPhone.users[0].id);

			if (dataCheckPhone.users.length > 0) {
				setLoading(false);

				setTimeout(function () {
					Alert.alert("Số điện thoại đã được đăng ký!");
				}, 700);
			} else {
				signUpUser({
					variables: {
						fullname: fullnameInput,
						phone: phoneInput.toString(),
						password: passwordInput,
					},
				});
			}
		},
		onError: (errorCheckPhone) => {
			setLoading(false);
			setTimeout(function () {
				Alert.alert("Có lỗi xảy ra");
			}, 700);
			console.log("onError errorCheckToken");
			console.log(errorCheckPhone);
		},
	});

	const [fullnameInput, setFullnameInput] = useState("");
	const [phoneInput, setPhoneInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	const [rePasswordInput, setRePasswordInput] = useState("");
	const [dataResponse, setDataResponse] = useState({});

	const [loading, setLoading] = useState(false);

	// const saveUserData = async () => {
	// 	if (isEmpty(dataResponse.insert_users.returning[0]) == true) {
	// 		setLoading(false);
	// 		Alert.alert("Tài khoản mật khẩu của bạn không chính xác");
	// 		setPasswordInput("");
	// 		// this.firstInput.focus();
	// 		return;
	// 	}

	// 	if (dataResponse) {
	// 		if (dataResponse.insert_users.returning[0].id) {
	// 			let user = dataResponse.insert_users.returning[0];

	// 			console.log(126, user);

	// 			props.storeData(user.token);
	// 			props.storeUserInfo(user);

	// 			try {
	// 				await AsyncStorage.setItem("@token", user.token);
	// 			} catch (e) {
	// 				console.log(e);
	// 			}

	// 			props.navigation.navigate("Explore");
	// 		} else {
	// 		}
	// 	} else {
	// 		console.log("sucess graphql but not right response");
	// 	}
	// };

	const onClickSignUp = async () => {
		Keyboard.dismiss();

		// let phoneno = /^\d{10}$/;

		if (allLetter(fullnameInput) == false) {
			Alert.alert("Họ tên chỉ bao gồm chữ");
			return;
		} else if (
			isMin(fullnameInput, appConfigs.VALIDATE.USER.MIN_FULLNAME) ==
				false ||
			isMax(fullnameInput, appConfigs.VALIDATE.USER.MAX_FULLNAME) == false
		) {
			Alert.alert(
				"Họ tên từ " +
					appConfigs.VALIDATE.USER.MIN_FULLNAME +
					" đến " +
					appConfigs.VALIDATE.USER.MAX_FULLNAME +
					" ký tự"
			);
			return;
		} else if (isPhoneNumber(phoneInput) == false) {
			Alert.alert("Số điện thoại không hợp lệ");
			return;
		} else if (isPassword(passwordInput) == false) {
			Alert.alert(
				"Mật khẩu từ " +
					appConfigs.VALIDATE.USER.MIN_PASSWORD +
					" đến " +
					appConfigs.VALIDATE.USER.MAX_PASSWORD +
					" ký tự"
			);
			return;
		} else if (passwordInput != rePasswordInput) {
			Alert.alert("Mật khẩu bạn nhập không giống nhau");
			return;
		}

		console.log(111, fullnameInput, phoneInput, passwordInput);

		setLoading(true);
		checkPhone({ variables: { phone: phoneInput.toString() } });
	};

	if (!!props.infos) {
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
					<View style={{ ...styles.container }}>
						<Spinner visible={loading} />
						<TouchableWithoutFeedback
							onPress={Keyboard.dismiss}
							style={{ width: "100%" }}
						>
							<View
								style={{
									flexDirection: "column",
									margin: 50,
									marginTop: -60,
									paddingTop: 220,
								}}
							>
								<Text
									style={{
										fontSize: 22,
										color: "#000",
									}}
								>
									Tạo tài khoản
								</Text>

								<Text style={[styles.textBlackSize14]}>
									Họ và tên
								</Text>
								<TextInput
									autoCapitalize="none"
									underlineColorAndroid="#00000000"
									returnKeyType={"next"}
									onSubmitEditing={() => {}}
									style={styles.customEditText}
									clearButtonMode="while-editing"
									enablesReturnKeyAutomatically={true}
									blurOnSubmit={false}
									placeholder={"Nhập tài khoản"}
									// ref={(input) => {}}
									onChangeText={(e) => setFullnameInput(e)}
								/>

								<Text style={[styles.textBlackSize14]}>
									Số điện thoại
								</Text>
								<TextInput
									maxLength={11}
									autoCapitalize="none"
									underlineColorAndroid="#00000000"
									returnKeyType={"next"}
									onSubmitEditing={() => {}}
									style={styles.customEditText}
									clearButtonMode="while-editing"
									enablesReturnKeyAutomatically={true}
									blurOnSubmit={false}
									placeholder={"Nhập số điện thoại"}
									// ref={(input) => {}}
									onChangeText={(text) => setPhoneInput(text)}
									keyboardType={"phone-pad"}
									keyboardType="numeric"
								/>

								<Text style={styles.textBlackSize14}>
									Mật khẩu
								</Text>

								<TextInput
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

								<Text style={styles.textBlackSize14}>
									Nhập lại mật khẩu
								</Text>

								<TextInput
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
										setRePasswordInput(text)
									}
								/>

								<TouchableOpacity
									style={[
										styles.forgotContainer,
										{ height: 44, marginTop: 10 },
									]}
								>
									<Text
										style={styles.forgotPass}
										onPress={() =>
											props.navigation.navigate("SignIn")
										}
									>
										Quay về đăng nhập
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
										onPress={() => onClickSignUp()}
									>
										<View style={{ padding: 10 }}>
											<Text
												style={[
													styles.textWhite,
													{ fontSize: 16 },
												]}
											>
												Đăng ký
											</Text>
										</View>
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
		color: "#555EF3",
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
	return { infos: state.infos, token: state.token };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);
