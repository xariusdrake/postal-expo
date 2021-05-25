import React, { useState, useEffect } from "react";
import {
	ScrollView,
	View,
	SafeAreaView,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Dimensions,
	Alert,
} from "react-native";
import {
	Button,
	Layout,
	StyleService,
	Text,
	Input,
	Icon,
	useStyleSheet,
	TopNavigation,
	TopNavigationAction,
	Divider,
} from "@ui-kitten/components";

// import { ProfileSetting } from "./extra/profile-setting.component";
// import { ProfileAvatar } from "./extra/profile-avatar.component";
// import { CameraIcon } from "./extra/icons";
// import { Profile } from "./extra/data";

import { connect } from "react-redux";

import { MUTATION_CHANGE_PASSWORD_USER } from "../../graphql/query";

import { useMutation } from "@apollo/client";
import { isEmpty, isMin, isMax, isPassword } from "../../functions/strings";
import Spinner from "react-native-loading-spinner-overlay";

// const profile: Profile = Profile.jenniferGreen();

import appConfigs from "../../config";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

function ChangePasswordScreen(props) {
	const [
		changePassword,
		{
			error: errorChange,
			called: calledChange,
			loading: loadingChange,
			data: dataChange,
		},
	] = useMutation(MUTATION_CHANGE_PASSWORD_USER, {
		onCompleted: (dataChange) => {
			console.log("onCompleted");
			setLoading(false);
			console.log(44, dataChange);

			if (isEmpty(dataChange.update_users.returning[0]) == true) {
				console.log("false");

				setTimeout(() => {
					Alert.alert("Mật khẩu hiện tại không chính xác");
				}, 800);
			} else {
				console.log("success");
				setCurrentPasswordInput("");
				setNewPasswordInput("");
				setReNewPasswordInput("");

				setTimeout(() => {
					Alert.alert("Mật khẩu đã được thay đổi");
				}, 800);
			}
		},
		onError: (errorChange) => {
			console.log("onError");
			setLoading(false);
			setTimeout(function () {
				Alert.alert("Có lỗi xảy ra");
			}, 700);
			console.log(errorChange);
		},
	});

	const [currentPasswordInput, setCurrentPasswordInput] = useState("");
	const [newPasswordInput, setNewPasswordInput] = useState("");
	const [reNewPasswordInput, setReNewPasswordInput] = useState("");
	const [secureTextEntry, setSecureTextEntry] = useState(true);

	const [dataUpdate, setDataUpdate] = useState({});
	const [loading, setLoading] = useState(false);

	const styles = useStyleSheet(themedStyles);

	const onClickSubmit = async () => {
		console.log(100, "onClickSubmit");

		if (currentPasswordInput.length < 1) {
			Alert.alert("Vui lòng nhập mật khẩu hiện tại");
			return;
		}
		if (
			isMin(newPasswordInput, appConfigs.VALIDATE.USER.MIN_PASSWORD) ==
				false ||
			isMax(newPasswordInput, appConfigs.VALIDATE.USER.MAX_PASSWORD) ==
				false
		) {
			Alert.alert(
				"Mật khẩu mới từ " +
					appConfigs.VALIDATE.USER.MIN_PASSWORD +
					" đến " +
					appConfigs.VALIDATE.USER.MAX_PASSWORD +
					" ký tự"
			);
			return;
		} else if (newPasswordInput != reNewPasswordInput) {
			Alert.alert("Mật khẩu mới không giống nhau");
			return;
		}

		setLoading(true);

		changePassword({
			variables: {
				uid: props.infos.id,
				currentPassword: currentPasswordInput.toString(),
				newPassword: newPasswordInput.toString(),
			},
		});
	};

	const renderBackAction = () => (
		<TopNavigationAction
			icon={BackIcon}
			onPress={() => props.navigation.navigate("More")}
		/>
	);

	const toggleSecureEntry = () => {
		setSecureTextEntry(!secureTextEntry);
	};

	const renderIcon = (props) => (
		<TouchableWithoutFeedback onPress={toggleSecureEntry}>
			<Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
		</TouchableWithoutFeedback>
	);

	return (
		<SafeAreaView
			style={{
				paddingTop: 20,
				height: Dimensions.get("window").height,
				backgroundColor: "#fff",
			}}
		>
			<Spinner visible={loadingChange} />
			<TopNavigation
				alignment="center"
				title="Thay đổi mật khẩu"
				accessoryLeft={renderBackAction}
			/>
			<Divider />

			<View style={[themedStyles.formContainer]}>
				<Input
					placeholder=""
					style={{ paddingBottom: 10 }}
					label="Mật khẩu hiện tại"
					autoCapitalize="words"
					value={currentPasswordInput}
					onChangeText={(text) => setCurrentPasswordInput(text)}
					secureTextEntry={true}
				/>
				<Input
					style={{ paddingBottom: 10 }}
					placeholder=""
					label="Mật khẩu mới"
					autoCapitalize="words"
					value={newPasswordInput}
					// caption="Nên ít nhất 8 ký tự"
					onChangeText={(text) => setNewPasswordInput(text)}
					secureTextEntry={true}
					/*accessoryRight={renderIcon}*/
				/>
				<Input
					placeholder=""
					label="Nhập lại mật khẩu mới"
					autoCapitalize="words"
					value={reNewPasswordInput}
					onChangeText={(text) => setReNewPasswordInput(text)}
					secureTextEntry={true}
				/>
			</View>
			<Button style={styles.doneButton} onPress={() => onClickSubmit()}>
				Thay đổi
			</Button>
		</SafeAreaView>
	);
}

const themedStyles = StyleService.create({
	container: {
		flex: 1,
		backgroundColor: "background-basic-color-2",
	},
	containerInput: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	formContainer: {
		padding: 20,
		backgroundColor: "#fff",
	},
	contentContainer: {
		paddingBottom: 24,
	},
	photoSection: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
	},
	avatar: {
		alignSelf: "center",
	},
	profileAvatar: {
		aspectRatio: 1.0,
		height: 124,
		alignSelf: "center",
	},
	photo: {
		aspectRatio: 1.0,
		height: 76,
	},
	photoButton: {
		aspectRatio: 1.0,
		height: 32,
		borderRadius: 16,
	},
	nameSection: {
		flex: 1,
		marginHorizontal: 8,
	},
	description: {
		padding: 24,
		backgroundColor: "background-basic-color-1",
	},
	doneButton: {
		marginHorizontal: 24,
		borderColor: "#0469c1",
		backgroundColor: "#0469c1",
	},
	setting: {
		padding: 16,
	},
	emailSetting: {
		marginTop: 24,
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

// function mapStateToProps(state) {
// 	return { infos: state.info, USER_INFO: state.info, token: state.token };
// }

function mapStateToProps(state) {
	return { infos: state.infos, token: state.token };
}
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChangePasswordScreen);
