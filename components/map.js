import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Dimensions,
	View,
	TouchableOpacity,
	Text,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";

// my components
import MapModal from "../components/mapModal";
import MarkerRestaurant from "../components/markerRestaurant";
import MarkerShop from "../components/markerShop";

// icons
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapViewDirections from "react-native-maps-directions";
// import ScrollBottomSheet from "react-native-scroll-bottom-sheet";
const windowHeight = Dimensions.get("window").height;

import appConfigs from "../config";
// import { mapStyleCustom } from './mapStyle';

const origin = { latitude: 37.3318456, longitude: -122.0296002 };
const destination = { latitude: 37.771707, longitude: -122.4053769 };
const GOOGLE_MAPS_APIKEY = appConfigs.GOOGLE_MAP.API_KEY_2;

/* Color ref */
var greyLight = "#d8d8d8";
var graySuperLight = "#f4f4f4";
var mint = "#0469c1";
var mintDark = "#2BA282";
var grayMedium = "#879299";
var blueDark = "#033C47";

// map style
const mapStyle = [
	{
		featureType: "poi",
		elementType: "labels",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
];

function Map(props) {
	const navigation = useNavigation();

	const [modalVisibility, setModalVisibility] = useState(false);
	const [markerSelected, setMarkerSelected] = useState(null);

	const [region, setRegion] = useState({
		latitude: 21.0267527,
		longitude: 105.7603575,
		latitudeDelta: props.region.latitudeDelta,
		longitudeDelta: props.region.longitudeDelta,
	});

	const displayModal = (place) => {
		setModalVisibility(true);
	};
	const hideModal = () => {
		setModalVisibility(false);
	};

	const deselect = () => {
		if (markerSelected != null) {
			hideModal();
			setMarkerSelected(null);
		}
	};

	// set markers size
	const smallSize = { width: 22, height: 30, translateX: 5, translateY: 14 };
	const bigSize = { width: 32, height: 44, translateX: 0, translateY: 0 };

	return (
		<View style={{ flex: 1 }}>
			<MapView
				provider={PROVIDER_GOOGLE}
				style={styles.mapStyle}

		        // customMapStyle={mapStyleCustom}
				rotateEnabled={false}
				region={region}
				onRegionChangeComplete={(region) => setRegion(region)}
				showsTraffic={false}
				loadingEnabled={true}
				customMapStyle={mapStyle}
				onPress={() => deselect()}
			>
				{/*
			        {props.filteredPlaces.map((place, i) => {
			          return (
			            <Marker
			              key={`marker${i}`}
			              coordinate={{
			                latitude: place.latitude,
			                longitude: place.longitude,
			              }}
			              onPress={() => {
			                displayModal(place), setMarkerSelected(i);
			              }}
			              // onDeselect={ () => { hideModal(), setMarkerSelected('') } }
			            >
			              <View style={{ width: 32, height: 44 }}>
			                {place.type == "shop" ? (
			                  <MarkerShop
			                    size={markerSelected == i ? bigSize : smallSize}
			                  />
			                ) : (
			                  <MarkerRestaurant
			                    size={markerSelected == i ? bigSize : smallSize}
			                  />
			                )}
			              </View>
			            </Marker>
			          );
			        })}
			    */}
				<Marker
					coordinate={{
						latitude: props.userPosition.currentLat,
						longitude: props.userPosition.currentLong,
					}}
					title="Hiện tại"
					image={require("../assets/icons/position.png")}
				/>

				<MapViewDirections
					origin={origin}
					destination={destination}
					apikey={GOOGLE_MAPS_APIKEY}
				/>
			</MapView>
			<TouchableOpacity
				style={{ ...styles.centerMap }}
				onPress={() => {
					setRegion(props.region);
					props.askPermissions();
				}}
			>
				<MaterialCommunityIcons name="target" size={24} color="white" />
			</TouchableOpacity>

			<TouchableOpacity
				style={{ ...styles.filterMap }}
				onPress={() => {
					navigation.navigate("Filter", {
						filtre: "fiiiltre",
					});
				}}
			>
				<MaterialCommunityIcons name="filter" size={24} color="white" />
			</TouchableOpacity>

			{/*<TouchableOpacity
				style={{ ...styles.barcodeScan }}
				onPress={() => {
					navigation.navigate("ScanQR");
				}}
			>
				<MaterialCommunityIcons name="barcode-scan" size={24} color="white" />
			</TouchableOpacity>*/}

			{modalVisibility == true ? (
				<MapModal
					place={props.filteredPlaces[markerSelected]}
					handleclickParent={deselect}
				/>
			) : null}

			{/*<ScrollBottomSheet
				componentType="FlatList"
				snapPoints={[128, "50%", windowHeight - 200]}
				initialSnapIndex={2}
				renderHandle={() => (
					<View style={styles.header}>
						<View style={styles.panelHandle} />
					</View>
				)}
				data={Array.from({ length: 200 }).map((_, i) => String(i))}
				keyExtractor={(i) => i}
				renderItem={({ item }) => (
					<View style={styles.item}>
						<Text>{`Item ${item}`}</Text>
					</View>
				)}
				contentContainerStyle={styles.contentContainerStyle}
			/>*/}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	mapStyle: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
	},
	centerMap: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		alignSelf: "center",
		padding: 10,
		backgroundColor: mint,
		position: "absolute",
		bottom: 15,
		right: 15,
		borderRadius: 30,
	},
	filterMap: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		alignSelf: "center",
		padding: 10,
		backgroundColor: mint,
		position: "absolute",
		bottom: 70,
		right: 15,
		borderRadius: 30,
	},
	barcodeScan: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		alignSelf: "center",
		padding: 10,
		backgroundColor: mint,
		position: "absolute",
		bottom: 130,
		right: 15,
		borderRadius: 30,
	},

	contentContainerStyle: {
		padding: 16,
		backgroundColor: "#F3F4F9",
	},
	header: {
		alignItems: "center",
		backgroundColor: "white",
		paddingVertical: 20,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	panelHandle: {
		width: 40,
		height: 2,
		backgroundColor: "rgba(0,0,0,0.3)",
		borderRadius: 4,
	},
	item: {
		padding: 20,
		justifyContent: "center",
		backgroundColor: "white",
		alignItems: "center",
		marginVertical: 10,
	},
});

export default Map;
