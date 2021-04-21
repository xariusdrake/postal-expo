const appConfigs = {
    LOGGER: {
        REDUX: true,
        PAGE_MESSAGE: true
    },
    API: {
        POSTAL: {
            URI: 'https://api.mabuuchinh.vn/api/v1/MBC'
        },
        GRAPHQL: {
            URI: 'https://postal.hasura.app/v1/graphql'
        },
        SERVICE: {
            URI: 'http://localhost:3000'
        },
        URL: {
            BASE_URL: 'https://tin03.000webhostapp.com/mabuuchinh/data.php'
        },
    },
    REQUEST: {
        TIMEOUT: 30000
    },
    VALIDATE: {
        AUTH: {
            MIN_USERNAME: 6,
            MAX_USERNAME: 20,
            MIN_PASSWORD: 6,
            MAX_PASSWORD: 30,
            MIN_FULLNAME: 6,
            MAX_FULLNAME: 50
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
            MAX_PHONE: 13
        },
        POSTAL: {
            MIN_NAME: 3,
            MAX_NAME: 40
        },
        MIN_USERNAME: 6,
        MAX_USERNAME: 15,
        MIN_PASSWORD: 6,
        MAX_PASSWORD: 25
    },
    AUTHENTICATED_DATA: {
        EXPIRED_TIME: 365
    },
    GOOGLE_MAP: {
        latitudeDelta: 0.009,
        longitudeDelta: 0.001,
        API_KEY: 'AIzaSyAVqIeFgHndRBRSKJsTnjvygWXxWwsIUbA',
        API_KEY_2:'AIzaSyAVqIeFgHndRBRSKJsTnjvygWXxWwsIUbA' // for geocode
    },
    ESMS: {
        BASE_URL: 'http://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_get',
        API_KEY: '48828BB7CE8FDD81E72F0B525C9970',
        SECRET_KEY: '1E474E8FED09D0D3DB9B74ADD60C7F'
    }
}

export default appConfigs