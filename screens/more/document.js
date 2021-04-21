import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Image,
	ImageBackground,
	TouchableOpacity,
	ScrollView,
	SafeAreaView,
	Dimensions
} from "react-native";
import { connect } from "react-redux";

import {
	Text,
	Icon,
	Layout,
	MenuItem,
	OverflowMenu,
	TopNavigation,
	TopNavigationAction,
	Divider,
} from "@ui-kitten/components";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

function IntroModalScreen(props) {
	console.log("info user");
	console.log(props.info);

	const renderBackAction = () => (
		<TopNavigationAction
			icon={BackIcon}
			onPress={() => props.navigation.goBack()}
		/>
	);

	return (
		<SafeAreaView>
			{props.no_header != true && (
				<React.Fragment>
					<TopNavigation
						alignment="center"
						title="Văn bản"
						accessoryLeft={renderBackAction}
						// accessoryRight={renderRightActions}
					/>

					<Divider />
				</React.Fragment>
			)}
			<View style={{ backgroundColor: "#fff" }}>
				<View style={{ alignSelf: "flex-start", padding: 10 }}>
					<Text style={styles.description}>
						VĂN BẢN QUY PHẠM PHÁP LUẬT LIÊN QUAN ĐẾN MÃ BƯU CHÍNH
						QUỐC GIA
					</Text>
					<Image
						style={{ height: 300, width: Dimensions.get("window").width }}
						source={require("../../assets/images/document.png")}
						resizeMode="contain"
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}

// colors vars
var blueDark = "#033C47";
var mintLight = "#D5EFE8";
var mint = "#2DB08C";
var grayMedium = "#879299";
var graySuperLight = "#f4f4f4";
var greyLight = "#d8d8d8";
var gold = "#E8BA00";
var goldLight = "#faf1cb";
var tomato = "#ec333b";
var peach = "#ef7e67";
var peachLight = "#FED4CB";

// STYLES
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
		backgroundColor: "#fff",
	},
	head: {
		backgroundColor: "#fff",
		width: "100%",
		marginTop: 50,
		marginBottom: 0,
		paddingHorizontal: 25,
		paddingVertical: 10,
		margin: 0,
		borderBottomColor: grayMedium,
		borderBottomWidth: 1,
		height: 50,
		// position: "absolute",
	},
	row: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
		paddingHorizontal: 25,
	},
	placeheader: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
		backgroundColor: goldLight,
		paddingBottom: 16,
		paddingHorizontal: 0,
		paddingTop: 60,
		width: "100%",
		marginTop: 0,
		zIndex: -2,
	},
	current: {
		fontSize: 16,
		color: blueDark,
		textAlign: "left",
		lineHeight: 26,
	},
	currentBold: {
		fontSize: 16,
		color: blueDark,
		textAlign: "left",
		lineHeight: 26,
		fontWeight: "bold",
	},
	line: {
		flex: 0.4,
		borderWidth: 1,
		borderColor: greyLight,
		marginHorizontal: 0,
		marginVertical: 30,
	},
	h3mint: {
		fontSize: 18,
		color: mint,
		letterSpacing: -0.7,
	},
	bigprice: {
		fontSize: 40,
		color: blueDark,
		letterSpacing: -0.7,
	},
	bigco2: {
		fontSize: 28,
		color: blueDark,
		letterSpacing: -0.7,
	},
	h2mint: {
		fontSize: 22,
		color: mint,
		letterSpacing: -0.7,
	},
	h4mint: {
		fontSize: 14,
		color: mint,
		letterSpacing: -0.7,
	},
	h1blueDark: {
		fontSize: 26,
		color: blueDark,
		letterSpacing: -0.7,
	},
});

function mapStateToProps(state) {
	return { infos: state.infos };
}

// keep this line at the end
export default connect(mapStateToProps, null)(IntroModalScreen);
