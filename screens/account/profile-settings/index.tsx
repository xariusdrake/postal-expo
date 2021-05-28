import React, { useState, useEffect } from "react";
import {
	ScrollView,
	View,
	SafeAreaView,
	TouchableOpacity,
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
	Avatar,
	RadioGroup,
	Radio,
} from "@ui-kitten/components";

// import { ProfileSetting } from "./extra/profile-setting.component";
// import { ProfileAvatar } from "./extra/profile-avatar.component";
// import { CameraIcon } from "./extra/icons";
// import { Profile } from "./extra/data";

import { connect } from "react-redux";

import appConfigs from "../../../config";

import { MUTATION_UPDATE_PROFILE_DETAIL } from "../../../graphql/query";
import { useMutation } from "@apollo/client";

import Spinner from "react-native-loading-spinner-overlay";

import {
	isEmpty,
	isMin,
	isMax,
	allLetter,
	allNumeric,
} from "../../../functions/strings";
import { saveUserdata } from "../../../functions/helpers";

import DatePicker from "react-native-datepicker";
const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const CalendarIcon = (props) => <Icon {...props} name="calendar" />;

function EditProfileScreen(props) {
	const [
		updateInfo,
		{
			error: errorInfo,
			called: calledInfo,
			loading: loadingInfo,
			data: dataInfo,
		},
	] = useMutation(MUTATION_UPDATE_PROFILE_DETAIL, {
		onCompleted: (dataInfo) => {
			console.log("onCompleted");
			console.log(44, dataInfo);

			setLoading(false);

			if (isEmpty(dataInfo.update_users.returning[0]) == true) {
				console.log("false");

				setTimeout(() => {
					Alert.alert("Có lỗi xảy ra. Vui lòng thử lại sau");
				}, 800);
			} else {
				saveUserdata(dataInfo.update_users.returning[0], props);
				setTimeout(() => {
					Alert.alert("Đã lưu");
				}, 800);
			}
		},
		onError: (errorInfo) => {
			Alert.alert("Có lỗi xảy ra!");
			console.log("onError");
			console.log(errorInfo);
		},
	});

	const [fullnameInput, setFullnameInput] = useState("");
	const [idNationInput, setIdNationInput] = useState("");
	const [genderInput, setGenderInput] = useState("");
	const [birthdayInput, setBirthdayInput] = useState("");
	const [addressInput, setAddressInput] = useState("");

	const [date, setDate] = useState(new Date());
	const [selectedIndex, setSelectedIndex] = useState(null);

	const [loading, setLoading] = useState(false);

	const styles = useStyleSheet(themedStyles);

	useEffect(() => {
		setFullnameInput(props.infos.fullname);
		setGenderInput(props.infos.gender);
		setSelectedIndex(props.infos.gender - 1);
		setBirthdayInput(props.infos.birthday);
		setIdNationInput(props.infos.nation_id);
		setAddressInput(props.infos.address);
	}, []);

	function onSelectGender(index) {
		// if (index != 0 && index != 1) return false

		setSelectedIndex(index);
		setGenderInput(index + 1);
	}

	const onClickSubmit = async () => {
		if (!fullnameInput.trim()) {
			Alert.alert("Vui lòng nhập họ tên");
			return;
		} else if (allLetter(fullnameInput) == false) {
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
		} else if (
			idNationInput.length > 0 &&
			allNumeric(idNationInput) == false
		) {
			Alert.alert("Số CMT/CCCD chỉ bao gồm số");
			return;
		} else if (parseInt(genderInput) != 1 && parseInt(genderInput) != 2) {
			console.log("genderInput: ", genderInput);
			Alert.alert("Giới tính không hợp lệ. Vui lòng thử lại");
			return;

			// } else if (!birthdayInput.trim()) {
			// 	Alert.alert("Vui lòng nhập sinh nhật");
			// 	return;
		}

		// else if (isMax(addressInput, appConfigs.VALIDATE.USER.MAX_ADDRESS)) {
		// 	Alert.alert(
		// 		"Địa chỉ tối đa " +
		// 			appConfigs.VALIDATE.USER.MAX_ADDRESS +
		// 			" ký tự"
		// 	);
		// 	return;
		// }

		console.log("gender: " + genderInput);
		console.log("birthdayInput: " + birthdayInput);
		setLoading(true);

		let valueGender = parseInt(genderInput) + 1;

		updateInfo({
			variables: {
				id: props.infos.id,
				fullname: fullnameInput,
				gender: genderInput,
				birthday: birthdayInput,
				nation_id: idNationInput,
				address: addressInput,
			},
		});
	};

	// const renderPhotoButton = () => (
	// 	<Button
	// 		style={styles.photoButton}
	// 		size="small"
	// 		status="basic"
	// 		icon={CameraIcon}
	// 	/>
	// );

	const renderBackAction = () => (
		<TopNavigationAction
			icon={BackIcon}
			onPress={() => props.navigation.navigate("More")}
		/>
	);

	return (
		<SafeAreaView style={{ paddingTop: 20 }}>
			<Spinner visible={loadingInfo} />
			<TopNavigation
				alignment="center"
				title="Chỉnh sửa tài khoản"
				accessoryLeft={renderBackAction}
				// accessoryRight={renderRightActions}
			/>
			<Divider />
			<Spinner visible={loadingInfo} />
			{/*<Layout style={styles.photoSection} level="1">
				<ProfileAvatar
					style={styles.photo}
					source={profile.photo}
					editButton={renderPhotoButton}
				/>
				<View style={styles.nameSection}>
					<ProfileSetting
						style={styles.setting}
						value={profile.firstName}
					/>
					<ProfileSetting
						style={styles.setting}
						value={profile.lastName}
					/>
				</View>
			</Layout>*/}
			{/*
			<Text style={styles.description} appearance="hint">
					{profile.description}
				</Text>
			*/}

			<View style={[themedStyles.formContainer]}>
				{/*<Avatar
					style={[styles.profileAvatar, styles.avatar]}
					source={profile.photo}
				/>*/}
				<Input
					placeholder="Nhập họ và tên"
					label="Họ và tên"
					autoCapitalize="words"
					value={fullnameInput}
					onChangeText={(text) => setFullnameInput(text)}
					style={{ paddingBottom: 15 }}
				/>

				<Text category="s2" style={{ paddingBottom: 10 }}>
					Ngày sinh
				</Text>
				<View
					style={{
						borderRadius: 6,
						borderColor: "rgb(131, 131, 131)",
						overflow: "hidden",
					}}
				>
					<DatePicker
						locale={"vi"}
						style={{ width: "100%" }}
						date={birthdayInput} //initial date from state
						mode="date" //The enum of date, datetime and time
						placeholder="Chọn ngày tháng năm sinh"
						format="DD-MM-YYYY"
						minDate="01-01-1920"
						maxDate="01-01-2022"
						confirmBtnText="Chọn"
						cancelBtnText="Đóng"
						showIcon={false}
						onDateChange={(birthdayInput) => {
							setBirthdayInput(birthdayInput);
						}}
					/>
				</View>

				<Input
					placeholder=""
					label="Số CMT/CCCD"
					autoCapitalize="words"
					value={idNationInput}
					onChangeText={(text) => setIdNationInput(text)}
					style={{ paddingTop: 15, paddingBottom: 5 }}
					keyboardType="numeric"
				/>
				<Layout style={styles.containerRadio} level="1">
					<RadioGroup
						selectedIndex={selectedIndex}
						onChange={(index) => onSelectGender(index)}
					>
						<Radio value="1">Nam</Radio>
						<Radio value="2">Nữ</Radio>
					</RadioGroup>
				</Layout>

				<Input
					placeholder=""
					label="Địa chỉ"
					autoCapitalize="words"
					value={addressInput}
					onChangeText={(text) => setAddressInput(text)}
					style={{ paddingVertical: 5 }}
				/>

				<Button
					style={styles.doneButton}
					onPress={() => onClickSubmit()}
					status="info"
				>
					Lưu
				</Button>
			</View>
		</SafeAreaView>
	);
}

const themedStyles = StyleService.create({
	container: {
		flex: 1,
		backgroundColor: "background-basic-color-2",
	},
	containerRadio: {
		flexDirection: "row",
		flexWrap: "wrap",
		paddingBottom: 10,
	},
	containerInput: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	formContainer: {
		padding: 20,
		backgroundColor: "#fff",
		height: Dimensions.get("window").height,
	},
	contentContainer: {
		paddingBottom: 24,
	},
	photoSection: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
	},
	radio: {
		margin: 2,
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
		// marginHorizontal: 24,
		marginTop: 15,
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
export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);
