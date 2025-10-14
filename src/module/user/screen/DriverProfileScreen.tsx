import {
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import tw from "twrnc";
import { useAuth } from "../../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function DriverProfileScreen() {
  const { logout } = useAuth();

  // Giả lập dữ liệu user
  const user = {
    name: "Phạm Minh Quân",
    phone: "037xxxxxxx",
    avatar: null,
    rating: 5.0,
    co2: "xx",
  };

  // Lấy chữ cái đầu của tên user
  const getInitial = (name: string) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    return parts[parts.length - 1][0]?.toUpperCase() || "";
  };

  // Menu sections
  const menuSections = [
    {
      title: "Chức năng",
      items: [
        { id: "1", title: "Quản lý chuyến xe", icon: "car-outline" },
        { id: "2", title: "Đơn hàng đã ghép", icon: "archive-outline" },
        {
          id: "3",
          title: "Xác nhận & Biên nhận điện tử",
          icon: "document-text-outline",
        },
        { id: "4", title: "Theo dõi hành trình", icon: "eye-outline" },
        {
          id: "5",
          title: "Thu nhập & khí thải tiết kiệm",
          icon: "leaf-outline",
        },
      ],
    },
    {
      title: "Tài khoản & cài đặt",
      items: [{ id: "6", title: "Thông tin tài xế", icon: "person-outline" }],
    },

    {
      title: "Trung tâm hỗ trợ",
      items: [
        { id: "7", title: "Liên hệ tư vấn hỗ trợ", icon: "headset-outline" },
        { id: "8", title: "Câu hỏi thường gặp", icon: "help-circle-outline" },
        {
          id: "9",
          title: "Trung tâm hỗ trợ",
          icon: "information-circle-outline",
        },
      ],
    },
    {
      title: "Cài đặt chung",
      items: [
        { id: "10", title: "Ngôn ngữ", icon: "language-outline" },
        {
          id: "11",
          title: "Điều khoản & Bảo mật",
          icon: "shield-checkmark-outline",
        },
      ],
    },
  ];

  const handleMenuPress = (itemId: string) => {
    console.log(`Pressed item: ${itemId}`);
    // Xử lý navigation tại đây
  };

  // --- Render functions ---
  const renderUserAvatar = () => (
    <View>
      {user.avatar ? (
        <Image
          source={user.avatar}
          style={tw`w-16 h-16 rounded-full border-2 border-[#00A982]`}
        />
      ) : (
        <View
          style={tw`w-16 h-16 rounded-full border-2 border-[#00A982] bg-gray-200 items-center justify-center`}
        >
          <Text style={tw`text-3xl font-bold text-[#00A982]`}>
            {getInitial(user.name)}
          </Text>
        </View>
      )}
      <TouchableOpacity
        style={tw`absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-200`}
        activeOpacity={0.7}
      >
        <Ionicons name="pencil" size={16} color="#00A982" />
      </TouchableOpacity>
    </View>
  );

  const renderUserInfo = () => (
    <View style={tw`ml-4 flex-1`}>
      <Text style={tw`text-lg font-semibold text-gray-800`}>{user.name}</Text>
      <View style={tw`flex-row items-center mt-1`}>
        <Text style={tw`text-gray-600 text-base`}>{user.phone}</Text>
        <View style={tw`h-4 w-px bg-gray-300 mx-3`} />
        <View
          style={tw`flex-row items-center bg-[#00A982] px-2 py-0.5 rounded-full`}
        >
          <Ionicons name="star" size={13} color="#fff" />
          <Text style={tw`text-white text-xs font-semibold ml-1`}>
            {user.rating.toFixed(1)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderUserHeader = () => (
    <View style={tw`bg-white px-5 pt-5 pb-2 `}>
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
          <Text style={tw`text-2xl font-bold text-[#00A982]`}>{user.co2}</Text>
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
      <TouchableOpacity
        style={tw`bg-red-500 rounded-2xl py-3 border border-red-600`}
        onPress={logout}
        activeOpacity={0.8}
      >
        <Text style={tw`text-white text-center text-base font-semibold`}>
          Đăng xuất
        </Text>
      </TouchableOpacity>
    </View>
  );

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
