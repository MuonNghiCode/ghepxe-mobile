import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
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
import { OrderMap } from "src/components/OrderMap";
import {
  OrderStatus,
  StatusConfig,
  UserOrderDetailScreenParams,
} from "src/types/order.interface";
import { ShipRequestResponseData } from "src/types";

type UserOrderDetailScreenRouteProp = RouteProp<
  { params: UserOrderDetailScreenParams },
  "params"
>;

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

const STATUS_IMAGE = {
  waiting: require("../../../../assets/icons/pending.png"),
  delivering: require("../../../../assets/icons/pending.png"),
  delivered: require("../../../../assets/icons/complete.png"),
  cancelled: require("../../../../assets/icons/cancelled.png"),
};

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  Personal: { label: "Hàng cá nhân", icon: "person-outline", color: "#3B82F6" },
  Business: {
    label: "Hàng doanh nghiệp",
    icon: "briefcase-outline",
    color: "#00A982",
  },
};

const PRODUCT_TYPE_CONFIG: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  "Thời trang": {
    label: "Thời trang",
    icon: "shirt-outline",
    color: "#A855F7",
  },
  "Điện tử": { label: "Điện tử", icon: "laptop-outline", color: "#F59E42" },
  "Mỹ phẩm": { label: "Mỹ phẩm", icon: "leaf-outline", color: "#F472B6" },
  "Thực phẩm": {
    label: "Thực phẩm",
    icon: "fast-food-outline",
    color: "#22D3EE",
  },
  "Sách vở": { label: "Sách vở", icon: "book-outline", color: "#FBBF24" },
  "Đồ gia dụng": {
    label: "Đồ gia dụng",
    icon: "home-outline",
    color: "#F87171",
  },
  "Đồ chơi": {
    label: "Đồ chơi",
    icon: "game-controller-outline",
    color: "#34D399",
  },
  "Thể thao": {
    label: "Thể thao",
    icon: "basketball-outline",
    color: "#F59E42",
  },
  "Nội thất": { label: "Nội thất", icon: "bed-outline", color: "#A3E635" },
  "Trang sức": {
    label: "Trang sức",
    icon: "diamond-outline",
    color: "#F472B6",
  },
};

const SPECIAL_REQUEST_CONFIG = [
  {
    key: "returnDelivery",
    label: "Giao hàng về",
    icon: "arrow-undo-outline",
    color: "#F59E42",
  },
  {
    key: "loading",
    label: "Bốc hàng",
    icon: "cube-outline",
    color: "#34D399",
  },
  {
    key: "driverAssistance",
    label: "Hỗ trợ tài xế",
    icon: "hand-left-outline",
    color: "#A855F7",
  },
  {
    key: "smsNotification",
    label: "Nhắn tin SMS",
    icon: "chatbubble-outline",
    color: "#3B82F6",
  },
  {
    key: "electronicInvoice",
    label: "Hóa đơn điện tử",
    icon: "document-text-outline",
    color: "#F472B6",
  },
];

