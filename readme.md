react-native-date-picker


@dietime/react-native-date-picker
expo-linear-gradient


Killing Me Softly With His Song



filter level 2:
	ignore: hội đồng, uỷ bản, bưu cục, tạp chí văn phòng, ban, viện, kiểm toán, bộ, 
	accept: quận, huyện, thị xã, thành phố,


filter level 3
	accept: 
		start: huyện, phường, xã, thị trấn, 


postal
	status
		0: đã bị từ chối duyệt
		1: đang chờ duyệt
		2: đã đuợc duyệt (đang hiển thị công khai)
		-1: đã tạm dừng (gỡ xuống)
	is_actived
		-1: creator tự gỡ xuống
		1: đang hoạt động
		0: đã bị khoá

postal_reports
	type
	status
		1: pending
		2: done
	is_actived
		1: active

	is_deleted



user
	is_actived
		0: chưa kích hoạt tài khoản
		1: đã kích hoạt tài khoản
		-1: đã bị khoá tài khoản


user_log
	TYPE
		POSTAL_APPROVE
		POSTAL_ACTIVE
	