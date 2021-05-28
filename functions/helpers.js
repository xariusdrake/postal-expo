import {
    Alert,
    AsyncStorage,
    Keyboard,
    Platform,
    TouchableWithoutFeedback,
} from "react-native";

import { QUERY_GET_INFO_USER } from "../graphql/query";

export function directForNonAuth(that) {
    if (!that.infos) {
        that.navigation.navigate("SignIn");
    }
    // if (getDataFromStorage('@token') == null) {

    // }
}

export function getDataFromStorage(key) {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(key, (error, result) => {
            if (error) {
                return reject(error);
            }
            if (!result) {
                return resolve(null);
            }
            try {
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    });
}

export function setDataStorage(key, value) {
    AsyncStorage.setItem(key, value);
}

export function retrieveSession(that) {
    getDataFromStorage("@token")
        .then((result) => {
            if (result != null) {
                that.storeData(result);
            }
        })
        .catch((error) => {
            console.log(error);
        });

    getDataFromStorage("@userdata")
        .then((result) => {
            if (result !== null) {
                that.storeUserInfo(JSON.parse(result));
            }
        })
        .catch((error) => {
            console.log(error);
        });

    // params = {
    //     pushToken: SharePreference.pushToken,
    //     identifier: "ekp_" + SharePreference.user.id,
    //     tags: data,
    // };

    // APIHandler.requestWithHost(
    //     METHOD.PUT,
    //     URL.PUSH_TAG,
    //     params,
    //     DOMAIN.PUSH,
    //     (code, message, data) => {
    //         console.log("update tag", JSON.stringify(data));
    //     }
    // );
}

export function saveToken(token, that) {
    AsyncStorage.setItem("@token", JSON.stringify(token));
    that.storeData(token);
}

export function saveUserdata(data, that) {
    AsyncStorage.setItem("@userdata", JSON.stringify(data));
    that.storeUserInfo(data);
}

export function savePushtoken(data) {
    AsyncStorage.setItem("@pushtoken", data);
}

export function logout(that) {
    // params = { deviceId: getDeviceID() };

    // APIHandler.requestWithHost(
    //     METHOD.POST,
    //     URL.SIGNOUT,
    //     params,
    //     DOMAIN.EID,
    //     (code, message, data) => {
    //         APIHandler.setGlobalHeader({ Authorization: null });
    //     }
    // );

    AsyncStorage.removeItem("@token");
    AsyncStorage.removeItem("@userdata");

    that.storeData(null);
    that.storeUserInfo(null);
}
