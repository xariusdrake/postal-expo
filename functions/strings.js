import validator from "validator";

import appConfigs from "../config";

export function isEmptyString(input) {
	return !input || input.length === 0;
	// return validator.isEmpty(input);
}

export function isEmpty(obj) {
	// null and undefined are "empty"
	if (obj == null) return true;

	// Assume if it has a length property with a non-zero value
	// that that property is correct.
	if (obj.length > 0) return false;
	if (obj.length === 0) return true;

	// If it isn't an object at this point
	// it is empty, but it can't be anything *but* empty
	// Is it empty?  Depends on your application.
	if (typeof obj !== "object") return true;

	// Otherwise, does it have any properties of its own?
	// Note that this doesn't handle
	// toString and valueOf enumeration bugs in IE < 9
	for (var key in obj) {
		if (hasOwnProperty.call(obj, key)) return false;
	}

	return true;
}

export function isMin(text, num) {
	// if (text == null) {
	// 	return false;
	// }

	// text = text.trim();
	if (text.length >= num) {
		return true;
	}

	return false;
}

export function isMax(text, num) {
	// if (text == null) {
	// 	return false;
	// }

	// text = text.trim();
	// console.log(46, text, text.length, appConfigs.VALIDATE.USER.MIN_PHONE, appConfigs.VALIDATE.USER.MAX_PHONE)
	if (text.length <= num) {
		return true;
	}

	return false;
}

export function isEmptyValue(value) {
	if (value == null || value == 0) {
		return true;
	} else {
		return false;
	}
}

function removeAscent(str) {
	if (str === null || str === undefined) return str;
	str = str.toLowerCase();
	str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
	str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
	str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
	str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
	str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
	str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
	str = str.replace(/đ/g, "d");
	return str;
}

export function allLetter(input) {
	return true;
	var re = /^[a-zA-Z!@#\$%\^\&*\)\(+=._-]{2,}$/g; // regex here
	return re.test(removeAscent(input));

	// if (validator.isAlpha(input, [])) var letters = /^[a-zA-Z\s]*$/;
	// if (input.match(letters)) {
	// 	return true;
	// } else {
	// 	return false;
	// }
}

export function allNumeric(input) {
	var numbers = /^[0-9]+$/;

	if (input.match(numbers)) {
		return true;
	} else {
		return false;
	}
}

export function allLetterNumeric(input) {
	return true;
	// var letterNumber = /^[0-9a-zA-Z]+$/;
	// if (input.match(letterNumber)) {
	// 	return true;
	// } else {
	// 	return false;
	// }
}

export function isWhitepace(input) {
	return input.indexOf(" ") >= 0 ? true : false;
}

export function isFullname(input) {
	if (allLetter(input) == false) {
		return false;
	} else if (
		isMin(input, appConfigs.VALIDATE.USER.MIN_FULLNAME) == false ||
		isMax(input, appConfigs.VALIDATE.USER.MAX_FULLNAME) == false
	) {
		return false;
	} else {
		return true;
	}
}

export function isPhoneNumber(input) {
	if (isWhitepace(input) == true) {
		return false;
	} else if (allNumeric(input) == false) {
		return false;
	} else if (input.substring(0, 1) != 0) {
		return false;
	} else if (
		isMin(input, appConfigs.VALIDATE.USER.MIN_PHONE) == false ||
		isMax(input, appConfigs.VALIDATE.USER.MAX_PHONE) == false
	) {
		return false;
	} else {
		return true;
	}
}

export function isPassword(input) {
	if (isWhitepace(input) == true) {
		return false;
	} else if (
		isMin(input, appConfigs.VALIDATE.USER.MIN_PASSWORD) == false ||
		isMax(input, appConfigs.VALIDATE.USER.MAX_PASSWORD) == false
	) {
		return false;
	} else {
		return true;
	}
}