export default function UserOrderDetailScreen() {
  const route = useRoute<UserOrderDetailScreenRouteProp>();
  const navigation = useNavigation();

  const [orderData, setOrderData] = useState<ShipRequestResponseData | null>(
    route.params?.orderData || null
  );

  const shipRequestId = route.params?.shipRequestId || route.params?.id;

  useEffect(() => {
    console.log("Route params:", route.params);
    console.log("Order data:", orderData);
  }, [route.params, orderData]);

  const getOrderStatus = (): OrderStatus => {
    return (route.params?.orderStatus as OrderStatus) || "waiting";
  };

  const config = STATUS_CONFIG[getOrderStatus()];

  const driver = {
    name: "Phạm Minh Quân",
    phone: "098.xxx.xxxx",
  };

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Tính tổng giá trị đơn hàng
  const calculateTotalPrice = () => {
    if (!orderData?.items) return 0;
    return orderData.items.length * 55000;
  };

  const renderHeader = () => (
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
  );

  const renderOrderMap = () => {
    if (!orderData) return null;

    try {
      const pickupLat = Number(orderData.pickupLatitude);
      const pickupLng = Number(orderData.pickupLongitude);
      const dropoffLat = Number(orderData.dropoffLatitude);
      const dropoffLng = Number(orderData.dropoffLongitude);

      if (
        isNaN(pickupLat) ||
        isNaN(pickupLng) ||
        isNaN(dropoffLat) ||
        isNaN(dropoffLng) ||
        pickupLat === 0 ||
        pickupLng === 0 ||
        dropoffLat === 0 ||
        dropoffLng === 0
      ) {
        return (
          <View style={tw`h-60 bg-gray-200 items-center justify-center`}>
            <Ionicons name="map-outline" size={48} color="#9CA3AF" />
            <Text style={tw`mt-2 text-gray-500 text-sm`}>
              Không có thông tin bản đồ
            </Text>
          </View>
        );
      }

      return (
        <OrderMap
          pickupCoordinates={{
            latitude: pickupLat,
            longitude: pickupLng,
          }}
          deliveryCoordinates={{
            latitude: dropoffLat,
            longitude: dropoffLng,
          }}
          pickupAddress={orderData.pickupAddress}
          deliveryAddress={orderData.dropoffAddress}
          orderStatus={getOrderStatus()}
          statusImage={STATUS_IMAGE[getOrderStatus()]}
          enableVietnameseRoute={true}
          orderType="single"
        />
      );
    } catch (error) {
      console.error("Error rendering map:", error);
      return (
        <View style={tw`h-60 bg-gray-200 items-center justify-center`}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
          <Text style={tw`mt-2 text-red-500 text-sm`}>Lỗi hiển thị bản đồ</Text>
        </View>
      );
    }
  };

  const renderStatusSection = () => (
    <View
      style={tw`bg-white px-4 py-4 mb-4 flex-row items-center justify-between border-b border-gray-200`}
    >
      <Text
        style={tw`text-base font-semibold text-black flex-1`}
        numberOfLines={2}
      >
        {config.header}
      </Text>
      <Image
        source={STATUS_IMAGE[getOrderStatus()]}
        style={tw`w-10 h-10 ml-2`}
        resizeMode="contain"
      />
    </View>
  );

  const renderOrderInfoSection = () => {
    if (!orderData) return null;

    const category =
      CATEGORY_CONFIG[orderData.itemCategory] || CATEGORY_CONFIG["Personal"];
    const productType = PRODUCT_TYPE_CONFIG[orderData.itemType] || {
      label: orderData.itemType,
      icon: "cube-outline",
      color: "#6B7280",
    };

    return (
      <View style={tw`bg-white px-4 py-4 mb-4 border-b border-gray-200`}>
        {/* Mã đơn hàng */}
        <View style={tw`flex-row items-center mb-2`}>
          <Text style={tw`font-semibold text-black text-sm`}>
            Mã đơn hàng: #{orderData.shipRequestId.slice(0, 8).toUpperCase()}
          </Text>
          <TouchableOpacity style={tw`ml-2`}>
            <Ionicons name="copy-outline" size={16} color="#00A982" />
          </TouchableOpacity>
        </View>

        {/* Thời gian */}
        <Text style={tw`text-xs text-gray-500 mb-3`}>
          {new Date(orderData.pickupWindowStart).toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>

        {/* Địa chỉ lấy hàng */}
        <View style={tw`flex-row items-start mb-3`}>
          <View
            style={tw`w-6 h-6 rounded-full bg-black items-center justify-center mr-2 mt-1`}
          >
            <MaterialCommunityIcons name="stop" size={16} color="white" />
          </View>
          <View style={tw`flex-1 ml-2`}>
            <Text style={tw`font-semibold text-black text-sm`}>
              Điểm lấy hàng
            </Text>
            <Text style={tw`text-xs text-gray-600 mt-1`}>
              {orderData.pickupAddress}
            </Text>
          </View>
        </View>

        {/* Địa chỉ giao hàng */}
        <View style={tw`flex-row items-start mb-3`}>
          <View
            style={tw`w-6 h-6 rounded-full bg-[#00A982] items-center justify-center mr-2 mt-1`}
          >
            <Entypo name="arrow-down" size={16} color="#fff" />
          </View>
          <View style={tw`flex-1 ml-2`}>
            <Text style={tw`font-semibold text-black text-sm`}>
              Điểm giao hàng
            </Text>
            <Text style={tw`text-xs text-gray-600 mt-1`}>
              {orderData.dropoffAddress}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderDriverSection = () => {
    if (!orderData) return null;

    // Nếu có driver thì hiển thị thông tin driver từ API
    if (orderData.driverId && orderData.driverName) {
      return (
        <View
          style={tw`bg-white px-4 py-4 mb-4 flex-row items-center justify-between border-b border-gray-200`}
        >
          {/* Avatar */}
          {orderData.driverAvatarUrl ? (
            <Image
              source={{ uri: orderData.driverAvatarUrl }}
              style={tw`w-12 h-12 rounded-full mr-3`}
            />
          ) : (
            <View
              style={tw`w-12 h-12 rounded-full bg-gray-300 mr-3 items-center justify-center`}
            >
              <Ionicons name="person" size={24} color="#6B6B6B" />
            </View>
          )}

          {/* Driver info */}
          <View style={tw`flex-1`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`font-semibold text-sm text-black`}>
                {orderData.driverName}
              </Text>
              {orderData.driverRating && (
                <View style={tw`flex-row items-center ml-2`}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={tw`text-xs text-gray-600 ml-1`}>
                    {orderData.driverRating.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>
            {orderData.driverPhone && (
              <Text style={tw`text-xs text-gray-500 mt-1`}>
                {orderData.driverPhone}
              </Text>
            )}
          </View>

          {/* Actions */}
          <View style={tw`flex-row items-center ml-3`}>
            {config.showCall && orderData.driverPhone && (
              <TouchableOpacity style={tw`mr-3`}>
                <Ionicons name="call-outline" size={22} color="#222" />
              </TouchableOpacity>
            )}
            {config.showChat && (
              <TouchableOpacity>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={22}
                  color="#222"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }

    // Nếu chưa có driver (status = pending)
    return (
      <View style={tw`bg-white px-4 py-4 mb-4 border-b border-gray-200`}>
        <View style={tw`flex-row items-center`}>
          <View
            style={tw`w-12 h-12 rounded-full bg-gray-200 mr-3 items-center justify-center`}
          >
            <Ionicons name="person-outline" size={24} color="#9CA3AF" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`font-semibold text-sm text-black`}>
              Đang tìm tài xế
            </Text>
            <Text style={tw`text-xs text-gray-500 mt-1`}>
              Vui lòng đợi trong giây lát
            </Text>
          </View>
          <ActivityIndicator size="small" color="#00A982" />
        </View>
      </View>
    );
  };

  const renderItemsSection = () => {
    if (!orderData?.items || orderData.items.length === 0) return null;

    const category =
      CATEGORY_CONFIG[orderData.itemCategory] || CATEGORY_CONFIG["Personal"];
    const productType = PRODUCT_TYPE_CONFIG[orderData.itemType] || {
      label: orderData.itemType,
      icon: "cube-outline",
      color: "#6B7280",
    };

    return (
      <View style={tw`bg-white px-4 py-4 mb-4`}>
        {/* Header */}
        <View style={tw`flex-row items-center justify-between mb-3`}>
          <Text style={tw`font-semibold text-black text-base`}>
            Thông tin kiện hàng
          </Text>
          <Text style={tw`text-xs text-gray-500`}>
            Số lượng: {orderData.items.length}
          </Text>
        </View>

        {/* Loại hàng hóa, loại sản phẩm, loại dịch vụ - nằm ngang, không xuống hàng */}
        <View style={tw`flex-row items-center mb-3`}>
          <View
            style={tw`flex-row items-center bg-blue-50 rounded-full px-3 py-1 mr-2`}
          >
            {/* <Ionicons
              name={category.icon as any}
              size={16}
              color={category.color}
            /> */}
            <Text
              style={[
                tw`ml-1 text-xs font-semibold`,
                { color: category.color },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {category.label}
            </Text>
          </View>
          <View
            style={tw`flex-row items-center bg-purple-50 rounded-full px-3 py-1 mr-2`}
          >
            {/* <Ionicons
              name={productType.icon as any}
              size={16}
              color={productType.color}
            /> */}
            <Text
              style={[
                tw`ml-1 text-xs font-semibold`,
                { color: productType.color },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {productType.label}
            </Text>
          </View>
          <View style={tw`bg-orange-100 rounded-full px-3 py-1`}>
            <Text
              style={tw`text-xs text-orange-600 font-semibold`}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {orderData.shipType}
            </Text>
          </View>
        </View>

        {/* Danh sách kiện hàng */}
        {orderData.items.map((item, idx) => (
          <View
            key={item.itemId}
            style={tw`py-3 ${
              idx < orderData.items.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <View style={tw`flex-row items-start`}>
              {/* Image */}
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={tw`w-16 h-16 rounded-lg mr-3`}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={tw`w-16 h-16 rounded-lg bg-gray-200 mr-3 items-center justify-center`}
                >
                  <Ionicons name="cube-outline" size={32} color="#9CA3AF" />
                </View>
              )}

              {/* Item info */}
              <View style={tw`flex-1`}>
                <Text
                  style={tw`text-sm font-semibold text-black`}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>

                {item.description && (
                  <Text
                    style={tw`text-xs text-gray-500 mt-1`}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                )}

                <View style={tw`flex-row items-center mt-2 flex-wrap`}>
                  <View style={tw`flex-row items-center mr-3`}>
                    <Text style={tw`text-xs text-gray-500`}>SL: </Text>
                    <Text style={tw`text-xs text-black font-semibold`}>
                      {item.amount}
                    </Text>
                  </View>

                  <View style={tw`bg-[#E6F7F3] rounded-full px-2 py-1 mr-2`}>
                    <Text style={tw`text-xs text-[#00A982] font-semibold`}>
                      {item.weight}kg
                    </Text>
                  </View>

                  {item.size && (
                    <View style={tw`bg-blue-100 rounded-full px-2 py-1`}>
                      <Text style={tw`text-xs text-blue-600 font-semibold`}>
                        {item.size}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Yêu cầu đặc biệt */}
        {renderSpecialRequestSection()}

        {/* Tổng cộng */}
        <View
          style={tw`flex-row items-center justify-between py-4 border-t border-gray-200 mt-4`}
        >
          <Text style={tw`text-base font-semibold text-black`}>Tổng cộng</Text>
          <Text style={tw`text-xl text-[#00A982] font-bold`}>
            ₫{calculateTotalPrice().toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  const renderFooterActions = () => (
    <View
      style={tw`absolute bottom-0 left-0 right-0 bg-white px-4 pb-6 pt-3 border-t border-gray-200`}
    >
      <View style={tw`flex-row gap-2`}>
        {config.showCancel && (
          <TouchableOpacity
            style={tw`flex-1 bg-[#FF3B30] rounded-xl py-3 shadow items-center`}
            activeOpacity={0.85}
          >
            <Text style={tw`text-white font-bold text-base`}>
              {config.buttonText}
            </Text>
          </TouchableOpacity>
        )}
        {config.showReorder && (
          <TouchableOpacity
            style={tw`flex-1 bg-[#00A982] rounded-xl py-3 shadow items-center`}
            activeOpacity={0.85}
          >
            <Text style={tw`text-white font-bold text-base`}>
              {config.buttonText}
            </Text>
          </TouchableOpacity>
        )}
        {config.showReport && (
          <TouchableOpacity
            style={tw`flex-1 border-2 border-[#FF3B30] rounded-xl py-3 shadow items-center`}
            activeOpacity={0.85}
          >
            <Text style={tw`text-[#FF3B30] font-bold text-base`}>
              {config.reportText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderSpecialRequestSection = () => {
    if (!orderData?.specialRequest) return null;

    const activeRequests = SPECIAL_REQUEST_CONFIG.filter(
      (req) =>
        orderData.specialRequest?.[
          req.key as keyof typeof orderData.specialRequest
        ]
    );

    return (
      <View style={tw`mt-4 pt-4 border-t border-gray-200`}>
        <Text style={tw`text-sm font-semibold text-black mb-2`}>
          Yêu cầu đặc biệt
        </Text>
        {activeRequests.length === 0 ? (
          <Text style={tw`text-xs text-gray-500`}>
            Không có yêu cầu đặc biệt
          </Text>
        ) : (
          <View style={tw`flex-row flex-wrap gap-2`}>
            {activeRequests.map((req) => (
              <View
                key={req.key}
                style={tw`flex-row items-center bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2`}
              >
                <Ionicons name={req.icon as any} size={14} color={req.color} />
                <Text style={[tw`ml-1 text-xs`, { color: req.color }]}>
                  {req.label}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Error state
  if (!orderData) {
    return (
      <SafeAreaView style={tw`flex-1 bg-white`}>
        {renderHeader()}
        <View style={tw`flex-1 items-center justify-center px-4`}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
          <Text style={tw`mt-4 text-lg font-semibold text-black`}>
            Không tìm thấy đơn hàng
          </Text>
          <Text style={tw`mt-2 text-sm text-gray-500 text-center`}>
            Đơn hàng không tồn tại hoặc chưa được tải
          </Text>
          <TouchableOpacity
            style={tw`mt-6 bg-[#00A982] rounded-xl px-6 py-3`}
            onPress={handleGoBack}
          >
            <Text style={tw`text-white font-bold`}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main render
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {renderHeader()}
      {renderOrderMap()}
      <ScrollView
        style={[tw`bg-gray-50 rounded-t-3xl`, { marginTop: -32 }]}
        contentContainerStyle={tw`pb-24`}
        showsVerticalScrollIndicator={false}
      >
        {renderStatusSection()}
        {renderOrderInfoSection()}
        {renderDriverSection()}
        {renderItemsSection()}
      </ScrollView>
      {renderFooterActions()}
    </SafeAreaView>
  );
}
