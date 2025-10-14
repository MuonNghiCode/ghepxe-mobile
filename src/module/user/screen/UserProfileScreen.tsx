import { Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../context/AuthContext";
import { useProfile } from "src/hooks/useProfile";
import { useUserInfo } from "src/components/UserAvatar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import LogoutButton from "src/components/LogoutButton";

export default function UserProfileScreen() {
  const { logout, user } = useAuth();
  const { profile, fetchProfile } = useProfile();
  const { userInfo, displayName, initials } = useUserInfo();
  const navigation = useNavigation();

  // Lấy thông tin user khi component mount
  useEffect(() => {
    if (!profile && user) {
      fetchProfile();
    }
  }, [user, profile, fetchProfile]);

  // Lấy thông tin user từ profile hoặc fallback sang user từ login
  const currentUserInfo = profile || user;

  // Format phone number
  const formatPhoneNumber = (phone: string | null | undefined) => {
    if (!phone) return "Chưa cập nhật";
    if (phone.length >= 7) {
      return phone.slice(0, 3) + "xxxxxxx";
    }
    return phone;
  };

  // Menu sections
  const menuSections = [
    {
      title: "Chức năng",
      items: [
        { id: "1", title: "Tạo đơn ghép mới", icon: "cube-outline" },
        { id: "2", title: "Đơn hàng đã ghép", icon: "archive-outline" },
        {
          id: "3",
          title: "Xác nhận & Biên nhận điện tử",
          icon: "document-text-outline",
        },
        { id: "4", title: "Theo dõi hành trình", icon: "eye-outline" },
      ],
    },
    {
      title: "Hàng thành viên & Ưu đãi",
      items: [
        { id: "5", title: "Ưu đãi hội viên", icon: "gift-outline" },
        { id: "6", title: "Hạng thành viên", icon: "star-outline" },
        { id: "7", title: "Giới thiệu bạn bè", icon: "people-outline" },
      ],
    },
    {
      title: "Cơ hội hợp tác",
      items: [
        { id: "8", title: "Đóng góp bản đồ", icon: "map-outline" },
        { id: "9", title: "Trở thành đối tác của GhepXe", icon: "car-outline" },
      ],
    },
    {
      title: "Trung tâm hỗ trợ",
      items: [
        { id: "10", title: "Liên hệ tư vấn hỗ trợ", icon: "headset-outline" },
        { id: "11", title: "Câu hỏi thường gặp", icon: "help-circle-outline" },
        {
          id: "12",
          title: "Trung tâm hỗ trợ",
          icon: "information-circle-outline",
        },
      ],
    },
    {
      title: "Cài đặt chung",
      items: [
        { id: "13", title: "Ngôn ngữ", icon: "language-outline" },
        {
          id: "14",
          title: "Đăng nhập & Bảo mật",
          icon: "lock-closed-outline",
        },
      ],
    },
  ];

  const handleMenuPress = (itemId: string) => {
    console.log(`Pressed item: ${itemId}`);

    // Xử lý navigation cho các menu items
    switch (itemId) {
      case "14": // Đăng nhập & Bảo mật - chuyển đến EditProfileScreen
        navigation.navigate("EditProfile" as never);
        break;
      case "1": // Tạo đơn ghép mới
        // navigation.navigate("CreateOrder" as never);
        break;
      case "2": // Đơn hàng đã ghép
        // navigation.navigate("OrderHistory" as never);
        break;
      // Thêm các case khác nếu cần
      default:
        console.log(`Menu item ${itemId} not implemented yet`);
    }
  };

  const handleAvatarPress = () => {
    navigation.navigate("EditProfile" as never);
  };

  // --- Render functions ---
  const renderUserAvatar = () => (
    <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.8}>
      <View style={tw`relative`}>
        <View
          style={tw`w-16 h-16 rounded-full border-2 border-[#00A982] bg-[#00A982] items-center justify-center`}
        >
          <Text style={tw`text-3xl font-bold text-white`}>{initials}</Text>
        </View>
        <View
          style={tw`absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-200`}
        >
          <Ionicons name="pencil" size={16} color="#00A982" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderUserInfo = () => (
    <View style={tw`ml-4 flex-1`}>
      <Text style={tw`text-lg font-semibold text-gray-800`}>{displayName}</Text>
      <View style={tw`flex-row items-center mt-1`}>
        <Text style={tw`text-gray-600 text-base`}>{currentUserInfo.phone}</Text>
        <View style={tw`h-4 w-px bg-gray-300 mx-3`} />
        <View
          style={tw`flex-row items-center bg-[#00A982] px-2 py-0.5 rounded-full`}
        >
          <Ionicons name="star" size={13} color="#fff" />
          <Text style={tw`text-white text-xs font-semibold ml-1`}>5.0</Text>
        </View>
      </View>

      {/* Hiển thị phone warning nếu chưa có */}
      {!currentUserInfo?.phone && (
        <TouchableOpacity
          style={tw`bg-orange-50 px-2 py-1 rounded mt-1`}
          onPress={handleAvatarPress}
        >
          <Text style={tw`text-orange-600 text-xs`}>
            Cập nhật số điện thoại →
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderUserHeader = () => (
    <View style={tw`bg-white px-5 pt-5 pb-2`}>
      <View style={tw`flex-row items-center`}>
        {renderUserAvatar()}
        {renderUserInfo()}
      </View>
    </View>
  );

  const renderCO2Section = () => (
    <View style={tw`bg-white px-5 mx-1 -mb-5.5 mt-5 relative`}>
      {/* Phần chữ */}
      <View style={tw`flex-1`}>
        <Text style={tw`text-gray-600 mb-1`}>Bạn đã góp phần giảm</Text>
        <View style={tw`flex-row items-end mb-1`}>
          <Text style={tw`text-2xl font-bold text-[#00A982]`}>
            {currentUserInfo?.shipRequestsCount || 0}
          </Text>
          <Text style={tw`text-lg font-bold text-[#00A982] ml-1`}>kg CO₂</Text>
        </View>
        <Text style={tw`text-gray-600 mb-2`}>ra môi trường</Text>
      </View>

      {/* Hình CO2 absolute ở cuối section */}
      <View
        style={tw`absolute -bottom-10 left-30 top-0 right-0 items-center z-10`}
      >
        <Image
          source={require("../../../assets/pictures/profile/co2.png")}
          style={tw`w-full h-32`}
          resizeMode="contain"
        />
      </View>
    </View>
  );

  const renderMenuItem = (item: any, index: number, isLast: boolean) => (
    <TouchableOpacity
      key={item.id}
      style={tw`flex-row items-center py-4 ${
        !isLast ? "border-b border-gray-100" : ""
      }`}
      onPress={() => handleMenuPress(item.id)}
      activeOpacity={0.7}
    >
      <Ionicons
        name={item.icon as any}
        size={24}
        color="#666"
        style={tw`mr-4`}
      />
      <Text style={tw`flex-1 text-base text-gray-700`}>{item.title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#00A982" />
    </TouchableOpacity>
  );

  const renderMenuSection = (section: any, sectionIndex: number) => (
    <View
      key={sectionIndex}
      style={tw`bg-white rounded-2xl mx-4 mb-4 px-5 py-3 border border-gray-200 ${
        sectionIndex === 0 ? "mt-16" : ""
      }`}
    >
      <Text style={tw`text-lg font-semibold text-gray-800 mb-3`}>
        {section.title}
      </Text>
      {section.items.map((item: any, index: number) =>
        renderMenuItem(item, index, index === section.items.length - 1)
      )}
    </View>
  );

  const renderMenuSections = () => (
    <>
      {menuSections.map((section, sectionIndex) =>
        renderMenuSection(section, sectionIndex)
      )}
    </>
  );

  const renderLogoutButton = () => (
    <View style={tw`mx-4 mb-8`}>
      <LogoutButton
        style={tw`p-4 bg-red-50 rounded-lg`}
        textStyle={tw`font-semibold`}
        showConfirm={true}
      />
    </View>
  );

  // Loading state
  if (!currentUserInfo) {
    return (
      <SafeAreaView style={tw`flex-1 bg-white items-center justify-center`}>
        <Ionicons name="person-circle-outline" size={64} color="#D1D5DB" />
        <Text style={tw`text-gray-500 mt-4`}>Đang tải thông tin...</Text>
      </SafeAreaView>
    );
  }

  // --- Main render ---
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView showsVerticalScrollIndicator={false} style={tw`pt-4`}>
        {renderUserHeader()}
        {renderCO2Section()}
        {renderMenuSections()}
        {renderLogoutButton()}
      </ScrollView>
    </SafeAreaView>
  );
}
