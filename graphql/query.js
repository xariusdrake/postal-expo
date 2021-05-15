import { gql } from "@apollo/client";

export const QUERY_LOGIN_USER = gql`
	query Mobile_UserLogin($phone: String!, $password: String!) {
		users(
			where: {
				phone: { _eq: $phone }
				password: { _eq: $password }
				is_deleted: { _eq: 0 }
			}
		) {
			id
			fullname
			phone
			gender
			birthday
			address
			token
			is_actived
			is_deleted
			postals(where: { is_deleted: { _eq: 0 } }) {
				id
				name
				phone
				address
				code_area
				area_level1_index
				area_level2_index
				area_level3_index
				area_text
				image_url
				lng
				lat
				code
				phone
				region
				type
				uid
				is_approved
				is_actived
				created_at
			}
		}
	}
`;

export const QUERY_CHECK_USER_TOKEN = gql`
	query Mobile_CheckUserToken($id: Int!) {
		users(where: { id: { _eq: $id } }) {
			id
			fullname
			phone
			gender
			birthday
			address
			token
			is_actived
			is_deleted
			postals(where: { is_deleted: { _eq: 0 } }) {
				id
				name
				phone
				address
				code_area
				area_level1_index
				area_level2_index
				area_level3_index
				area_text
				image_url
				lng
				lat
				code
				phone
				region
				type
				uid
				is_approved
				is_actived
				created_at
			}
		}
	}
`;

export const QUERY_GET_INFO_USER = gql`
	query Mobile_QueryGetInfoUser($uid: Int!) {
		users(where: { id: { _eq: $uid } }) {
			id
			fullname
			phone
			gender
			birthday
			address
			token
			is_actived
			is_deleted
			postals(where: { is_deleted: { _eq: 0 } }) {
				id
				name
				phone
				address
				code_area
				area_level1_index
				area_level2_index
				area_level3_index
				area_text
				image_url
				lng
				lat
				code
				phone
				region
				type
				uid
				is_approved
				is_actived
				created_at
			}
		}
	}
`;

export const MUTATION_SIGNUP_USER = gql`
	mutation Mobile_SignUpUser(
		$fullname: String!
		$phone: String!
		$password: String!
	) {
		insert_users(
			objects: { fullname: $fullname, phone: $phone, password: $password }
		) {
			returning {
				id
				fullname
				phone
				gender
				birthday
				address
				token
				is_actived
				is_deleted
				postals(where: { is_deleted: { _eq: 0 } }) {
					id
					name
					phone
					address
					image_url
					lng
					lat
					code
					phone
					region
					type
					uid
					is_approved
					is_actived
					created_at
				}
			}
		}
	}
`;

export const QUERY_FORGET_PASSWORD_CHECK_PHONE = gql`
	query QueryForgetPasswordCheckPhone($phone: String!) {
		users(where: { is_deleted: { _eq: 0 }, phone: { _eq: $phone } }) {
			phone
			id
		}
	}
`;

export const QUERY_FORGET_PASSWORD_CHECK_CODE = gql`
	query QueryForgetPasswordCheckCode($code: Int!, $phone: Int!) {
		user_confirm_code(
			where: { code: { _eq: $code }, phone: { _eq: $phone } }
		) {
			id
		}
	}
`;

export const MUTATION_FORGET_PASSWORD_CHANGE = gql`
	mutation Mobile_UpdateProfileDetail($uid: Int!, $newPassword: String!) {
		update_users(
			where: { id: { _eq: $uid } }
			_set: { password: $newPassword }
		) {
			returning {
				id
				fullname
				phone
				gender
				birthday
				address
				token
				is_actived
				is_deleted
				postals(where: { is_deleted: { _eq: 0 } }) {
					id
					name
					phone
					address
					image_url
					lng
					lat
					code
					phone
					region
					type
					uid
					is_approved
					is_actived
					created_at
				}
			}
		}
	}
`;

export const MUTATION_UPDATE_PROFILE_DETAIL = gql`
	mutation Mobile_UpdateProfileDetail(
		$id: Int!
		$fullname: String!
		$gender: Int
		$birthday: String
		$address: String
	) {
		update_users(
			where: { id: { _eq: $id } }
			_set: {
				fullname: $fullname
				gender: $gender
				birthday: $birthday
				address: $address
			}
		) {
			returning {
				id
				fullname
				phone
				gender
				birthday
				address
				token
				is_actived
				is_deleted
				postals(where: { is_deleted: { _eq: 0 } }) {
					id
					name
					phone
					address
					image_url
					lng
					lat
					code
					phone
					region
					type
					uid
					is_approved
					is_actived
					created_at
				}
			}
		}
	}
`;

