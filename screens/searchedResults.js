import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { List, ListItem, Divider, Text } from "@ui-kitten/components";

export default function SearchPlacesScreen({ props, route, navigation }) {

	let listPostal = route.params.placesArray;

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
			<Text style={styles.title} category='h5'>Kết quả tìm kiếm</Text>
			<List
				data={listPostal}
				ItemSeparatorComponent={Divider}
				renderItem={renderItem}
			/>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	title: {
		paddingTop: 40,
		padding: 17,
		backgroundColor: '#fff'
	}
});
