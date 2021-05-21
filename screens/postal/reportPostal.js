import React, { useState, useEffect } from "react";
import {
	ImageBackground,
	Platform,
	View,
	SafeAreaView,
	StyleSheet,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	Alert,
	Keyboard,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
} from "react-native";
import { connect } from "react-redux";

import {
	Input,
	Select,
	SelectItem,
	IndexPath,
	Layout,
	StyleService,
	Text,
	useStyleSheet,
	TopNavigation,
	TopNavigationAction,
	Divider,
	Icon,
	Button,
} from "@ui-kitten/components";

import Spinner from "react-native-loading-spinner-overlay";

import appConfigs from "../../config";
import { isEmpty, isMin, isMax } from "../../functions/strings";

import { useMutation } from "@apollo/client";

import { MUTATION_CREATE_REPORT_POSTAL } from "../../graphql/query";

const listTypeReport = [
	{
		value: 1,
		name: "Địa điểm không tồn tại",
	},
	{
		value: 2,
		name: "Địa điểm đã đóng cửa",
	},
];

function ReportPostalScreen(props) {
	const [
		createReportPostal,
		{ loading: loadingReport, error: errorReport, data: dataReport },
	] = useMutation(MUTATION_CREATE_REPORT_POSTAL, {
		fetchPolicy: "no-cache",
		onCompleted: (dataReport) => {
			console.log(62, dataReport);

			if (!!dataReport.insert_postal_reports.returning[0].id) {
				props.navigation.goBack();
				setTimeout(function () {
					Alert.alert("Báo cáo đã được gửi");
				}, 1200);

				return;
			} else {
				Alert.alert("Có lỗi xảy ra. Vui lòng thử lại!");
			}
		},
		onError: (errorReport) => {
			console.log("onError");
			console.log(errorReport);
		},
	});

	let response = props.route.params;

	const styles = useStyleSheet(themedStyles);

	const [messageInput, setMessageInput] = useState("");
	const [typeInput, setTypeInput] = useState(new IndexPath(null));
	const [nameType, setNameType] = useState("Chọn loại báo cáo");

	useEffect(() => {
		(async () => {
			if (!props.infos.id) {
				props.navigation.navigate("SignIn");
				return;
			}

			// if (response.postal.type == 99) {
			// 	if (response.postal.lat > 0) {
			// 		setLatitude(Number(response.postal.lat));
			// 		setLongtitude(Number(response.postal.lng));
			// 	}
			// } else {
			// 	attemptGeocodeAsync();
			// }
		})();
	}, []);

	const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

	const renderBackAction = () => (
		<TopNavigationAction
			icon={BackIcon}
			onPress={() => props.navigation.goBack()}
		/>
	);

	function onClickCreate() {
		if (parseInt(typeInput.row) != 0 && parseInt(typeInput.row) != 1) {
			Alert.alert("Vui lòng chọn loại báo cáo");
		} else if (
			isMax(messageInput, appConfigs.VALIDATE.POSTAL_REPORT.MAX_MESSAGE)
		) {
			Alert.alert(
				"Nội dung lời nhắn, tối đa " +
					appConfigs.VALIDATE.POSTAL_REPORT.MAX_MESSAGE +
					" ký tự"
			);
		}

		createReportPostal({
			variables: {
				postal_id: response.postal.id,
				type: parseInt(typeInput.row + 1),
				message: messageInput,
				uid: props.infos.id,
			},
		});
	}

	return (
		<SafeAreaView
			style={{
				backgroundColor: "#fff",
				height: Dimensions.get("window").height,
				paddingTop: Platform.OS === "android" ? 25 : 0,
			}}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.container}
			>
				<ScrollView showsVerticalScrollIndicator={false}>
					<TouchableWithoutFeedback
						onPress={Keyboard.dismiss}
						style={{ width: "100%" }}
					>
						<View>
							<TopNavigation
								alignment="center"
								title="Báo cáo"
								accessoryLeft={renderBackAction}
							/>
							<Divider />
							<Spinner visible={loadingReport} />
							<View
								style={{
									paddingVertical: 20,
									paddingHorizontal: 20,
								}}
							>
								<Text
									category="h6"
									style={{ paddingBottom: 20 }}
								>
									Báo cáo {response.postal.name}
								</Text>
								<Text
									style={{
										marginTop: 5,
										paddingTop: 6,
										paddingBottom: 8,
									}}
								>
									Loại báo cáo
								</Text>
								<Select
									placeholder="Chọn loại báo cáo"
									value={nameType}
									selectedIndex={typeInput}
									onSelect={(index) => {
										setNameType(
											listTypeReport[index.row]["name"]
										);
										setTypeInput(new IndexPath(index.row));
									}}
								>
									{listTypeReport.map((type) => (
										<SelectItem title={type.name} />
									))}
								</Select>
								<Text
									style={{
										marginTop: 5,
										paddingTop: 6,
										paddingBottom: 8,
									}}
								>
									Nội dung báo cáo
								</Text>
								<Input
									multiline={true}
									textStyle={{ minHeight: 64 }}
									// placeholder="Nội dung báo cáo"
									value={messageInput}
									onChangeText={(text) =>
										setMessageInput(text)
									}
								/>

								<Button
									style={{
										marginTop: 15,
									}}
									onPress={() => onClickCreate()}
								>
									Gửi báo cáo
								</Button>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const themedStyles = StyleService.create({
	container: {
		flex: 1,
		flexDirection: "column",
	},
	header: {
		flexDirection: "row",
		paddingHorizontal: 8,
		paddingTop: 16,
		paddingBottom: 7,
	},
});

// function mapDispatchToProps(dispatch) {
// 	return {
// 		storeData: function (token) {
// 			dispatch({ type: "saveToken", token });
// 		},
// 		storeUserInfo: function (infos) {
// 			dispatch({ type: "saveUserInfo", infos });
// 		},
// 	};
// }

function mapStateToProps(state) {
	return { infos: state.infos, token: state.token };
}

export default connect(mapStateToProps, null)(ReportPostalScreen);
