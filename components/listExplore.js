import React from "react";
import {
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	SafeAreaView,
	View,
	Platform
} from "react-native";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { List, ListItem, Divider, Text } from "@ui-kitten/components";
import Spinner from "react-native-loading-spinner-overlay";

function ListScreen(props) {
	const navigation = useNavigation();

	let renderItem = ({ item, index }) => {
		return (
			<ListItem
				key={item.id}
				title={`${item.name}`}
				description={`${item.postal_code}`}
				onPress={() => navigation.navigate("Postal", { postal: item })}
			/>
		);
	};

	return (
		<React.Fragment>
			<Spinner visible={props.loading} />
			{props.filteredPlaces.length > 0 && (
				<SafeAreaView
					style={{
						backgroundColor: "#fff",
						height: Dimensions.get("window").height,
						paddingTop: Platform.OS === 'android' ? 25 : 0
					}}
				>
					<View style={{ backgroundColor: "#fff" }}>
						{/*<Spinner visible={props.loading == 1 ? true : false} />*/}
						<List
							style={{ paddingTop: 45 }}
							data={props.filteredPlaces}
							ItemSeparatorComponent={Divider}
							renderItem={renderItem}
						/>
					</View>
				</SafeAreaView>
			)}

			{props.filteredPlaces.length == 0 && (
				<View style={{ ...styles.container }}>
					<Text style={styles.title} category="h6">
						Không tìm thấy kết quả
					</Text>
				</View>
			)}
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	title: {
		padding: 17,
		backgroundColor: "#fff",
		textAlign: "center",
	},

	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		// paddingTop: 200,
		// paddingHorizontal: 25,
		backgroundColor: "#FFFFFF",
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

function mapStateToProps(state) {
	return { favs: state.favs };
}

export default connect(mapStateToProps, null)(ListScreen);
