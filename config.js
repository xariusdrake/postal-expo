const appConfigs = {
    LOGGER: {
        REDUX: true,
        PAGE_MESSAGE: true,
    },
    API: {
        // POSTAL: {
        //     URI: 'https://api.mabuuchinh.vn/api/v1/MBC'
        // },
        GRAPHQL: {
            URI: "https://postal.hasura.app/v1/graphql",
        },
        VNPOST: {
            URI: "https://api.mabuuchinh.vn/api/v1/MBC",
        },
        // SERVICE: {
        //     URI: 'http://localhost:3000'
        // },
        // URL: {
        //     BASE_URL: 'https://tin03.000webhostapp.com/mabuuchinh/data.php'
        // },
    },
    REQUEST: {
        TIMEOUT: 30000,
    },
    VALIDATE: {
        USER: {
            MIN_USERNAME: 6,
            MAX_USERNAME: 20,
            MIN_PHONE: 10,
            MAX_PHONE: 11,
            MIN_PASSWORD: 6,
            MAX_PASSWORD: 30,
            MIN_FULLNAME: 6,
            MAX_FULLNAME: 50,
            MIN_ADDRESS: 2,
            MAX_ADDRESS: 100,
        },
        POSTAL: {
            MIN_NAME: 6,
            MAX_NAME: 40,
            MIN_ADDRESS: 6,
            MAX_ADDRESS: 100
        },
        POSTAL_REPORT: {
            MIN_MESSAGE: 0,
            MAX_MESSAGE: 200
        },
        AUTH: {
            MIN_USERNAME: 6,
            MAX_USERNAME: 20,
            MIN_PHONE: 10,
            MAX_PHONE: 11,
            MIN_PASSWORD: 6,
            MAX_PASSWORD: 30,
            MIN_FULLNAME: 6,
            MAX_FULLNAME: 50,
            MIN_ADDRESS: 2,
            MAX_ADDRESS: 100,
        },
        PROFILE: {
            MIN_USERNAME: 6,
            MAX_USERNAME: 20,
            MIN_PASSWORD: 6,
            MAX_PASSWORD: 30,
            MIN_FULLNAME: 6,
            MAX_FULLNAME: 50,
            MIN_ADDRESS: 6,
            MAX_ADDRESS: 30,
            MAX_PHONE: 13,
        },
        POSTAL: {
            MIN_NAME: 3,
            MAX_NAME: 40,
        },
        MIN_USERNAME: 6,
        MAX_USERNAME: 15,
        MIN_PASSWORD: 6,
        MAX_PASSWORD: 25,
    },
    AUTHENTICATED_DATA: {
        EXPIRED_TIME: 365,
    },
    GOOGLE_MAP: {
        latitudeDelta: 0.009,
        longitudeDelta: 0.001,
        //AIzaSyAVqIeFgHndRBRSKJsTnjvygWXxWwsIUbA
        API_KEY: "AIzaSyDSnZaFuv7fj1bdFDEZAgwfuvo8WX1go0Q",
        API_KEY_2: "AIzaSyDSnZaFuv7fj1bdFDEZAgwfuvo8WX1go0Q", // for geocode
    },
    VIETMAP: {
        KEY: "6f5bf21b9c50883b38af007b6570d719317a96778d1e6149"
    },
    ESMS: {
        BASE_URL:
            "http://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_get",
        API_KEY: "48828BB7CE8FDD81E72F0B525C9970",
        SECRET_KEY: "1E474E8FED09D0D3DB9B74ADD60C7F",
    },
};

export default appConfigs;
