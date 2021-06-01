import React, { useState, useEffect } from "react";

import {
	StyleSheet,
	View,
	SafeAreaView,
	Dimensions,
	Platform,
	Alert,
} from "react-native";

import { useSubscription, useLazyQuery, gql } from "@apollo/client";
import {
	List,
	ListItem,
	Divider,
	Text,
	Icon,
	Button,
	TopNavigation,
	TopNavigationAction,
} from "@ui-kitten/components";
import Spinner from "react-native-loading-spinner-overlay";

// import { FontAwesome5 } from "@expo/vector-icons";

import { connect } from "react-redux";

import {
	// QUERY_GET_ALL_MY_POSTAL,
	QUERY_GET_INFO_USER,
} from "../../graphql/query";

import { saveUserdata } from "../../functions/helpers";

// const REALTIME_QUERY_GET_ALL_MY_POSTAL = gql`
// 	subscription Mobile_QueryGetInfoUser($uid: Int!) {
// 		users(where: { id: { _eq: $uid } }) {
// 			id
// 			fullname
// 			phone
// 			gender
// 			birthday
// 			address
// 			token
// 			is_actived
// 			is_deleted
// 			postals(where: { is_deleted: { _eq: 0 } }) {
// 				id
// 				name
// 				phone
// 				address
// 				code_area
// 				area_level1_index
// 				area_level2_index
// 				area_level3_index
// 				area_level1_code
// 				area_level2_code
// 				area_level3_code
// 				area_text
// 				image_url
// 				lng
// 				lat
// 				code
// 				phone
// 				region
// 				type
// 				uid
// 				is_approved
// 				is_actived
// 				created_at
// 			}
// 		}
// 	}
// `;

function MyPostalScreen(props) {
	const [
		getInfoUser,
		{ loading: loadingUser, error: errorUser, data: dataUser },
	] = useLazyQuery(QUERY_GET_INFO_USER, {
		fetchPolicy: "no-cache",
		onCompleted: (dataUser) => {
			console.log("xxx onCompleted");
			console.log(62, dataUser);
			console.log(63, dataUser[0]);
			console.log(64, dataUser.users[0].fullname);

			saveUserdata(dataUser.users[0], props);

			// setAllPostalList(data.postals);
		},
		onError: (errorUser) => {
			Alert.alert("Có lỗi xảy ra");
			console.log("onError");
			console.log(errorUser);
		},
	});

	const [myPostalList, saveMyPostalList] = useState({});

	useEffect(() => {
		if (!!props.infos) {
			getInfoUser({ variables: { uid: props.infos.id } });
		}
	}, []);

	const waitingLabel = () => {
		return (
			<Button size="tiny" status="warning">
				Chờ duyệt
			</Button>
		);
	};

	const approvedLabel = () => {
		return (
			<Button size="tiny" status="success">
				Đang hoạt động
			</Button>
		);
	};

	const cancelLabel = () => {
		return (
			<Button size="tiny" status="danger">
				Đã bị từ chối
			</Button>
		);
	};

	const archiveLabel = () => {
		return (
			<Button size="tiny" status="warning">
				Đã gỡ xuống
			</Button>
		);
	};

	const nonActive = () => {
		return (
			<Button size="tiny" status="danger">
				Đã bị khoá
			</Button>
		);
	};

	let labelStatus;

	let renderItem = ({ item, index }) => {
		// console.log("info my item postal");
		// console.log(item);

		if (item.is_actived == 1) {
			if (item.is_approved == 1) {
				labelStatus = waitingLabel;
			} else if (item.is_approved == 2) {
				labelStatus = approvedLabel;
			} else if (item.is_approved == 0) {
				labelStatus = cancelLabel;
			} else {
				labelStatus = "";
			}
		} else if (item.is_actived == -1) {
			labelStatus = archiveLabel;
		} else if (item.is_actived == 0) {
			labelStatus = nonActive;
		}

		return (
			<ListItem
				key={item.id}
				title={item.name}
				description={item.address + ", " + item.area_text}
				onPress={() => {
					// console.log("click move place");

					props.navigation.navigate("Postal", {
						postal: item,
						isUpdate: true,
					});
				}}
				accessoryRight={labelStatus}
			/>
		);
	};

	let uid = props.infos != null ? props.infos.id : null;

	const RefreshIcon = (props) => (
		<Icon
			{...props}
			name="refresh-outline"
			onPress={() => {
				getInfoUser({ variables: { uid: uid } });
			}}
		/>
	);

	const renderRightActions = () => (
		<React.Fragment>
			<TopNavigationAction icon={RefreshIcon} />
		</React.Fragment>
	);

	return (
		<SafeAreaView
			style={{
				height: Dimensions.get("window").height,
				backgroundColor: "#fff",
				paddingTop: Platform.OS === "android" ? 25 : 0,
			}}
		>
			{!props.infos && (
				<View style={{ ...styles.container }}>
					<Text style={styles.title} category="h6">
						Để đăng ký mã bưu chính.{"\n"}Đầu tiên, hãy đăng nhập
					</Text>

					<Button
						size="small"
						appearance="outline"
						status="info"
						onPress={() => {
							props.navigation.navigate("SignIn");
						}}
						style={{ borderColor: "#0469c1", color: "#0469c1" }}
					>
						Đăng nhập
					</Button>
				</View>
			)}

			{!!props.infos && (
				<React.Fragment>
					<TopNavigation
						alignment="center"
						title="Địa điểm của bạn"
						accessoryRight={renderRightActions}
					/>
					<Divider />
					{/*<Spinner visible={loadingUser} />*/}

					{loadingUser == true && (
						<View style={{ ...styles.container }}>
							<Text
								style={[styles.title, { marginTop: -200 }]}
								category="h6"
							>
								Đang cập nhật...
							</Text>
						</View>
					)}

					{loadingUser == false && props.infos.postals.length > 0 && (
						<List
							data={props.infos.postals}
							ItemSeparatorComponent={Divider}
							renderItem={renderItem}
						/>
					)}

					{loadingUser == false && props.infos.postals.length == 0 && (
						<View style={[styles.container]}>
							<Text style={styles.title} category="h6">
								Bạn chưa có địa điểm bưu chính
							</Text>

							<Button
								size="small"
								appearance="outline"
								status="info"
								onPress={() => {
									if (!!props.infos) {
										if (props.infos.is_actived == 1) {
											props.navigation.navigate(
												"CreatePostal",
												{
													isUpdate: false,
												}
											);
										} else if (
											props.infos.is_actived == -1
										) {
											Alert.alert(
												"Tài khoản của bạn đã bị khoá"
											);
										} else if (
											props.infos.is_actived == 0
										) {
											props.navigation.navigate(
												"VerifyPhoneNumber"
											);
											setTimeout(function () {
												Alert.alert(
													"Vui lòng xác nhận tài khoản của bạn để tiếp tục."
												);
											}, 700);
										}
									} else {
										props.navigation.navigate("SignIn");
									}
								}}
							>
								Đăng ký mã bưu chính
							</Button>
						</View>
					)}
				</React.Fragment>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	title: {
		paddingTop: 0,
		padding: 17,
		backgroundColor: "#fff",
		textAlign: "center",
	},

	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: -70,
		// paddingTop: 200,
		// paddingHorizontal: 25,
		// backgroundColor: "#FFFFFF",
	},
	loadingView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "transparent",
	},
	current20: {
		color: "#033C47",
		fontSize: 20,
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

// keep this line at the end
export default connect(mapStateToProps, mapDispatchToProps)(MyPostalScreen);
