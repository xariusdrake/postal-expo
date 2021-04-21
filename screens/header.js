import * as React from "react";

import {
	Container,
	Text,
	Header,
	Footer,
	Left,
	Body,
	FooterTab,
	Tabs,
	Tab,
} from "native-base";

import {
	SafeAreaView,
	// TouchableOpacity,
	TextInput,
	PermissionsAndroid,
	StyleSheet,
	ImageBackground,
	Dimensions,
	Image,
	View,
	Alert,
	Platform,
	Linking,
} from "react-native";

const imgBackground = require("../assets/background/img.jpg");
const logoTop = require("../assets/logo/quochuy.png");
const flagVietNam = require("../assets/logo/vietnam-flag.png");
const flagEnglish = require("../assets/logo/english-flag.png");

export default class HeaderComponent extends React.Component {
	render() {
		return (
			<React.Fragment>
				<ImageBackground
					source={imgBackground}
					style={styles.imgBackgroundHeader}
				>
					<Header transparent hasTabs style={styles.header}>
						<Left style={styles.hleft1}>
							<Image
								source={logoTop}
								style={styles.logoTop}
							></Image>
						</Left>
						<Body style={styles.body1}>
							{/*<View style={styles.bview1}>
								<TouchableOpacity
									onPress={() =>
										Alert.alert("Ngôn ngữ", "English")
									}
								>
									<Image
										source={flagEnglish}
										style={styles.flag}
									></Image>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() =>
										Alert.alert("Ngôn ngữ", "Việt Nam")
									}
								>
									<Image
										source={flagVietNam}
										style={styles.flag}
									></Image>
								</TouchableOpacity>
							</View>*/}

							<View style={styles.btext}>
								<Text style={styles.txth1}>
									ỨNG DỤNG THÔNG TIN ĐIỆN TỬ
								</Text>
							</View>
							<View style={styles.btext}>
								<Text style={styles.txth2}>
									TRA CỨU MÃ BƯU CHÍNH QUỐC GIA
								</Text>
							</View>
						</Body>
					</Header>
				</ImageBackground>
				
				{/*<Tabs>
					<Tab
						heading="Trang chủ"
						activeTextStyle={{
							color: Platform.OS == "ios" ? "black" : "yellow",
							fontWeight: "bold",
						}}
					></Tab>
					<Tab
						heading="Giới thiệu"
						activeTextStyle={{
							color: Platform.OS == "ios" ? "black" : "yellow",
							fontWeight: "bold",
						}}
					></Tab>
					<Tab
						heading="Văn bản"
						activeTextStyle={{
							color: Platform.OS == "ios" ? "black" : "yellow",
							fontWeight: "bold",
						}}
					></Tab>
					<Tab
						heading="Hướng dẫn"
						activeTextStyle={{
							color: Platform.OS == "ios" ? "black" : "yellow",
							fontWeight: "bold",
						}}
					></Tab>
				</Tabs>*/}
			</React.Fragment>
		);
	}
}

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

const styles = StyleSheet.create({
	imgBackgroundHeader: {
		width: null,
	},
	header: {
		height: 100,
		paddingLeft: 0,
		paddingRight: 0,
		backgroundColor: "rgba(0,0,0,0.25)",
	},

	logoTop: {
		width: 60,
		height: 60,
	},
	flag: {
		width: 30,
		height: 20,
		marginLeft: 8,
	},
	hleft1: {
		flex: 0.4,
		height: "100%",
		justifyContent: "center",
		paddingLeft: 2,
		alignItems: "center",
	},
	body1: {
		height: "100%",
		justifyContent: "center",
		paddingLeft: 5,
		paddingRight: 5,
	},
	bview1: {
		flexDirection: "row-reverse",
		width: "100%",
		alignItems: "flex-end",
		paddingRight: 15,
		paddingBottom: 5,
		marginTop: -15,
	},
	txth1: { color: "#ffffff", fontSize: 15, fontWeight: "600", marginTop: 2 },
	txth2: { color: "#ffffff", fontSize: 16, fontWeight: "bold", marginTop: 5 },
	btext: {
		width: "100%",
	},

	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	loadingContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
	},
	modalContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
		backgroundColor: "#fff",
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
	mapStyle: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
	},
	inputBadge: {
		// flexDirection: "row",
		// justifyContent: "flex-start",
		// alignItems: "center",
		// height: 32,
		// width: "100%",
		// // backgroundColor: graySuperLight,
		// borderRadius: 16,
		// borderColor: "#0469c1",
		// // borderWidth: 1,
		// paddingHorizontal: 15,
		// paddingVertical: 0,
		// margin: 10,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		height: 32,
		width: "100%",
		backgroundColor: graySuperLight,
		borderRadius: 16,
		borderColor: grayMedium,
		borderWidth: 1,
		paddingHorizontal: 15,
		paddingVertical: 0,
		margin: 10,
	},
	textBadge: {
		color: grayMedium,
	},

	chatContent: {
		paddingHorizontal: 8,
		paddingVertical: 12,
	},
	messageInputContainer: {
		flexDirection: "row",
		paddingHorizontal: 8,
		paddingVertical: 16,
		// backgroundColor: "background-basic-color-1",
	},
	// attachButton: {
	// 	borderRadius: 24,
	// 	marginHorizontal: 8,
	// },
	messageInput: {
		flex: 1,
		marginHorizontal: 8,
	},
	sendButton: {
		marginRight: 4,
	},
	iconButton: {
		width: 24,
		height: 24,
	},
});
