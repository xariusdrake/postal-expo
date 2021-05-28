import { AsyncStorage } from "react-native";

export function storeSession(token, userData) {}

export const storeSession = async () => {
	try {
		await AsyncStorage.setItem("@token", user.token);
		await AsyncStorage.setItem("@userdata", JSON.stringify(user));
	} catch (error) {
		console.log(error);
	}
};
