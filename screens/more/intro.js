import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Image,
	ImageBackground,
	TouchableOpacity,
	SafeAreaView,
} from "react-native";
import { connect } from "react-redux";

import {
	Text,
	Icon,
	Layout,
	MenuItem,
	OverflowMenu,
	TopNavigation,
	TopNavigationAction,
	Divider,
} from "@ui-kitten/components";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

function IntroModalScreen(props) {
	console.log("info user");
	console.log(props.info);

	const renderBackAction = () => (
		<TopNavigationAction
			icon={BackIcon}
			onPress={() => props.navigation.goBack()}
		/>
	);

	return (
		<SafeAreaView>
			{props.no_header != true && (
				<React.Fragment>
					<TopNavigation
						alignment="center"
						title="Giới thiệu"
						accessoryLeft={renderBackAction}
						// accessoryRight={renderRightActions}
					/>

					<Divider />
				</React.Fragment>
			)}

			<View
				style={{
					alignSelf: "flex-start",
					padding: 20,
					backgroundColor: "#fff",
				}}
			>
				<Text style={{ fontWeight: "bold" }}>1. Cấu trúc Mã bưu chính</Text>
				<Text style={styles.description}>
					Mã bưu chính quốc gia gồm tập hợp 05 (năm) ký tự số, cụ thể
				</Text>
				<Text style={{ fontWeight: "bold" }}>
					2. Lợi ích của việc sử dụng Mã bưu chính
				</Text>
				<Text style={{ fontWeight: "bold" }}>
					2.1 Đối với người sử dụng dịch vụ bưu chính
				</Text>

				<Text style={styles.description}>
					- Bưu gửi được vận chuyển và phát được nhanh chóng, chính
					xác và an toàn.
				</Text>

				<Text style={styles.description}>
					- Giảm số lượng bưu gửi không phát được.
				</Text>

				<Text style={styles.description}>
					- Có cơ hội giảm giá thành dịch vụ.
				</Text>

				<Text style={styles.description}>
					- Chất lượng cung ứng dịch vụ được nâng cao.
				</Text>

				<Text style={{ fontWeight: "bold" }}>
					2.2 Đối với tổ chức, doanh nghiệp cung ứng dịch vụ bưu chính
				</Text>

				<Text style={styles.description}>
					- Tạo thuận lợi cho việc chia chọn, phân hướng các bưu gửi
					nhanh chóng, chính xác rút ngắn hơn thời gian chia chọn và
					phát bưu gửi.
				</Text>

				<Text style={styles.description}>
					- Xác định hướng chuyển bưu gửi nhanh chóng, chính xác khi
					việc ghi địa chỉ không rõ ràng, do đó sẽ hạn chế sai sót
					trong tác nghiệp.
				</Text>

				<Text style={styles.description}>
					- Chất lượng dịch vụ được nâng cao.
				</Text>

				<Text style={styles.description}>
					- Giảm giá thành dịch vụ đối với bưu gửi số lượng lớn trong
					cung ứng dịch vụ bưu chính.
				</Text>

				<Text style={styles.description}>
					- Công tác quản trị nội bộ, công tác kế toán và thống kê sản
					lượng được thuận tiện qua việc kết nối dữ liệu gắn với mã
					bưu chính.
				</Text>

				<Text style={styles.description}>
					- Thuận lợi cho việc ứng dụng các phần mềm hỗ trợ khai thác
					và quản lý giữa các bưu cục, điểm phục vụ cũng như các đơn
					vị kinh doanh từ đó đơn giản hóa quy trình khai thác, nghiệp
					vụ; xây Dựng kế hoạch kinh doanh và quản lý hoạt động bán
					hàng có hiệu quả hơn.
				</Text>
				<Text style={styles.description}>
					- Tạo thêm nguồn thu thông qua hoạt động đáp ứng nhu cầu
					nghiên cứu thị trường của tổ chức, cá nhân.
				</Text>
			</View>
		</SafeAreaView>
	);
}

var grayMedium = "#879299";
// STYLES
const styles = StyleSheet.create({
	container: {
		justifyContent: "flex-start",
		backgroundColor: "#fff",
	},
	head: {
		backgroundColor: "#fff",
		width: "100%",
		marginTop: 50,
		marginBottom: 0,
		paddingHorizontal: 25,
		paddingVertical: 10,
		margin: 0,
		borderBottomColor: grayMedium,
		borderBottomWidth: 1,
		height: 50,
		// position: "absolute",
	},
	description: {

        paddingTop: 5,
	}
});

function mapStateToProps(state) {
	return { infos: state.infos };
}

// keep this line at the end
export default connect(mapStateToProps, null)(IntroModalScreen);
