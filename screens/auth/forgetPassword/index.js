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
import {
	MUTATION_CREATE_CODE_CONFIRM,
	QUERY_FORGET_PASSWORD_CHECK_PHONE,
	QUERY_FORGET_PASSWORD_CHECK_CODE,
} from "../../../graphql/query";

import {
	isEmpty,
	isMin,
	isPhoneNumber,
	allNumeric,
} from "../../../functions/strings";

import appConfigs from "../../../config";

import Spinner from "react-native-loading-spinner-overlay";

function ForgetPasswordScreen(props) {
	const [
		checkPhone,
		{
			error: errorCheckPhone,
			called: calledCheckPhone,
			loading: loadingCheckPhone,
			data: dataCheckPhone,
		},
	] = useLazyQuery(QUERY_FORGET_PASSWORD_CHECK_PHONE, {
		// fetchPolicy: "no-cache",
		onCompleted: (dataCheckPhone) => {
			console.log("dataCheckPhone onCompleted");
			console.log(dataCheckPhone);

			if (isEmpty(dataCheckPhone.users[0]) == true) {
				Alert.alert("Không tìm thấy tài khoản");
			} else {
				setUid(dataCheckPhone.users[0].id);

				let randomCode = Math.floor(1000 + Math.random() * 9000);
				console.log("randomCode: " + randomCode);

				createCodeConfirm({
					variables: {
						code: randomCode,
						phone: parseInt(phoneInput),
					},
				});
			}
		},
		onError: (errorCheckPhone) => {
			Alert.alert("Có lỗi xảy ra");
			console.log("onError errorCheckPhone");
			console.log(errorCheckPhone);
		},
	});

	const [
		createCodeConfirm,
		{
			error: errorCode,
			called: calledCode,
			loading: loadingCode,
			data: dataCode,
		},
	] = useMutation(MUTATION_CREATE_CODE_CONFIRM, {
		// fetchPolicy: "no-cache",
		onCompleted: (dataCode) => {
			console.log(dataCode);
			console.log(44, dataCode.insert_user_confirm_code.returning[0].id);

			if (dataCode.insert_user_confirm_code.returning[0].id != null) {
				console.log("just call");

				let phone = "84" + phoneInput.substring(1);

				console.log("phone: " + phone);

				SMS.send({
					message:
						dataCode.insert_user_confirm_code.returning[0].code +
						" la ma xac minh dang ky Baotrixemay cua ban",
					phone: phone,
				})
					.then((response) => {
						console.log("response SMS");
						console.log(response);
					})
					.catch((error) => {
						console.log("error");
						console.log(error);
					})
					.finally(() => {
						setEnterCodeScreen(true);

						console.log("finally");
					});
			} else {
				console.log("false id");
			}
		},
		onError: (errorCode) => {
			Alert.alert("Có lỗi xảy ra");
			console.log("onError");
			console.log(errorCode);
		},
	});

	const [
		checkCodeConfirm,
		{
			error: errorCodeConfirm,
			called: calledCodeConfirm,
			loading: loadingCodeConfirm,
			data: dataCodeConfirm,
		},
	] = useLazyQuery(QUERY_FORGET_PASSWORD_CHECK_CODE, {
		// fetchPolicy: "no-cache",
		onCompleted: (dataCodeConfirm) => {
			console.log(dataCodeConfirm);
			// console.log(44, dataCodeConfirm.user_confirm_code[0].id);

			if (dataCodeConfirm.user_confirm_code[0].id != null) {
				props.navigation.navigate("ForgetPasswordStepNewPassword", {
					uid: uid,
				});
			} else {
				console.log("false id");
			}
		},
		onError: (errorCodeConfirm) => {
			Alert.alert("Có lỗi xảy ra");
			console.log("onError");
			console.log(errorCodeConfirm);
		},
	});

	const [phoneInput, setPhoneInput] = useState("");
	const [codeInput, setCodeInput] = useState(null);
	const [uid, setUid] = useState(null);
	const [getEnterCodeScreen, setEnterCodeScreen] = useState(false);

	const onSubmit = async () => {
		Keyboard.dismiss();

		if (!phoneInput.trim()) {
			Alert.alert("Vui lòng nhập số điện thoại");
			return;
		} else if (isPhoneNumber(phoneInput) == false) {
			Alert.alert("Số điện thoại không hợp lệ!");
			return;
		}

		console.log(126, phoneInput);

		checkPhone({
			variables: {
				phone: phoneInput.toString(),
			},
		});
	};

	const checkCode = async () => {
		Keyboard.dismiss();

		if (!codeInput.trim()) {
			Alert.alert("Vui lòng mã xác thực");
			return;
		} else if (allNumeric(codeInput) == false) {
			Alert.alert("Mã xác thực không hợp lệ");
			return;
		} else if (codeInput.length != 4) {
			Alert.alert("Xác thực gồm 4 ký tự. Vui lòng nhập lại");
			return;
		} else if (!phoneInput.trim()) {
			Alert.alert("Có lỗi xảy ra. Vui lòng thử lại");
			return;
		}

		checkCodeConfirm({
			variables: {
				code: parseInt(codeInput),
				phone: parseInt(phoneInput),
			},
		});
	};

	if (!!props.infos) {
		props.navigation.navigate("Explore");
		return <AppLoading />;
	} else {
		return (
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={styles.scrollview}
			>
				<Spinner visible={loadingCheckPhone} />
				<View style={{ ...styles.container }}>
					{getEnterCodeScreen == false && (
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
								Quên mật khẩu
							</Text>

							<Text style={[styles.textBlackSize14]}>
								Số điện thoại
							</Text>
							<TextInput
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

							<View
								style={{
									flexDirection: "row",
									marginTop: 24,
								}}
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
											Gửi mã xác nhận
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
										Quay về
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					)}
					{getEnterCodeScreen == true && (
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
								Nhập mã xác nhận
							</Text>

							<Text style={[styles.textBlackSize14]}>
								Mã xác nhận
							</Text>
							<TextInput
								maxLength={6}
								value={codeInput}
								autoCapitalize="none"
								underlineColorAndroid="#00000000"
								returnKeyType={"next"}
								onSubmitEditing={() => {}}
								style={styles.customEditText}
								clearButtonMode="while-editing"
								enablesReturnKeyAutomatically={true}
								blurOnSubmit={false}
								placeholder={"Nhập mã xác nhận"}
								onChangeText={(text) => setCodeInput(text)}
								keyboardType="numeric"
							/>

							<View
								style={{
									flexDirection: "row",
									marginTop: 24,
								}}
							>
								<TouchableOpacity
									style={styles.buttonBackgroundBlue}
									activeOpacity={0.5}
									onPress={() => checkCode()}
								>
									<View style={{ padding: 10 }}>
										<Text
											style={[
												styles.textWhite,
												{ fontSize: 16 },
											]}
										>
											Tiếp tục
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
					)}
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
	return { infos: state.infos, token: state.token };
}

export default connect(mapStateToProps, null)(ForgetPasswordScreen);
