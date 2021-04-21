return user

id
fullname
phone
gender
birthday
token
is_actived
is_deleted
postals(where: { is_deleted: { \_eq: 0 } }) {
	id
	name
	address
	image_url
	lng
	lat
	location
	postal_code
	code
	phone
	region_id
	status
	type
	website
	image_url
	email
	geocode
	location
	uid
	is_approved
	is_actived
	created_at
}
