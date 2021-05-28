import { gql } from "@apollo/client";

export const CORE_NOTIF_FIELD = gql`
	fragment CoreNotifFields on notifications {
		id
		title
		description
		type
		uid
		is_seen
		created_at
		updated_at
	}
`;

export const CORE_POSTAL_FIELD = gql`
	fragment CorePostalFields on postals {
		id
		name
		phone
		address
		code_area
		area_level1_index
		area_level2_index
		area_level3_index
		area_level1_code
		area_level2_code
		area_level3_code
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
`;

export const CORE_USER_FIELD = gql`
	${CORE_POSTAL_FIELD}
	${CORE_NOTIF_FIELD}

	fragment CoreUserFields on users {
		id
		fullname
		phone
		gender
		birthday
		nation_id
		address
		token
		is_actived
		is_deleted
		block_message
		postals(where: { is_deleted: { _eq: 0 } }) {
			...CorePostalFields
		}
		notifications(where: { is_seen: { _eq: 0 } }) {
			...CoreNotifFields
		}
	}
`;

export const QUERY_LOGIN_USER = gql`
	${CORE_USER_FIELD}
	query Mobile_UserLogin($phone: String!, $password: String!) {
		users(
			where: {
				phone: { _eq: $phone }
				password: { _eq: $password }
				is_deleted: { _eq: 0 }
			}
		) {
			...CoreUserFields
		}
	}
`;

export const QUERY_CHECK_USER_TOKEN = gql`
	${CORE_USER_FIELD}
	query Mobile_CheckUserToken($id: Int!) {
		users(where: { id: { _eq: $id } }) {
			...CoreUserFields
		}
	}
`;

export const QUERY_GET_INFO_USER = gql`
	${CORE_USER_FIELD}
	query Mobile_QueryGetInfoUser($uid: Int!) {
		users(where: { id: { _eq: $uid } }, order_by: { id: desc }) {
			...CoreUserFields
		}
	}
`;

export const MUTATION_UPDATE_NOTIFI_PUSHTOKEN = gql`
	mutation Mobile_UpdateNotifPushtoken($uid: Int!, $pushtoken: String!) {
		update_users(
			where: { id: { _eq: $uid } }
			_set: { notif_pushtoken: $pushtoken }
		) {
			returning {
				id
			}
		}
	}
`;

export const MUTATION_SIGNUP_USER = gql`
	${CORE_USER_FIELD}
	mutation Mobile_SignUpUser(
		$fullname: String!
		$phone: String!
		$password: String!
	) {
		insert_users(
			objects: { fullname: $fullname, phone: $phone, password: $password }
		) {
			returning {
				...CoreUserFields
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
	${CORE_USER_FIELD}
	mutation Mobile_UpdateProfileDetail($uid: Int!, $newPassword: String!) {
		update_users(
			where: { id: { _eq: $uid } }
			_set: { password: $newPassword }
		) {
			returning {
				...CoreUserFields
			}
		}
	}
`;

export const MUTATION_UPDATE_PROFILE_DETAIL = gql`
	${CORE_USER_FIELD}
	mutation Mobile_UpdateProfileDetail(
		$id: Int!
		$fullname: String!
		$gender: Int
		$birthday: String
		$nation_id: String
		$address: String
	) {
		update_users(
			where: { id: { _eq: $id } }
			_set: {
				fullname: $fullname
				gender: $gender
				birthday: $birthday
				address: $address
				nation_id: $nation_id
			}
		) {
			returning {
				...CoreUserFields
			}
		}
	}
`;

export const MUTATION_CHANGE_PASSWORD_USER = gql`
	${CORE_USER_FIELD}
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
				...CoreUserFields
			}
		}
	}
`;

// export const MUTATION_UPDATE_PASSWORD = gql`
// 	mutation Mobile_UpdatePassword(
// 		$currentPassword: String!
// 		$newPassword: String!
// 	) {
// 		update_users(
// 			where: { id: { _eq: $id }, password: { _eq: $currentPassword } }
// 			_set: { password: $newPassword }
// 		) {
// 			returning {
// 				id
// 			}
// 		}
// 	}
// `;

export const QUERY_GET_ALL_POSTAL_PLACE = gql`
	${CORE_POSTAL_FIELD}
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
			...CorePostalFields
		}
	}
`;

export const QUERY_GET_POSTAL = gql`
	${CORE_POSTAL_FIELD}
	query Mobile_QueryGetPostal($id: Int!) {
		postals(where: { id: { _eq: $id } }) {
			...CorePostalFields
		}
	}
`;

export const MUTATION_UPDATE_POSTAL = gql`
	${CORE_USER_FIELD}
	mutation Mobile_MutationUpdatePostal(
		$id: Int!
		$name: String!
		$phone: String!
		$address: String!
		$code_area: String!
		$area_level1_index: Int!
		$area_level2_index: Int!
		$area_level3_index: Int!
		$area_level1_code: String!
		$area_level2_code: String!
		$area_level3_code: String!
		$area_text: String!
		$lat: String!
		$lng: String!
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
				area_level1_code: $area_level1_code
				area_level2_code: $area_level2_code
				area_level3_code: $area_level3_code
				area_text: $area_text
				lat: $lat
				lng: $lng
			}
		) {
			returning {
				id
				user {
					...CoreUserFields
				}
			}
		}
	}
`;