export const MUTATION_CHANGE_PASSWORD_USER = gql`
	mutation Mobile_UpdateProfileDetail(
		$uid: Int!
		$currentPassword: String!
		$newPassword: String!
	) {
		update_users(
			where: { id: { _eq: $uid }, password: { _eq: $currentPassword } }
			_set: { password: $newPassword }
		) {
			returning {
				id
				fullname
				phone
				gender
				birthday
				address
				token
				is_actived
				is_deleted
				postals(where: { is_deleted: { _eq: 0 } }) {
					id
					name
					phone
					address
					image_url
					lng
					lat
					code
					phone
					region
					type
					uid
					is_approved
					is_actived
					created_at
				}
			}
		}
	}
`;

export const MUTATION_UPDATE_PASSWORD = gql`
	mutation Mobile_UpdatePassword(
		$currentPassword: String!
		$newPassword: String!
	) {
		update_users(
			where: { id: { _eq: $id }, password: { _eq: $currentPassword } }
			_set: { password: $newPassword }
		) {
			returning {
				id
			}
		}
	}
`;

export const QUERY_GET_ALL_POSTAL_PLACE = gql`
	query Mobile_QueryGetAllPostalPlace($text: String!) {
		postals(
			where: {
				_or: [{ name: { _ilike: $text } }, { code: { _ilike: $text } }]
				is_approved: { _eq: 2 }
				is_actived: { _eq: 1 }
				is_deleted: { _eq: 0 }
			}
			limit: 10
			offset: 0
		) {
			id
			name
			phone
			address
			code_area
			area_level1_index
			area_level2_index
			area_level3_index
			area_text
			image_url
			lng
			lat
			code
			phone
			region
			type
			uid
			is_approved
			is_actived
			created_at
		}
	}
`;

export const QUERY_GET_POSTAL = gql`
	query Mobile_QueryGetPostal($id: Int!) {
		postals(where: { id: { _eq: $id } }) {
			id
			name
			phone
			address
			code_area
			area_level1_index
			area_level2_index
			area_level3_index
			area_text
			image_url
			lng
			lat
			code
			phone
			region
			type
			uid
			is_approved
			is_actived
			created_at
		}
	}
`;

export const MUTATION_UPDATE_POSTAL = gql`
	mutation Mobile_MutationUpdatePostal(
		$id: Int!
		$name: String!
		$phone: String!
		$address: address!
		$code_area: String!
		$area_level1_index: Int!
		$area_level2_index: Int!
		$area_level3_index: Int!
		$area_text: String!
		$lat: String!
		$long: String!
	) {
		update_postals(
			where: { id: { _eq: $id } }
			_set: {
				name: $name
				phone: $phone
				address: $address
				code_area: $code_area
				area_level1_index: $area_level1_index
				area_level2_index: $area_level2_index
				area_level3_index: $area_level3_index
				area_text: $area_text
				lat: $lat
				long: $long
			}
		) {
			returning {
				id
			}
		}
	}
`;

export const MUTATION_CREATE_CODE_CONFIRM = gql`
	mutation Mobile_MutationCreateCodeConfirm(
		$code: Int!
		$uid: Int
		$phone: Int
	) {
		insert_user_confirm_code(
			objects: { code: $code, uid: $uid, phone: $phone }
		) {
			returning {
				id
				code
			}
		}
	}
`;

export const QUERY_CHECK_CODE_CONFIRM = gql`
	query Mobile_QueryCheckCodeConfirm($code: Int!, $uid: Int!) {
		user_confirm_code(
			where: {
				code: { _eq: $code }
				status: { _eq: 0 }
				uid: { _eq: $uid }
			}
		) {
			id
			uid
		}
	}
`;

export const MUTATION_ACTIVE_USER = gql`
	mutation Mutation_ActiveUser($uid: Int!) {
		update_users(where: { id: { _eq: $uid } }, _set: { is_actived: 1 }) {
			returning {
				id
				fullname
				phone
				gender
				birthday
				address
				token
				is_actived
				is_deleted
				postals(where: { is_deleted: { _eq: 0 } }) {
					id
					name
					phone
					address
					image_url
					lng
					lat
					code
					phone
					region
					type
					uid
					is_approved
					is_actived
					created_at
				}
			}
		}
	}
`;

