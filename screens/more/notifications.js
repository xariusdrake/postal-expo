import React, { useState, useEffect } from "react";

import {
	StyleSheet,
	View,
	SafeAreaView,
	Dimensions,
	Platform,
	Alert,
} from "react-native";

import { useMutation, useLazyQuery, gql } from "@apollo/client";
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

import { connect } from "react-redux";

import {
	QUERY_LIST_NOTIFICATION,
	MUTATION_SEEN_ALL_NOTIFICATION,
} from "../../graphql/query";

function NotificationScreen(props) {
	const [
		getNotification,
		{ loading: loadingNotif, error: errorNotif, data: dataNotif },
	] = useLazyQuery(QUERY_LIST_NOTIFICATION, {
		fetchPolicy: "no-cache",
		onCompleted: (dataNotif) => {
			console.log(36, dataNotif);
			setNotifications(dataNotif.notifications);

			// console.log("xxx onCompleted");
			// console.log(62, dataUser);
			// console.log(63, dataUser[0]);
			// console.log(64, dataUser.users[0].fullname);
			// // console.log(63, dataUser.full);
			// // saveMyPostalList(dataUser.users[0].postals);
			// props.storeUserInfo(dataUser.users[0]);

			// setLoading(false);
		},
		onError: (errorNotif) => {
			setLoading(false);
			setTimeout(function () {
				Alert.alert("Có lỗi xảy ra");
			}, 700);
			console.log("onError");
			console.log(errorNotif);
		},
	});

	const [
		seenNotification,
		{ loading: loadingSeen, error: errorSeen, data: dataSeen },
	] = useMutation(MUTATION_SEEN_ALL_NOTIFICATION, {
		fetchPolicy: "no-cache",
		onCompleted: (dataSeen) => {
			// console.log(36, dataNotif);
			// setNotifications(dataNotif.notifications);
			// console.log("xxx onCompleted");
			// console.log(62, dataUser);
			// console.log(63, dataUser[0]);
			// console.log(64, dataUser.users[0].fullname);
			// // console.log(63, dataUser.full);
			// // saveMyPostalList(dataUser.users[0].postals);
			// props.storeUserInfo(dataUser.users[0]);
			// setLoading(false);
		},
		onError: (errorSeen) => {
			// setLoading(false);
			// setTimeout(function () {
			// 	Alert.alert("Có lỗi xảy ra");
			// }, 700);
			console.log("onError");
			console.log(errorNotif);
		},
	});

	const uid = props.infos.id;

	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!uid) {
			props.navigation.navigate("SignIn");
			return;
		}

		getNotification({ variables: { uid: uid } });
	}, []);

	function converTime(date) {
		var date = new Date(Date.parse(date));

		return date

		// var msPerMinute = 60 * 1000;
		// var msPerHour = msPerMinute * 60;
		// var msPerDay = msPerHour * 24;
		// var msPerMonth = msPerDay * 30;
		// var msPerYear = msPerDay * 365;

		// var elapsed = current - previous;

		// if (elapsed < msPerMinute) {
		// 	return Math.round(elapsed / 1000) + " giây trước";
		// } else if (elapsed < msPerHour) {
		// 	return Math.round(elapsed / msPerMinute) + " phút trước";
		// } else if (elapsed < msPerDay) {
		// 	return Math.round(elapsed / msPerHour) + " giờ trước";
		// } else if (elapsed < msPerMonth) {
		// 	return (
		// 		"approximately " +
		// 		Math.round(elapsed / msPerDay) +
		// 		" ngày trước"
		// 	);
		// } else if (elapsed < msPerYear) {
		// 	return (
		// 		"approximately " +
		// 		Math.round(elapsed / msPerMonth) +
		// 		" months ago"
		// 	);
		// } else {
		// 	return (
		// 		"approximately " +
		// 		Math.round(elapsed / msPerYear) +
		// 		" years ago"
		// 	);
		// }
	}

	let renderItem = ({ item, index }) => {
		return (
			<ListItem
				key={item.id}
				title={item.title}
				description={item.description}
				onPress={() => {
					// // console.log("click move place");
					// props.navigation.navigate("Postal", {
					// 	postal: item,
					// 	isUpdate: true,
					// });
				}}
				// accessoryRight={renderItemAccessory}
			/>
		);
	};

	const RefreshIcon = (props) => (
		<Icon
			{...props}
			name="refresh-outline"
			onPress={() => {
				getNotification({ variables: { uid: uid } });
			}}
		/>
	);

	const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

	const renderBackAction = () => (
		<TopNavigationAction
			icon={BackIcon}
			onPress={() => props.navigation.navigate("More")}
		/>
	);

	const renderRightActions = () => (
		<React.Fragment>
			<TopNavigationAction icon={RefreshIcon} />
		</React.Fragment>
	);

	const renderItemAccessory = () => (
		<React.Fragment>
			<Text>{converTime("2021-05-26T07:41:27.265247+00:00")}</Text>
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
			<TopNavigation
				alignment="center"
				title="Thông báo"
				accessoryLeft={renderBackAction}
				accessoryRight={renderRightActions}
			/>
			<Divider />
			{/*<Spinner visible={loadingNotif} />*/}

			{loadingNotif == true && (
				<View style={{ ...styles.container }}>
					<Text
						style={[styles.title, { marginTop: -200 }]}
						category="h6"
					>
						Đang cập nhật...
					</Text>
				</View>
			)}

			{notifications.length > 0 && loadingNotif == false && (
				<List
					data={notifications}
					ItemSeparatorComponent={Divider}
					renderItem={renderItem}
				/>
			)}

			{/*{notifications.length == 0 && loadingNotif == false && (
				<View style={[styles.container]}>
					<Text style={styles.title} category="h6">
						Bạn chưa có thông báo nào
					</Text>
				</View>
			)}*/}
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
export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen);
