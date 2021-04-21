import axios from "axios";
import appConfigs from "../config";

class HTTPRequest {
    constructor(props) {
        // super(props)
        // axios.defaults.headers.post['Content-Type'] = 'application/json'
        // axios.defaults.headers.post['Accept'] = 'application/json'
        // axios.defaults.headers.post['Accept-Language'] = 'en'
    }
    static get({ baseUrl = appConfigs.API.GRAPHQL.URI, url, token, params }) {
        return axios({
            timeout: appConfigs.REQUEST.TIMEOUT,
            method: "get",
            baseURL: baseUrl,
            url: url,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8",
                // 'x-app-key': baseUrl == appConfigs.API.URL.EID_URL ? appConfigs.API.SECRET_KEY : '',
                // 'x-app-key': appConfigs.API.SECRET_KEY,
                // 'Authorization': 'Bearer ' + token || '',
            },
            params: params,
        });
    }

    static post({ baseUrl = appConfigs.API.GRAPHQL.URI, url, token, data }) {
        // let header = {}

        // header.push({
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json',
        //     'Authorization': 'Bearer ' + token || ''
        //
        // })

        return axios({
            timeout: appConfigs.REQUEST.TIMEOUT,
            method: "post",
            baseURL: baseUrl,
            url: url,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                // 'x-app-key': baseUrl == appConfigs.API.URL.EID_URL ? appConfigs.API.SECRET_KEY : '',
                // 'x-app-key': appConfigs.API.SECRET_KEY,
                Authorization: "Bearer " + token || "",
            },
            data: data,
            body: data,
        });
    }

    static postWithAppkey({
        baseUrl = appConfigs.API.GRAPHQL.URI,
        url,
        token,
        data,
    }) {
        return axios({
            timeout: appConfigs.REQUEST.TIMEOUT,
            method: "post",
            baseURL: baseUrl,
            url: url,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-app-key": appConfigs.API.SECRET_KEY,
                Authorization: "Bearer " + token || "",
            },
            data: data,
        });
    }

    static put({ baseUrl = appConfigs.API.GRAPHQL.URI, url, token, data }) {
        return axios({
            timeout: appConfigs.REQUEST.TIMEOUT,
            method: "put",
            baseURL: baseUrl,
            url: url,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token || "",
            },
            data: data,
        });
    }

    static upload({
        baseUrl = appConfigs.API.GRAPHQL.URI,
        url,
        token,
        data,
        files,
    }) {
        console.log(56, "upload method");

        var formData = new FormData();
        if (data) {
            for (let field in data) {
                formData.set(field, data[field]);
            }
        }

        console.log(63, "upload method");

        if (files) {
            for (let field in files) {
                formData.append(field, files[field], files[field].name);
            }
        }

        console.log(71, "upload method");

        return axios({
            timeout: appConfigs.REQUEST.TIMEOUT,
            method: "post",
            baseURL: baseUrl,
            url: url,
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + token || "",
            },
            data: formData,
        })
            .then((data) => {
                console.log(123, data);
                return data;
            })
            .catch((err) => {
                console.log(126, err);
                throw err;
            });
    }

    static delete({
        baseUrl = appConfigs.API.GRAPHQL.URI,
        url,
        token,
        params,
    }) {
        return axios({
            timeout: appConfigs.REQUEST.TIMEOUT,
            method: "delete",
            baseURL: baseUrl,
            url: url,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token || "",
            },
            params: params,
        });
    }
}

export default HTTPRequest;