export const MUTATION_CHANGE_PHONE_NUMBER = gql`
	mutation Mutation_ChangePhone($uid: Int!, $phone: String!) {
		update_users(
			where: { id: { _eq: $uid } }
			_set: { phone: $phone, is_actived: 0 }
		) {
			returning {
				id
				fullname
				phone
				gender
				birthday
				address
				token
				is_actived
				is_deleted
				postals(where: { is_deleted: { _eq: 0 } }) {
					id
					name
					phone
					address
					image_url
					lng
					lat
					code
					phone
					region
					type
					uid
					is_approved
					is_actived
					created_at
				}
			}
		}
	}
`;

// export const QUERY_SEARCH_ALL_POSTAL_PLACE = gql`
// 	query Mobile_SearchAllPostalPlace($text: String!) {
// 		postals(where: { _or: [{name: {_like: "1"}}, {code: {_like: "1"}}]}) {
// 			id
// 			name
// 			lng
// 			lat
// 			location
// 			postal_code
// 			code
// 			phone
// 			region
// 			status
// 			type
// 			website
// 			image_url
// 			email
// 			geocode
// 			uid
// 			created_at
// 		}
// 	}
// `;

export const QUERY_GET_POSTAL_DETAIL = gql`
	query GetPostalDetail($id: Int!) {
		postals(where: { id: { _eq: $id }, is_deleted: { _eq: 0 } }) {
			id
			name
			phone
			address
			code_area
			area_level1_index
			area_level2_index
			area_level3_index
			area_text
			image_url
			lng
			lat
			code
			phone
			region
			type
			uid
			is_approved
			is_actived
			created_at
		}
	}
`;

// export const QUERY_GET_POSTAL_BY_BARCODE = gql`
// 	query Mobile_GetPostalByBarcode($id: Int!) {
// 		postals(where: { id: { _eq: $id }, is_deleted: { _eq: 0 } }) {
// 			id
// 			name
// 			phone
// 			postal_code
// 			code
// 			region
// 			website
// 			lat
// 			lng
// 			email
// 		}
// 	}
// `;

export const QUERY_GET_POSTAL_BY_BARCODE = gql`
	query Mobile_GetPostalByBarcode($code: String!) {
		postals(where: { code: { _eq: $code }, is_deleted: { _eq: 0 } }) {
			id
			name
			phone
			address
			code_area
			area_level1_index
			area_level2_index
			area_level3_index
			area_text
			image_url
			lng
			lat
			code
			phone
			region
			type
			uid
			is_approved
			is_actived
			created_at
		}
	}
`;

// MY POSTAL
export const QUERY_GET_ALL_MY_POSTAL = gql`
	query Mobie_GetAllMyPostal($uid: Int!) {
		postals(where: { uid: { _eq: $uid }, is_deleted: { _eq: 0 } }) {
			id
			name
			phone
			address
			image_url
			lng
			lat
			code
			phone
			region
			type
			uid
			is_approved
			is_actived
			created_at
		}
	}
`;

export const MUTATION_EDIT_POSTAL_DETAIL = gql`
	mutation Mobile_EditPostalDetail(
		$id: Int!
		$name: String!
		$image_url: String!
	) {
		update_postals(
			where: { id: { _eq: $id } }
			_set: { name: $name, image_url: $image_url }
		) {
			returning {
				id
			}
		}
	}
`;

// export const MUTATION_UPDATE_USER_PROFILE = gql``

export const MUTATION_CREATE_POSTAL = gql`
	mutation Mobile_CreatePostal(
		$name: String!
		$image_url: String!
		$phone: String!
		$address: String!
		$code_area: String!
		$area_level1_index: Int!
		$area_level2_index: Int!
		$area_level3_index: Int!
		$area_text: String!
		$lat: String!
		$lng: String!
		$type: Int!
		$uid: Int!
	) {
		insert_postals(
			objects: {
				name: $name
				phone: $phone
				image_url: $image_url
				type: $type
				address: $address
				code_area: $code_area
				area_level1_index: $area_level1_index
				area_level2_index: $area_level2_index
				area_level3_index: $area_level3_index
				area_text: $area_text
				lat: $lat
				lng: $lng
				uid: $uid
			}
		) {
			returning {
				id
			}
		}
	}
`;

export const MUTATION_DELETE_POSTAL = gql`
	mutation Mobile_MutationDeletePostal($id: Int!) {
		update_postals(where: { id: { _eq: $id } }, _set: { is_deleted: 1 }) {
			returning {
				id
			}
		}
	}
`;
