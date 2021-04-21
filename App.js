import React from "react";
import { Footer, FooterTab } from "native-base";

import { Image, View, StyleSheet } from "react-native";

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
// import ExpoCustomUpdater from "expo-custom-updater";

// Navigation
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as Updates from 'expo-updates';

import * as Sentry from "sentry-expo";

import {
	ApplicationProvider,
	IconRegistry,
	Layout,
	Text,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

// icons
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
// import { FontAwesome } from "@expo/vector-icons";
// import { Entypo } from "@expo/vector-icons";

// AUTH
import SignInScreen from "./screens/auth/signIn";
import SignUpScreen from "./screens/auth/signUp";
import ForgetPasswordScreen from "./screens/auth/forgetPassword";

// EXPLORE
import ExploreScreen from "./screens/explore";
// import MapScreen from "./screens/explore/Map";
import SearchExploreScreen from "./screens/explore/search";
import SearchedResultsScreen from "./screens/searchedResults";
import FilterModalScreen from "./screens/explore/filterModalScreen";

// POSTAL
import MyPostalScreen from "./screens/postal/myPostal";
import CreatePostalScreen from "./screens/postal/createPostal";
import CreatePostalLocationScreen from "./screens/postal/createPostalLocation";

// import DetailPostalScreen from "./screens/postal/detailPostal";
import DetailPostalScreen from "./screens/postal/detailPostalX";
import EditPostalScreen from "./screens/postal/editPostal";
import ScanQRScreen from "./screens/postal/scanQR";

// ACCOUNT
import ProfileScreen from "./screens/account";
// import ProfileScreen1 from "./screens/account/profile-settings-1";
import ProfileScreen2 from "./screens/account/profile-settings-2";
import ChangePasswordScreen from "./screens/account/changePassword";
import ChangePhoneNumberScreen from "./screens/account/phoneNumber/changePhoneNumber";
import VerifyPhoneNumberScreen from "./screens/account/phoneNumber/verifyPhoneNumber";

// MORE
// import MoreScreen from "./screens/more";
import MoreScreen from "./screens/more/settings";
import MoreIndexScreen from "./screens/more/indexx";
import IntroModalScreen from "./screens/more/intro";
import DocumentModalScreen from "./screens/more/document";
import GuideModalScreen from "./screens/more/guide";

import appConfigs from "./config";

import * as eva from "@eva-design/eva";

// redux
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import token from "./reducers/token";
import infos from "./reducers/userInfos";
import filter from "./reducers/filter";
import favs from "./reducers/favorites";
const logo = require("./assets/logo/logo.png");

const store = createStore(combineReducers({ token, favs, infos, filter }));

// colors vars
var blueDark = "#033C47";
var mintLight = "#0469c1";

Sentry.init({
	dsn:
		"https://c647846d2e184328a7ab4db946f7e5b6@o512568.ingest.sentry.io/5626788",
	enableInExpoDevelopment: true,
	debug: true,
});

// Sentry.setUser({ mode: "test_for_monday" });

// Sentry.Native.*

// function LogoTitle() {
// 	return (
// 		<View style={{ justifyContent: "center", alignItems: "center" }}>
// 			<Image
// 				style={{ width: 75, height: 26 }}
// 				source={require("./assets/images/logo.png")}
// 			/>
// 		</View>
// 	);
// }

// function FeedAline() {
//   // tip : à l'intérieur d'un header, il faut utiliser useNavigation au lieu de navigate() pour faire un lien
//   // const navigation = useNavigation()
//   return (
//     <Image
//     style={{ width: 34, height: 26 , marginLeft: 22}}
//     source={require('./assets/icons/feedAline.png')}
//   />
//   )
// }

/* #################### Creating a modal stack #################### */
/* use MainStackScreen component as a screen inside RootStackScreen */

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

const client = new ApolloClient({
	uri: appConfigs.API.GRAPHQL.URI,
	cache: new InMemoryCache(),
	headers: {
		"x-hasura-access-key":
			"ptVGMhD6pe8Mnr1pdpDnSqFPX6xvS8uqJMxHXCu2trer4S30i80IuTnu3Ix2s9Qn",
	},
});

// const customUpdater = new ExpoCustomUpdater();

// customUpdater.doUpdateIfAvailable();


function MyTabs() {
	return (
		<React.Fragment>
			<Tab.Navigator
				headerMode="none"
				tabBarOptions={{
					activeTintColor: "#fff",
					inactiveTintColor: "#d9d9d9",
					activeBackgroundColor: mintLight,
					inactiveBackgroundColor: mintLight,
					// safeAreaInset: { bottom: "never", top: "never" },
					style: {
						height: 50,
						backgroundColor: mintLight,
						paddingBottom: 5,
					},
				}}
			>
				<Tab.Screen
					name="Explorer"
					component={ExploreScreen}
					options={{
						tabBarLabel: "Tìm kiếm",
						tabBarIcon: ({ color, size }) => (
							<FontAwesome5
								name="search-location"
								size={24}
								color={"#fff"}
							/>
						),
					}}
				/>
				<Tab.Screen
					name="ScanQR"
					component={ScanQRScreen}
					options={{
						tabBarLabel: "Quét mã",
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons
								name="barcode-scan"
								size={24}
								color={"#fff"}
							/>
						),
					}}
				/>
				<Tab.Screen
					name="MyPostal"
					component={MyPostalScreen}
					options={{
						tabBarLabel: "Mã bưu chính",
						tabBarIcon: ({ color, size }) => (
							<FontAwesome5
								name="store"
								size={24}
								color={color}
							/>
						),
					}}
				/>
				<Tab.Screen
					name="More"
					component={MoreScreen}
					options={{
						tabBarLabel: "Tài khoản",
						tabBarIcon: ({ color, size }) => (
							<FontAwesome5 name="user" size={24} color={color} />
						),
					}}
				/>
			</Tab.Navigator>
			{/*<Footer style={styles.footer}>
				<FooterTab style={styles.ftab}>
					<View style={styles.viewf1}>
						<Image source={logo} style={styles.logo}></Image>
					</View>
					<View style={styles.viewf2}>
						<Text style={styles.txt1}>
							CƠ QUAN CHỦ QUẢN: BỘ THÔNG TIN VÀ TRUYỀN THÔNG (MIC)
						</Text>
						<Text style={styles.txt2}>
							Liên hệ: Vụ Bưu Chính, 18 Nguyễn Du, Hà Nội
						</Text>
						<Text style={styles.txt3}>ĐT: 024.38226625</Text>
						<Text
							style={styles.txt4}
							onPress={() => {
								Linking.openURL(
									"mailto:vanthubuuchinh@mic.gov.vn"
								);
							}}
						>
							Email: vanthubuuchinh@mic.gov.vn
						</Text>
					</View>
				</FooterTab>
			</Footer>*/}
		</React.Fragment>
	);
}

