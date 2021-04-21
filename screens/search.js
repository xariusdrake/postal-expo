import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Image,
	View,
	TouchableOpacity,
	ImageBackground,
	TouchableWithoutFeedback,
	Keyboard,
	KeyboardAvoidingView,
	TopNavigation,
	TopNavigationAction,
	Dimensions,
	Alert,
	SafeAreaView,
	Divider,
} from "react-native";
import * as Permissions from "expo-permissions";

import { StatusBar } from "expo-status-bar";
import { BarCodeScanner } from "expo-barcode-scanner";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useQuery, useLazyQuery } from "@apollo/client";
import { QUERY_SEARCH_ALL_POSTAL_PLACE } from "../graphql/query";

import { Text, Input, Button } from "@ui-kitten/components";
import Spinner from "react-native-loading-spinner-overlay";

import { connect } from "react-redux";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

function SearchScreen(props) {
	const [
		searchPostal,
		{
			networkStatus,
			error: errorSearch,
			called: calledSearch,
			loading: loadingSearch,
			data: dataSearch,
		},
	] = useLazyQuery(QUERY_SEARCH_ALL_POSTAL_PLACE, {
		onCompleted: (dataSearch) => {
			console.log("onCompleted");
			console.log(dataSearch);

			if (dataSearch.postals.length === 0) {
				setNoResultFound(true);
			} else {
				setNoResultFound(false);
				navigation.navigate("SearchedResults", {
					placesArray: dataSearch.postals,
				});
			}

			// setAllPostalList(data.postals);
		},
		onError: (errorSearch) => {
			console.log("onError");
			console.log(errorSearch);
		},
	});

	const navigation = useNavigation();

	const [valueSearch, setValueSearch] = useState("");
	const [loader, setLoader] = useState(false);
	const [noResultFound, setNoResultFound] = useState(false);

	async function findProducts() {
		console.log(73, valueSearch);

		if (valueSearch != "") {
			searchPostal({ variables: { name: "%" + valueSearch + "%" } });

			// HTTPRequest.post({
			// 	url: "/",
			// 	data: {
			// 		query: QUERY_SEARCH_ALL_POSTAL_PLACE,
			// 		variables: {
			// 			name: "%" + keyProducts + "%",
			// 		},
			// 		operationName: "Mobile_SearchAllPostalPlace",
			// 	},
			// })
			// 	.then((response) => {
			// 		// setScanMode(false);
			// 		console.log(102, response.data.data.postals);

			// 		if (response.data.data.postals.length === 0) {
			// 			setNoResultFound(true);
			// 		} else {
			// 			setNoResultFound(false);
			// 			navigation.navigate("SearchedResults", {
			// 				placesArray: response.data.data.postals,
			// 			});
			// 		}
			// 	})
			// 	.catch((error) => {})
			// 	.finally(() => {});
		}
	}

	const renderBackAction = () => (
		<TopNavigationAction
			icon={BackIcon}
			onPress={() => props.navigation.goBack()}
		/>
	);

	async function onEnterSearch() {
		console.log(73, valueSearch);

		if (valueSearch != "") {
			searchPostal({ variables: { name: "%" + valueSearch + "%" } });

			// HTTPRequest.post({
			// 	url: "/",
			// 	data: {
			// 		query: QUERY_SEARCH_ALL_POSTAL_PLACE,
			// 		variables: {
			// 			name: "%" + keyProducts + "%",
			// 		},
			// 		operationName: "Mobile_SearchAllPostalPlace",
			// 	},
			// })
			// 	.then((response) => {
			// 		// setScanMode(false);
			// 		console.log(102, response.data.data.postals);

			// 		if (response.data.data.postals.length === 0) {
			// 			setNoResultFound(true);
			// 		} else {
			// 			setNoResultFound(false);
			// 			navigation.navigate("SearchedResults", {
			// 				placesArray: response.data.data.postals,
			// 			});
			// 		}
			// 	})
			// 	.catch((error) => {})
			// 	.finally(() => {});
		}
	}

	return (
		<SafeAreaView style={{ paddingTop: 20 }}>
			<TopNavigation
				alignment="center"
				title="Tìm kiếm"
				accessoryLeft={renderBackAction}
				// accessoryRight={renderRightActions}
			/>
			<Divider />
			<Input
				placeholder="Place your Text"
				// value={value}
				// onChangeText={nextValue => setValue(nextValue)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
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

// function mapStateToProps(state) {
// 	return { infos: state.info, USER_INFO: state.info, token: state.token };
// }

function mapStateToProps(state) {
	return { infos: state.infos, token: state.token };
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
