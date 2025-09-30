import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import tw from "twrnc";
import {
  Entypo,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";

type OrderStatus = "waiting" | "delivering" | "delivered" | "cancelled";

type Order = {
  productImage: any;
  productName: string;
  quantity: number;
  weight: string | number;
  price: string | number;
  pickupAddress: string;
  deliveryAddress: string;
  orderStatus: OrderStatus;
  // Add other fields if needed
};

type OrderDetailScreenRouteProp = RouteProp<
  { params: { order: Order } },
  "params"
>;

type StatusConfig = {
  header: string;
  icon: string;
  headerColor: string;
  showCancel: boolean;
  showReport: boolean;
  showReorder: boolean;
  showChat: boolean;
  showCall: boolean;
  statusText: string;
  statusColor: string;
  statusBg: string;
  buttonText: string;
  buttonColor: string;
  reportText?: string;
  reportColor?: string;
};

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  waiting: {
    header: "Đơn hàng của bạn đang được chờ tài xế",
    icon: "chatbubble-ellipses-outline",
    headerColor: "#00A982",
    showCancel: true,
    showReport: false,
    showReorder: false,
    showChat: true,
    showCall: true,
    statusText: "Đang chờ xác nhận",
    statusColor: "#6B6B6B",
    statusBg: "bg-gray-100",
    buttonText: "HỦY CHUYẾN",
    buttonColor: "#FF3B30",
  },
  delivering: {
    header: "Đơn hàng của bạn đang được giao",
    icon: "chatbubble-ellipses-outline",
    headerColor: "#00A982",
    showCancel: true,
    showReport: false,
    showReorder: false,
    showChat: true,
    showCall: true,
    statusText: "Đang giao",
    statusColor: "#00A982",
    statusBg: "bg-[#E6F7F3]",
    buttonText: "HỦY CHUYẾN",
    buttonColor: "#FF3B30",
  },
  delivered: {
    header: "Đơn hàng của bạn đã được giao thành công",
    icon: "checkmark-circle-outline",
    headerColor: "#00A982",
    showCancel: false,
    showReport: true,
    showReorder: true,
    showChat: false,
    showCall: false,
    statusText: "Đã hoàn thành",
    statusColor: "#00A982",
    statusBg: "bg-[#E6F7F3]",
    buttonText: "ĐẶT LẠI ĐƠN HÀNG",
    buttonColor: "#00A982",
    reportText: "BÁO CÁO ĐƠN HÀNG",
    reportColor: "#FF3B30",
  },
  cancelled: {
    header: "Đơn hàng của bạn đã được huỷ",
    icon: "close-circle-outline",
    headerColor: "#FF3B30",
    showCancel: false,
    showReport: true,
    showReorder: true,
    showChat: false,
    showCall: false,
    statusText: "Đã huỷ",
    statusColor: "#FF3B30",
    statusBg: "bg-gray-100",
    buttonText: "ĐẶT LẠI ĐƠN HÀNG",
    buttonColor: "#00A982",
    reportText: "BÁO CÁO ĐƠN HÀNG",
    reportColor: "#FF3B30",
  },
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAP_HEIGHT = SCREEN_HEIGHT * 0.45; // tăng chiều cao map

// Thêm ánh xạ trạng thái sang ảnh
const STATUS_IMAGE = {
  waiting: require("../../../assets/icons/pending.png"),
  delivering: require("../../../assets/icons/pending.png"),
  delivered: require("../../../assets/icons/complete.png"),
  cancelled: require("../../../assets/icons/cancelled.png"),
};

export default function OrderDetailScreen() {
  const route = useRoute<OrderDetailScreenRouteProp>();
  const order = route.params?.order || route.params;
  const config = STATUS_CONFIG[order.orderStatus || "waiting"];
  const navigation = useNavigation();

  // Mock data cho các phần còn lại
  const driver = { name: "Phạm Minh Quân", phone: "098.xxxx.xxx" };
  const items = [
    {
      name: "Paracetamol-Ratiopharm 500mg Tabletten 20 ST",
      quantity: 1,
      price: "100.000đ",
      status: "Xem bảo hiểm",
    },
    {
      name: "Gelomyrtol Forte 20 ST",
      quantity: 1,
      price: "100.000đ",
      status: "Xem bảo hiểm",
    },
    {
      name: "Aesop Resurrection",
      quantity: "0.5 kg",
      price: "100.000đ",
      status: "Xem bảo hiểm",
    },
  ];

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View
        style={tw`flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100`}
      >
        <TouchableOpacity
          onPress={handleGoBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={tw`w-10 h-10 items-center justify-center`}
        >
          <Ionicons name="chevron-back" size={24} color="#00A982" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold text-black flex-1 text-center`}>
          Chi tiết đơn hàng
        </Text>
        <View style={tw`w-10 h-10`} />
      </View>

      {/* Map */}
      <View style={tw`w-full`}>
        <MapView
          style={{ width: "100%", height: MAP_HEIGHT }}
          initialRegion={{
            latitude: 21.028511,
            longitude: 105.804817,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Marker
            coordinate={{ latitude: 21.028511, longitude: 105.804817 }}
            pinColor="#000"
          />
          <Marker
            coordinate={{ latitude: 21.028511, longitude: 105.814817 }}
            pinColor="#00A982"
          />
        </MapView>
        <TouchableOpacity
          style={[
            tw`absolute right-4`,
            {
              bottom: 24,
              backgroundColor: "#fff",
              borderRadius: 9999,
              padding: 8,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
          ]}
        >
          <Ionicons
            name={config.icon as any}
            size={22}
            color={config.headerColor}
          />
        </TouchableOpacity>
      </View>

      {/* ScrollView nội dung, KHÔNG absolute */}
      <ScrollView
        style={[tw`bg-gray-200 rounded-t-3xl`, { marginTop: -100 }]}
        contentContainerStyle={tw`pb-15`}
        showsVerticalScrollIndicator={false}
      >
        {/* Trạng thái đơn hàng + icon */}
        <View
          style={tw`bg-white px-4 py-4 mb-4 flex-row items-center justify-between border-b border-gray-200`}
        >
          <Text
            style={tw`text-base font-semibold text-black`}
            numberOfLines={1}
          >
            {config.header}
          </Text>
          <Image
            source={STATUS_IMAGE[order.orderStatus || "waiting"]}
            style={tw`w-10 h-10`}
            resizeMode="contain"
          />
        </View>

        {/* Mã đơn hàng + địa chỉ (chung 1 thành phần) */}
        <View style={tw`bg-white px-4 py-4 mb-4 border-b border-gray-200`}>
          <View style={tw`flex-row items-center mb-2`}>
            <Text style={tw`font-semibold text-black text-sm`}>
              Mã đơn hàng: #25HS16V3
            </Text>
            <TouchableOpacity style={tw`ml-2`}>
              <Ionicons name="copy-outline" size={16} color="#00A982" />
            </TouchableOpacity>
          </View>
          <Text style={tw`text-xs text-gray-500 mb-2`}>28/06/2025 | 21:54</Text>
          <Text style={tw`text-xs text-gray-500 mb-2`}>
            1 điểm giao - 100km
          </Text>
          {/* Địa chỉ nhận */}
          <View style={tw`flex-row items-center mb-3`}>
            <View
              style={tw`w-6 h-6 rounded-full bg-black items-center justify-center mr-2`}
            >
              <MaterialCommunityIcons
                name="stop"
                size={16}
                color="white"
                style={tw`bg-black rounded-full `}
              />
            </View>
            <View style={tw`flex-1 ml-2`}>
              <Text style={tw`font-semibold text-black`}>
                XV44+7R Thành Phố X
              </Text>
              <Text style={tw`text-xs text-gray-500`}>Tỉnh X, Vietnam</Text>
              <Text style={tw`text-xs text-gray-500`}>
                Nguyễn Văn A | 098xxxxxxx
              </Text>
            </View>
          </View>
          {/* Địa chỉ giao */}
          <View style={tw`flex-row items-center`}>
            <View
              style={tw`w-6 h-6 rounded-full bg-[#00A982] items-center justify-center mr-2`}
            >
              <Entypo
                name="arrow-down"
                size={16}
                color="#fff"
                style={tw`bg-[#00A982] rounded-full `}
              />
            </View>
            <View style={tw`flex-1 ml-2`}>
              <Text style={tw`font-semibold text-black`}>
                XV44+7R Thành Phố X
              </Text>
              <Text style={tw`text-xs text-gray-500`}>Tỉnh X, Vietnam</Text>
              <Text style={tw`text-xs text-gray-500`}>
                Nguyễn Văn B | 098xxxxxxx
              </Text>
            </View>
          </View>
        </View>

        {/* Tài xế */}
        <View
          style={tw`bg-white px-4 py-4 mb-4 flex-row items-center justify-between border-b border-gray-200`}
        >
          {/* Avatar tròn xám */}
          <View style={tw`w-8 h-8 rounded-full bg-gray-300 mr-3`} />
          {/* Thông tin tài xế */}
          <View style={tw`flex-1`}>
            <Text style={tw`font-semibold text-sm text-black`}>
              {driver.name}
            </Text>
            <Text style={tw`text-xs text-gray-500 mt-1`}>{driver.phone}</Text>
          </View>
          {/* Icon call & chat */}
          <View style={tw`flex-row items-center ml-3`}>
            {config.showCall && (
              <TouchableOpacity style={tw`mr-3`}>
                <Ionicons name="call-outline" size={20} color="#222" />
              </TouchableOpacity>
            )}
            {config.showChat && (
              <TouchableOpacity>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={20}
                  color="#222"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Loại đơn + Thông tin kiện hàng + Yêu cầu đặc biệt */}
        <View style={tw`bg-white px-4 py-4 mb-4`}>
          {/* Loại đơn */}
          <View style={tw`flex-row items-center mb-2`}>
            {/* Avatar tròn xám */}
            <View style={tw`w-8 h-8 rounded-full bg-gray-300 mr-3`} />
            <View style={tw`flex-1`}>
              <View style={tw`flex-row items-center`}>
                <Text style={tw`font-semibold text-black text-base`}>
                  Nội thành
                </Text>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color="#6B6B6B"
                  style={tw`ml-2`}
                />
              </View>
              <Text style={tw`text-xs text-gray-500 mt-1`}>
                đang chờ xác nhận
              </Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
            </TouchableOpacity>
          </View>

          {/* Thông tin kiện hàng header */}
          <View style={tw`flex-row items-center justify-between mt-2 mb-2`}>
            <Text style={tw`font-semibold text-sm text-black`}>
              Thông tin kiện hàng
            </Text>
            <Text style={tw`text-xs text-gray-500`}>
              Số lượng: {items.length}
            </Text>
          </View>
          {/* Danh sách kiện hàng */}
          {items.map((item, idx) => (
            <View
              key={idx}
              style={tw`flex-row items-center py-3 border-b border-gray-100`}
            >
              {/* Ảnh sản phẩm */}
              <Image
                source={require("../../../assets/pictures/home/ad1.png")}
                style={tw`w-12 h-12 rounded mr-3`}
                resizeMode="cover"
              />
              <View style={tw`flex-1`}>
                <Text style={tw`text-sm text-black`} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={tw`flex-row items-center mt-1`}>
                  <Text style={tw`text-xs text-gray-500 mr-2`}>
                    Số lượng: {item.quantity}
                  </Text>
                  <Text style={tw`text-xs text-gray-500 mr-2`}>100.000đ</Text>
                  <View style={tw`bg-[#00A982] rounded px-2 py-0.5`}>
                    <Text style={tw`text-xs text-white font-semibold`}>
                      10kg
                    </Text>
                  </View>
                </View>
                {/* Nút xem bảo hiểm */}
                <TouchableOpacity
                  style={tw`bg-[#E6F7F3] rounded px-3 py-1 mt-2 w-28`}
                >
                  <Text
                    style={tw`text-xs text-[#00A982] font-semibold text-center`}
                  >
                    Xem bảo hiểm
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={tw`text-sm text-black font-semibold ml-2`}>
                {item.price}
              </Text>
            </View>
          ))}

          {/* Yêu cầu đặc biệt */}
          <View style={tw`flex-row items-center py-3`}>
            <Ionicons name="shield" size={20} color="#0066FF" />
            <Text style={tw`ml-2 text-sm text-black`}>Hàng dễ vỡ</Text>
            <Text style={tw`ml-auto text-sm text-[#00A982] font-semibold`}>
              ₫10.000
            </Text>
          </View>

          {/* Phương thức thanh toán */}
          <View style={tw`flex-row items-center py-3 border-t border-gray-100`}>
            <FontAwesome6 name="money-bills" size={15} color="#00A982" />
            <Text style={tw`ml-2 text-sm text-black`}>
              Phương thức thanh toán
            </Text>
            <Text style={tw`ml-auto text-sm text-[#00A982] font-semibold`}>
              ₫110.000
            </Text>
            <TouchableOpacity style={tw`ml-2`}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color="#6B6B6B"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Nút action absolute */}
      <View
        style={tw`absolute bottom-0 left-0 right-0 bg-white px-4 pb-6 pt-3 flex-row justify-center`}
      >
        {config.showCancel && (
          <TouchableOpacity
            style={tw`flex-1 bg-[#FF3B30] rounded-xl py-3 mx-1 shadow items-center`}
            activeOpacity={0.85}
          >
            <Text style={tw`text-white font-bold text-base`}>
              {config.buttonText}
            </Text>
          </TouchableOpacity>
        )}
        {config.showReorder && (
          <TouchableOpacity
            style={tw`flex-1 bg-[#00A982] rounded-xl py-3 mx-1 shadow items-center`}
            activeOpacity={0.85}
          >
            <Text style={tw`text-white font-bold text-base`}>
              {config.buttonText}
            </Text>
          </TouchableOpacity>
        )}
        {config.showReport && (
          <TouchableOpacity
            style={tw`flex-1 bg-[#FF3B30] rounded-xl py-3 mx-1 shadow items-center`}
            activeOpacity={0.85}
          >
            <Text style={tw`text-white font-bold text-base`}>
              {config.reportText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