export const MUTATION_CREATE_REPORT_POSTAL = gql`
	mutation Mobile_CreateReportPostal(
		$postal_id: Int!
		$type: Int!
		$message: String
		$uid: Int!
	) {
		insert_postal_reports(
			objects: {
				postal_id: $postal_id
				type: $type
				message: $message
				uid: $uid
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
	${CORE_USER_FIELD}
	mutation Mutation_ActiveUser($uid: Int!) {
		update_users(where: { id: { _eq: $uid } }, _set: { is_actived: 1 }) {
			returning {
				...CoreUserFields
			}
		}
	}
`;

export const QUERY_CHECK_PHONE = gql`
	query QueryForgetPasswordCheckPhone($phone: String!) {
		users(where: { phone: { _eq: $phone } }) {
			phone
			id
		}
	}
`

export const MUTATION_CHANGE_PHONE_NUMBER = gql`
	${CORE_USER_FIELD}
	mutation Mutation_ChangePhone($uid: Int!, $phone: String!) {
		update_users(
			where: { id: { _eq: $uid } }
			_set: { phone: $phone, is_actived: 0 }
		) {
			returning {
				...CoreUserFields
			}
		}
	}
`;


export const QUERY_GET_POSTAL_DETAIL = gql`
	${CORE_POSTAL_FIELD}
	query GetPostalDetail($id: Int!) {
		postals(where: { id: { _eq: $id }, is_deleted: { _eq: 0 } }) {
			...CorePostalFields
		}
	}
`;


export const QUERY_GET_POSTAL_BY_BARCODE = gql`
	${CORE_POSTAL_FIELD}
	query Mobile_GetPostalByBarcode($code: String!) {
		postals(where: { code: { _eq: $code }, is_deleted: { _eq: 0 } }) {
			...CorePostalFields
		}
	}
`;

// MY POSTAL
export const QUERY_GET_ALL_MY_POSTAL = gql`
	${CORE_POSTAL_FIELD}
	query Mobie_GetAllMyPostal($uid: Int!) {
		postals(where: { uid: { _eq: $uid }, is_deleted: { _eq: 0 } }) {
			...CorePostalFields
		}
	}
`;

export const MUTATION_EDIT_POSTAL_DETAIL = gql`
	${CORE_USER_FIELD}
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
				user {
					...CoreUserFields
				}
			}
		}
	}
`;

// export const MUTATION_UPDATE_USER_PROFILE = gql``

export const MUTATION_CREATE_POSTAL = gql`
	${CORE_USER_FIELD}
	mutation Mobile_CreatePostal(
		$name: String!
		$image_url: String!
		$phone: String!
		$address: String!
		$code_area: String!
		$area_level1_index: Int!
		$area_level2_index: Int!
		$area_level3_index: Int!
		$area_level1_code: String!
		$area_level2_code: String!
		$area_level3_code: String!
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
				area_level1_code: $area_level1_code
				area_level2_code: $area_level2_code
				area_level3_code: $area_level3_code
				area_text: $area_text
				lat: $lat
				lng: $lng
				uid: $uid
			}
		) {
			returning {
				id
				user {
					...CoreUserFields
				}
			}
		}
	}
`;

export const MUTATION_UPDATE_STATUS_POSTAL = gql`
	mutation Mobile_MutationDeletePostal($id: Int!, $is_approved: Int!) {
		update_postals(
			where: { id: { _eq: $id } }
			_set: { is_approved: $is_approved }
		) {
			returning {
				id
			}
		}
	}
`;

export const MUTATION_UPDATE_ACTIVE_POSTAL = gql`
	${CORE_USER_FIELD}
	mutation Mobile_MutationDeletePostal($id: Int!, $is_actived: Int!) {
		update_postals(
			where: { id: { _eq: $id } }
			_set: { is_actived: $is_actived }
		) {
			returning {
				id
				is_actived
				user {
					...CoreUserFields
				}
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

export const QUERY_LIST_NOTIFICATION = gql`
	${CORE_NOTIF_FIELD}
	query Mobile_QueryListNotification($uid: Int!) {
		notifications(
			where: { uid: { _eq: $uid }, is_deleted: { _eq: 0 } }
			order_by: { id: desc }
		) {
			...CoreNotifFields
		}
	}
`;

export const MUTATION_SEEN_ALL_NOTIFICATION = gql`
	mutation Mobile_MutationSeenAllNotification($uid: Int!) {
		update_notifications(
			where: { uid: { _eq: $uid }, is_deleted: { _eq: 0 } }
			_set: { is_seen: 1 }
		) {
			returning {
				id
			}
		}
	}
`;
