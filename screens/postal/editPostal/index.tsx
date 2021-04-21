import React, { useState, useEffect } from "react";
import {
	ScrollView,
	View,
	SafeAreaView,
	TouchableOpacity,
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
	OverflowMenu,
	MenuItem,
	Divider,
	Avatar,
} from "@ui-kitten/components";
import { ProfileSetting } from "./extra/profile-setting.component";
import { ProfileAvatar } from "./extra/profile-avatar.component";
import { CameraIcon } from "./extra/icons";
import { Profile } from "./extra/data";

import { connect } from "react-redux";

import {
	QUERY_GET_POSTAL,
	MUTATION_UPDATE_POSTAL,
} from "../../../graphql/query";

import { useMutation, useLazyQuery } from "@apollo/client";
import { isEmpty, isMin } from "../../../functions/strings";
import Spinner from "react-native-loading-spinner-overlay";

const profile: Profile = Profile.jenniferGreen();

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const MenuIcon = (props) => <Icon {...props} name="more-vertical" />;

const InfoIcon = (props) => <Icon {...props} name="info" />;

const LogoutIcon = (props) => <Icon {...props} name="log-out" />;

function EditPostalScreen(props) {
	const [
		getPostal,
		{
			error: errorGet,
			called: calledGet,
			loading: loadingGet,
			data: dataGet,
		},
	] = useLazyQuery(QUERY_GET_POSTAL, {
		onCompleted: (dataGet) => {
			setLoading(false);
			console.log("dataGet");
			console.log(dataGet);
			console.log(dataGet.postals[0]);

			setNameInput(dataGet.postals[0].name);
			setPhoneInput(dataGet.postals[0].phone);
		},
		onError: (errorGet) => {
			console.log("onError");
			console.log(errorPostal);
		},
	});

	const [
		updatePostal,
		{
			error: errorUpdate,
			called: calledUpdate,
			loading: loadingUpdate,
			data: dataUpdate,
		},
	] = useMutation(MUTATION_UPDATE_POSTAL, {
		onCompleted: (dataUpdate) => {
			console.log("dataUpdate");
			console.log(dataUpdate);
		},
		onError: (errorPostal) => {},
	});

	const [nameInput, setNameInput] = useState("");
	const [dataPostalResponse, setDataPostal] = useState({});

	const [loading, setLoading] = useState(false);
	const [menuVisible, setMenuVisible] = useState(false);

	const styles = useStyleSheet(themedStyles);

	var postalId = props.route.params.postal.id;

	// console.log(300, props.token);
	// console.log(311, props.infos);

	useEffect(() => {
		setLoading(true);

		getPostal({ variables: { id: postalId } });
		// setFullnameInput(props.infos.fullname);
		// setPhoneInput(props.infos.phone);
		// setAddressInput(props.infos.address);

		// const getPostals = async () => {
		// 	var allPostals = await getListPostal();
		// };
	}, []);

	let userData;

	const saveUserPostal = async () => {
		// if (isEmpty(dataPostal.update_users.returning[0]) == true) {
		setLoading(false);
		// 	Alert.alert("Có lỗi xãy ra");
		// 	return;
		// }
		// if (dataPostal) {
		// if (dataPostal.update_users.returning[0].id) {
		// userData = dataPostal
		// props.storeUserPostal();
		console.log(85, dataPostalResponse);
		// } else {
		// }
		// } else {
		// 	console.log("sucess graphql but not right response");
		// }
	};

	const onClickSubmit = async () => {
		console.log(100, "onClickSubmit");

		setLoading(true);

		updatePostal({
			variables: {
				id: props.infos.id,
				fullname: fullnameInput,
				phone: phoneInput.toString(),
				address: addressInput,
			},
		});
	};

	const onClickDeleteModal = async () => {

		console.log('onClickDeleteModal')

		Alert.alert(
			"Xoá địa điểm",
			"My Alert Msg",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel",
				},
				{ text: "OK", onPress: () => console.log("OK Pressed") },
			],
			{ cancelable: false }
		);
	};

	const renderPhotoButton = () => (
		<Button
			style={styles.photoButton}
			size="small"
			status="basic"
			icon={CameraIcon}
		/>
	);

	const renderBackAction = () => (
		<TopNavigationAction
			icon={BackIcon}
			onPress={() => props.navigation.navigate("MyPostal")}
		/>
	);

	const toggleMenu = () => {
		setMenuVisible(!menuVisible);
	};

	const renderMenuAction = () => (
		<TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
	);

	const renderRightActions = () => (
		<React.Fragment>
			<OverflowMenu
				anchor={renderMenuAction}
				visible={menuVisible}
				onBackdropPress={toggleMenu}
			>
				<MenuItem accessoryLeft={InfoIcon} title="Xoá" onSelect={index => onClickDeleteModal}/>
			</OverflowMenu>
		</React.Fragment>
	);

	return (
		<SafeAreaView style={{ paddingTop: 20 }}>
			{/*<Spinner visible={loading} />*/}
			<TopNavigation
				alignment="center"
				title="Chỉnh sửa"
				accessoryLeft={renderBackAction}
				accessoryRight={renderRightActions}
			/>
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
					placeholder=""
					label="Tên địa điểm"
					autoCapitalize="words"
					value={nameInput}
					onChangeText={(text) => setNameInput(text)}
				/>
			</View>
			<Button style={styles.doneButton} onPress={() => onClickSubmit()}>
				Lưu
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
		marginTop: 24,
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
		storeUserPostal: function (infos) {
			dispatch({ type: "saveUserPostal", infos });
		},
	};
}

// function mapStateToProps(state) {
// 	return { infos: state.info, USER_INFO: state.info, token: state.token };
// }

function mapStateToProps(state) {
	return { infos: state.infos, token: state.token };
}
export default connect(mapStateToProps, mapDispatchToProps)(EditPostalScreen);
