import axios from "axios";
import appConfigs from "../config";

class SMS {
	constructor(props) {}

	static send({ phone, message }) {
		
		if (phone.length < 1 || message.length < 1) {
			return false;
		}

		return axios({
			// timeout: appConfigs.REQUEST.TIMEOUT,
			method: "get",
			baseURL: appConfigs.ESMS.BASE_URL,
			params: {
				Phone: phone,
				Content: encodeURI(message),
				ApiKey: appConfigs.ESMS.API_KEY,
				SecretKey: appConfigs.ESMS.SECRET_KEY,
				SmsType: 2,
				Brandname: "Baotrixemay"
			},
		});
	}
}

export default SMS;

// http://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_get?Phone=0964940256&ApiKey=48828BB7CE8FDD81E72F0B525C9970&SecretKey=1E474E8FED09D0D3DB9B74ADD60C7F&Content=Ma%20dang%20ky%20cua%20ban%20la%202222&SmsType=8