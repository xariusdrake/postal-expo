import React, { useState, useEffect } from "react";
import { Animated, Image, SafeAreaView, View, Alert } from "react-native";
import { connect } from "react-redux";

import {
	Text,
	Icon,
	TopNavigation,
	TopNavigationAction,
	Divider,
	Input,
} from "@ui-kitten/components";
import styles, {
	ACTIVE_CELL_BG_COLOR,
	CELL_BORDER_RADIUS,
	CELL_SIZE,
	DEFAULT_CELL_BG_COLOR,
	NOT_EMPTY_CELL_BG_COLOR,
} from "./styles";

import { TouchableOpacity } from "react-native-gesture-handler";
import Spinner from "react-native-loading-spinner-overlay";

import PhoneInput from "react-native-phone-number-input";

import { isEmpty, isMin, isPhoneNumber } from "../../../functions/strings";
import { saveUserdata, directForNonAuth } from "../../../functions/helpers.js";
import appConfigs from "../../../config";

import { useMutation, useLazyQuery } from "@apollo/client";
import {
	MUTATION_CHANGE_PHONE_NUMBER,
	QUERY_CHECK_PHONE,
} from "../../../graphql/query";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

function ChangePhoneNumberScreen(props) {
	const [
		checkPhone,
		{
			error: errorCheckPhone,
			// called: calledChange,
			// loading: loadingChange,
			data: dataCheckPhone,
		},
	] = useLazyQuery(QUERY_CHECK_PHONE, {
		fetchPolicy: "no-cache",
		onCompleted: (dataCheckPhone) => {
			console.log("onCompleted");

			console.log(44, dataCheckPhone);

			if (isEmpty(dataCheckPhone.users[0]) == false) {
				setLoading(false);

				setTimeout(() => {
					Alert.alert(
						"Số điện thoại đã được tài khoản khác đăng ký."
					);
				}, 800);
			} else {
				changePhoneNumber({
					variables: {
						uid: props.infos.id,
						phone: phoneInput,
					},
				});
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
	const [
		changePhoneNumber,
		{
			error: errorChange,
			called: calledChange,
			loading: loadingChange,
			data: dataChange,
		},
	] = useMutation(MUTATION_CHANGE_PHONE_NUMBER, {
		onCompleted: (dataChange) => {
			console.log("onCompleted");
			setLoading(false);
			console.log(44, dataChange);

			if (isEmpty(dataChange.update_users.returning[0]) == true) {
				console.log("false");

				setTimeout(() => {
					Alert.alert("Có lỗi xảy ra. Vui lòng thử lại sau");
				}, 800);
			} else {
				saveUserdata(dataChange.update_users.returning[0], props);

				props.navigation.navigate("More");
				setTimeout(() => {
					Alert.alert("Số điện thoại đã được thay đổi");
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

	const [phoneInput, setPhoneInput] = useState("");
	const [formattedValue, setFormattedValue] = useState("");
	const [loading, setLoading] = useState(false);

	const renderBackAction = () => (
		<TopNavigationAction
			icon={BackIcon}
			onPress={() => props.navigation.navigate("More")}
		/>
	);

	const onClickSubmit = async () => {
		if (phoneInput.length < 1) {
			Alert.alert("Vui lòng nhập số điện thoại!");
			return;
		} else if (isPhoneNumber(phoneInput) == false) {
			Alert.alert("Số điện thoại không hợp lệ");
			return;
		} else if (phoneInput == props.infos.phone) {
			Alert.alert("Đây là số điện thoại hiện của bạn");
			return;
		}

		checkPhone({
			variables: {
				// uid: props.infos.id,
				phone: phoneInput,
			},
		});
	};

	useEffect(() => {
		directForNonAuth(props);
	});

	return (
		<SafeAreaView style={styles.root}>
			<TopNavigation
				alignment="center"
				title="Thay đổi số điện thoại"
				accessoryLeft={renderBackAction}
			/>
			<Divider />
			<Spinner visible={loadingChange} />
			<View
				style={{
					marginHorizontal: 40,
					marginTop: 70,
					textAlign: "center",
				}}
			>
				<Image
					style={{
						marginLeft: "auto",
						marginRight: "auto",
						width: 217 / 1.5,
						height: 158 / 1.5,
					}}
					source={{
						uri:
							"https://cdn.dribbble.com/users/722246/screenshots/11122735/media/1eb311d39402bd24e761ccfaacbbaf72.gif",
					}}
				/>
				<Text style={[styles.subTitle, { paddingBottom: 20 }]}>
					Nhập số điện thoại của bạn
				</Text>
				{/*<PhoneInput
					disableArrowIcon={true}
					defaultValue={phoneInput}
					defaultCode="VN"
					layout="first"
					withShadow
					// autoFocus
					placeholder="Nhập số điện thoại"
					onChangeText={(text) => setPhoneInput(text)}
					onChangeFormattedText={(text) => {
						setFormattedValue(text);
					}}
				/>*/}
				<Input
					keyboardType="number-pad"
					style={{
						width: 300,
						textAlign: "center",
						justifyContent: "center",
						alignItems: "center",
						alignSelf: "center",
					}}
					maxLength={11}
					onChangeText={(text) => setPhoneInput(text)}
				/>

				<TouchableOpacity onPress={() => onClickSubmit()}>
					<View style={styles.nextButton}>
						<Text style={styles.nextButtonText}>Tiếp tục</Text>
					</View>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

function mapDispatchToProps(dispatch) {
	return {
		storeUserInfo: function (infos) {
			dispatch({ type: "saveUserInfo", infos });
		},
	};
}

function mapStateToProps(state) {
	return { infos: state.infos, token: state.token };
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChangePhoneNumberScreen);
