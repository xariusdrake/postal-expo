import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Image,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Dimensions,
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

function GuideModalScreen(props) {
    const [menuVisible, setMenuVisible] = React.useState(false);

    console.log("info user");
    console.log(props.info);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const renderMenuAction = () => (
        <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
    );

    // const renderRightActions = () => (
    //     <React.Fragment>
    //         <TopNavigationAction icon={EditIcon} />
    //         <OverflowMenu
    //             anchor={renderMenuAction}
    //             visible={menuVisible}
    //             onBackdropPress={toggleMenu}
    //         >
    //             <MenuItem accessoryLeft={InfoIcon} title="About" />
    //             <MenuItem accessoryLeft={LogoutIcon} title="Logout" />
    //         </OverflowMenu>
    //     </React.Fragment>
    // );

    const renderBackAction = () => (
        <TopNavigationAction
            icon={BackIcon}
            onPress={() => props.navigation.goBack()}
        />
    );

    return (
        <SafeAreaView
            stlye={{
                height: Dimensions.get("window").height,
                backgroundColor: "#fff",
            }}
        >
            <ScrollView style={{ marginBottom: 200 }}>
                {props.no_header != true && (
                    <React.Fragment>
                        <TopNavigation
                            alignment="center"
                            title="Hướng dẫn"
                            accessoryLeft={renderBackAction}
                            // accessoryRight={renderRightActions}
                        />

                        <Divider />
                    </React.Fragment>
                )}

                <View style={{ padding: 20, backgroundColor: "#fff" }}>
                    <Text style={{ fontWeight: "bold" }}>
                        Bước 1: Nhấp vào ô Tìm kiếm mã bưu chính
                    </Text>
                    <Image
                        style={{
                            marginVertical: 30,
                            height: 300,
                            width: Dimensions.get("window").width,
                        }}
                        source={require("../../assets/images/guide_3.png")}
                        resizeMode="contain"
                    />

                    <Text style={styles.description}>
                        a) Tra cứu Mã bưu chính khi có tên đối tượng gán mã
                        (phường/xã và đơn vị hành chính tương đương; điểm phục
                        vụ thuộc mạng bưu chính công cộng, mạng bưu chính phục
                        vụ cơ quan Đảng, Nhà nước; cơ quan đoàn thể của Việt
                        Nam; cơ quan ngoại giao và các tổ chức quốc tế tại Việt
                        Nam).
                    </Text>

                    <Text style={{ fontWeight: "bold", marginTop: 20 }}>
                        Bước 2: Tại ô "Tìm kiếm", nhập tên "Đối tượng gán mã"
                    </Text>

                    <Text style={styles.description}>Ví dụ 1: </Text>

                    <Text style={styles.description}>
                        + Tại ô "Tìm kiếm", nhập "Hội đồng nhân dân huyện Lộc Hà", thì kết quả
                        tra được Mã bưu chính của phường Lộc Hà, Hà Tĩnh là 45402.
                    </Text>

                    <Text style={styles.description}>
                        + Tại ô "Tìm kiếm", nhập "Tổng lãnh sự quán Thụy Sỹ",
                        thì kết quả tra được Mã bưu chính của Tổng lãnh sự quán
                        Thụy Sỹ là 70222.
                    </Text>
                    <Image
                        style={{
                            marginVertical: 30,
                            height: 300,
                            width: Dimensions.get("window").width,
                        }}
                        source={require("../../assets/images/guide_2.png")}
                        resizeMode="contain"
                    />

                    <Text style={styles.description}>
                        b) Tra cứu để xác định đối tượng gán mã khi có Mã bưu
                        chính
                    </Text>

                    <Text style={styles.description}>Ví dụ 2: </Text>

                    <Text style={styles.description}>
                        + Tại ô "Tìm kiếm", nhập "10046", thì kết quả tra được
                        đối tượng gán mã là Bộ thông tin và Truyền thông.
                    </Text>

                    <Text style={styles.description}>
                        + Tại ô "Tìm kiếm", nhập "90251", thì kết quả tra được
                        đối tượng gán mã là Bưu cục Mỹ Luông, huyện Chợ Mới,
                        tỉnh An Giang.
                    </Text>
                    <Image
                        style={{
                            marginVertical: 30,
                            height: 300,
                            width: Dimensions.get("window").width,
                        }}
                        source={require("../../assets/images/guide_1.png")}
                        resizeMode="contain"
                    />

                    <Text style={styles.title}>
                        Hướng dẫn cách ghi Mã bưu chính
                    </Text>

                    <Text style={styles.description}>
                        1. Địa chỉ người sử dụng dịch vụ bưu chính (người gửi và
                        người nhận) phải được thể hiện rõ ràng trên bưu gửi
                        (phong bì thư, kiện, gói hàng hóa) hoặc trên các ấn
                        phẩm, tài liệu liên quan.
                    </Text>

                    <Text style={styles.description}>
                        2. Mã bưu chính là một thành tố không thể thiếu trong
                        địa chỉ người sử dụng dịch vụ bưu chính (người gửi và
                        người nhận), được ghi tiếp theo sau tên tỉnh/ thành phố
                        và được phân cách với tên tỉnh/thành phố ít nhất 01 ký
                        tự trống.
                    </Text>

                    <Text style={styles.description}>
                        3. Mã bưu chính phải được in hoặc viết tay rõ ràng, dễ
                        đọc
                    </Text>

                    <Text style={[styles.description, { paddingBottom: 20 }]}>
                        4.Đối với bưu gửi có ô dành riêng cho Mã bưu chính ở
                        phần ghi địa chỉ người gửi, người nhận thì ghi rõ Mã bưu
                        chính, trong đó mỗi ô chỉ ghi một chữ số và các chữ số
                        phải được ghi rõ ràng, dễ đọc, không gạch xóa.
                    </Text>

                    <View style={{ paddingHorizontal: 2 }}>
                        <Text style={styles.description}>
                            Mẫu 1: Bưu gửi không có ô dành riêng cho Mã bưu
                            chính
                        </Text>
                        <Image
                            style={{
                                marginTop: 1,
                                height: 300,
                                width: Dimensions.get("window").width,
                            }}
                            resizeMode="contain"
                            source={require("../../assets/images/guide_letter_1.jpg")}
                        />
                        <Text style={[styles.description]}>
                            Mẫu 2: Bưu gửi có ô dành riêng cho Mã bưu chính
                        </Text>
                        <Image
                            style={{
                                height: 300,
                                width: Dimensions.get("window").width,
                            }}
                            resizeMode="contain"
                            source={require("../../assets/images/guide_letter_2.jpg")}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// STYLES
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#fff",
    },
    description: {
        paddingTop: 5,
    },
    title: {
        paddingTop: 5,
        fontWeight: "bold",
    },
});

function mapStateToProps(state) {
    return { infos: state.infos };
}

// keep this line at the end
export default connect(mapStateToProps, null)(GuideModalScreen);