function MainStackScreen() {
	return (
		<MainStack.Navigator>
			<MainStack.Screen
				name="Explore"
				component={MyTabs}
				options={{
					headerShown: false,
					// headerTitle: (props) => <LogoTitle {...props} />,
					// headerLeft: props => <FeedAline {...props}/>,
					// headerLeft: null,
					// headerStyle: {
					// 	backgroundColor: "#0469c1",
					// },
					// headerTintColor: "#fff",
				}}
			/>
			<MainStack.Screen
				name="SignIn"
				component={SignInScreen}
				options={{ headerShown: false }}
			/>
			<MainStack.Screen
				name="SignUp"
				component={SignUpScreen}
				options={{ headerShown: false }}
			/>
			<MainStack.Screen
				name="ForgetPassword"
				component={ForgetPasswordScreen}
				options={{ headerShown: false }}
			/>
		</MainStack.Navigator>
	);
}

function App() {
	return (
		<ApolloProvider client={client}>
			<Provider store={store}>
				<IconRegistry icons={EvaIconsPack} />
				<ApplicationProvider {...eva} theme={eva.light}>
					<NavigationContainer>
						<RootStack.Navigator mode="modal" headerMode="none">
							<RootStack.Screen
								name="Main"
								component={MainStackScreen}
							/>
							<RootStack.Screen
								name="Postal"
								component={DetailPostalScreen}
							/>
							<RootStack.Screen
								name="Filter"
								component={FilterModalScreen}
							/>
							<RootStack.Screen
								name="SearchExplore"
								component={SearchExploreScreen}
							/>
							<RootStack.Screen
								name="Account"
								component={ProfileScreen}
							/>
							{/*<RootStack.Screen
								name="MapScreen"
								component={MapScreen}
							/>*/}
							<RootStack.Screen
								name="CreatePostal"
								component={CreatePostalScreen}
							/>
							<RootStack.Screen
								name="CreatePostalLocation"
								component={CreatePostalLocationScreen}
							/>
							<RootStack.Screen
								name="EditPostal"
								component={EditPostalScreen}
							/>
							<RootStack.Screen
								name="ChangePhoneNumber"
								component={ChangePhoneNumberScreen}
							/>
							<RootStack.Screen
								name="VerifyPhoneNumber"
								component={VerifyPhoneNumberScreen}
							/>
							<RootStack.Screen
								name="ProfileScreen2"
								component={ProfileScreen2}
							/>
							<RootStack.Screen
								name="ChangePassword"
								component={ChangePasswordScreen}
							/>
							<RootStack.Screen
								name="SearchedResults"
								component={SearchedResultsScreen}
							/>
							<RootStack.Screen
								name="IntroModal"
								component={IntroModalScreen}
							/>
							<RootStack.Screen
								name="DocumentModal"
								component={DocumentModalScreen}
							/>
							<RootStack.Screen
								name="GuideModal"
								component={GuideModalScreen}
							/>
							<RootStack.Screen
								name="ScanQR"
								component={ScanQRScreen}
							/>
						</RootStack.Navigator>
					</NavigationContainer>
				</ApplicationProvider>
			</Provider>
		</ApolloProvider>
	);
}

const styles = StyleSheet.create({
	footer: {
		height: 85,
		backgroundColor: "#0469c1",
		paddingLeft: 2,
		paddingRight: 2,
		elevation: 1,
	},
	logo: {
		width: 60,
		height: 60,
		borderRadius: 50,
	},
	viewf1: {
		width: "19%",
		paddingVertical: 3,
		paddingHorizontal: 5,
		justifyContent: "center",
		alignItems: "center",
	},
	viewf2: {
		width: "81%",
		justifyContent: "center",
	},
	txt1: { color: "#fff", fontWeight: "900", fontSize: 11 },
	txt2: { color: "#fff", fontWeight: "900", fontSize: 10 },
	txt3: { color: "#fff", fontWeight: "900", fontSize: 10 },
	txt4: {
		color: "#fff",
		fontWeight: "900",
		fontSize: 10,
		textDecorationStyle: "solid",
	},
	ftab: {
		elevation: 1,
	},
});

// keep this at the end
export default App;
