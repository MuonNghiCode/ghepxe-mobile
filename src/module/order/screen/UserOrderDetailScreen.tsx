import React, { useCallback, useRef, useState, useEffect } from "react";
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
import MapView, { Marker, Polyline } from "react-native-maps";
import {
  Order,
  OrderStatus,
  StatusConfig,
  OrderItem,
  UserOrderDetailScreenParams,
  Coordinate,
} from "src/types/order.interface";
import { LOCATIONIQ_API_KEY } from "@env";

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

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAP_HEIGHT = SCREEN_HEIGHT * 0.45;

const STATUS_IMAGE = {
  waiting: require("../../../assets/icons/pending.png"),
  delivering: require("../../../assets/icons/pending.png"),
  delivered: require("../../../assets/icons/complete.png"),
  cancelled: require("../../../assets/icons/cancelled.png"),
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function UserOrderDetailScreen() {
  const route = useRoute<UserOrderDetailScreenRouteProp>();
  const order = route.params?.order || route.params;
  const config = STATUS_CONFIG[order.orderStatus || "waiting"];
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

  const driver = {
    name: "Phạm Minh Quân",
    phone: "098.xxx.xxxx",
  };

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

  const getDirections = useCallback(async () => {
    try {
      const origin = `${order.pickupLongitude},${order.pickupLatitude}`;
      const destination = `${order.deliveryLongitude},${order.deliveryLatitude}`;

      const waypoints = getVietnameseWaypoints(
        order.pickupLatitude,
        order.pickupLongitude,
        order.deliveryLatitude,
        order.deliveryLongitude
      );

      let url;
      if (waypoints.length > 0) {
        const waypointStr = waypoints
          .map((wp) => `${wp.longitude},${wp.latitude}`)
          .join(";");
        url = `https://us1.locationiq.com/v1/directions/driving/${origin};${waypointStr};${destination}?key=${LOCATIONIQ_API_KEY}&steps=true&geometries=geojson&overview=full&exclude=ferry`;
      } else {
        url = `https://us1.locationiq.com/v1/directions/driving/${origin};${destination}?key=${LOCATIONIQ_API_KEY}&steps=true&geometries=geojson&overview=full&exclude=ferry`;
      }

      console.log("API URL:", url);

      const response = await fetch(url);
      const data = await response.json();

      console.log("API Response:", JSON.stringify(data, null, 2));

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];

        const distanceKm = (route.distance / 1000).toFixed(1);
        const durationHours = route.duration / 3600;

        let durationText;
        if (durationHours >= 1) {
          const hours = Math.floor(durationHours);
          const minutes = Math.round((durationHours - hours) * 60);
          durationText = minutes > 0 ? `${hours}h ${minutes}p` : `${hours}h`;
        } else {
          const minutes = Math.round(durationHours * 60);
          durationText = `${minutes} phút`;
        }

        setDistance(`${distanceKm} km`);
        setDuration(durationText);

        const coordinates = route.geometry.coordinates.map(
          (coord: number[]) => ({
            latitude: coord[1],
            longitude: coord[0],
          })
        );

        setRouteCoordinates(coordinates);
      } else {
        console.log("No routes found, using simplified route");
        createVietnameseRoute();
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
      createVietnameseRoute();
    }
  }, [
    order.pickupLatitude,
    order.pickupLongitude,
    order.deliveryLatitude,
    order.deliveryLongitude,
  ]);

  const getVietnameseWaypoints = (
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number
  ) => {
    const waypoints = [];

    const distance = Math.abs(fromLat - toLat);

    if (distance > 5) {
      if (fromLat > toLat) {
        waypoints.push(
          { latitude: 20.5, longitude: 106.0 },
          { latitude: 18.5, longitude: 105.8 },
          { latitude: 16.0, longitude: 108.2 },
          { latitude: 14.0, longitude: 109.0 },
          { latitude: 12.0, longitude: 109.2 }
        );
      } else {
        waypoints.push(
          { latitude: 12.0, longitude: 109.2 },
          { latitude: 14.0, longitude: 109.0 },
          { latitude: 16.0, longitude: 108.2 },
          { latitude: 18.5, longitude: 105.8 },
          { latitude: 20.5, longitude: 106.0 }
        );
      }
    }

    return waypoints;
  };

  const createVietnameseRoute = useCallback(() => {
    const pickup = {
      latitude: order.pickupLatitude,
      longitude: order.pickupLongitude,
    };
    const delivery = {
      latitude: order.deliveryLatitude,
      longitude: order.deliveryLongitude,
    };

    const route1APoints = [
      pickup,
      { latitude: 20.5, longitude: 106.0 },
      { latitude: 18.5, longitude: 105.8 },
      { latitude: 16.0, longitude: 108.2 },
      { latitude: 14.0, longitude: 109.0 },
      { latitude: 12.0, longitude: 109.2 },
      { latitude: 11.0, longitude: 108.0 },
      delivery,
    ];

    const filteredPoints = route1APoints.filter((point) => {
      if (pickup.latitude > delivery.latitude) {
        return (
          point.latitude <= pickup.latitude &&
          point.latitude >= delivery.latitude
        );
      } else {
        return (
          point.latitude >= pickup.latitude &&
          point.latitude <= delivery.latitude
        );
      }
    });

    setRouteCoordinates(filteredPoints);

    let totalDistance = 0;
    for (let i = 0; i < filteredPoints.length - 1; i++) {
      totalDistance += calculateDistance(
        filteredPoints[i].latitude,
        filteredPoints[i].longitude,
        filteredPoints[i + 1].latitude,
        filteredPoints[i + 1].longitude
      );
    }

    const estimatedHours = totalDistance / 50;

    let durationText;
    if (estimatedHours >= 1) {
      const hours = Math.floor(estimatedHours);
      const minutes = Math.round((estimatedHours - hours) * 60);
      durationText = minutes > 0 ? `${hours}h ${minutes}p` : `${hours}h`;
    } else {
      const minutes = Math.round(estimatedHours * 60);
      durationText = `${minutes} phút`;
    }

    setDistance(`${totalDistance.toFixed(0)} km`);
    setDuration(durationText);
  }, [order]);

  const fitMapToCoordinatesWithRoute = useCallback(() => {
    if (mapRef.current && routeCoordinates.length > 0) {
      const coordinates =
        routeCoordinates.length > 2
          ? routeCoordinates
          : [
              {
                latitude: order.pickupLatitude,
                longitude: order.pickupLongitude,
              },
              {
                latitude: order.deliveryLatitude,
                longitude: order.deliveryLongitude,
              },
            ];

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  }, [routeCoordinates, order]);

  useEffect(() => {
    getDirections();
  }, [getDirections]);

  useEffect(() => {
    if (routeCoordinates.length > 0) {
      setTimeout(() => {
        fitMapToCoordinatesWithRoute();
      }, 1000);
    }
  }, [routeCoordinates, fitMapToCoordinatesWithRoute]);

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

      {/* Map với Polyline */}
      <View style={tw`w-full`}>
        <MapView
          ref={mapRef}
          style={{ width: "100%", height: MAP_HEIGHT }}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={false}
          rotateEnabled={false}
          showsUserLocation={false}
          showsMyLocationButton={false}
        >
          {/* Marker điểm nhận */}
          <Marker
            coordinate={{
              latitude: order.pickupLatitude,
              longitude: order.pickupLongitude,
            }}
            pinColor="#000"
            title="Điểm nhận"
            description={order.pickupAddress}
          />

          {/* Marker điểm giao */}
          <Marker
            coordinate={{
              latitude: order.deliveryLatitude,
              longitude: order.deliveryLongitude,
            }}
            pinColor="#00A982"
            title="Điểm giao"
            description={order.deliveryAddress}
          />

          {/* Polyline đường đi với đường cong */}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#00A982"
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </MapView>

        {/* Icon trạng thái trên map */}
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
          <Image
            source={STATUS_IMAGE[order.orderStatus || "waiting"]}
            style={tw`w-6 h-6`}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Hiển thị distance và duration */}
        {(distance || duration) && (
          <View
            style={[
              tw`absolute left-4`,
              {
                bottom: 24,
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 8,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 4,
              },
            ]}
          >
            <Text style={tw`text-xs font-semibold text-black`}>
              {distance} • {duration}
            </Text>
          </View>
        )}
      </View>

      {/* ScrollView nội dung, KHÔNG absolute */}
      <ScrollView
        style={[
          tw`bg-gray-200 rounded-t-3xl`,
          { marginTop: -100 }, // để đè lên map, bo góc trên
        ]}
        contentContainerStyle={tw`pb-15`} // padding bottom lớn hơn chiều cao nút action
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

        {/* Mã đơn hàng + địa chỉ với thông tin thực */}
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
            1 điểm giao - {distance || "Đang tính..."} •{" "}
            {duration || "Đang tính..."}
          </Text>
          {/* Địa chỉ nhận với thông tin thực */}
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
                {order.pickupAddress}
              </Text>
              <Text style={tw`text-xs text-gray-500`}>
                {order.pickupContact} | {order.pickupPhone}
              </Text>
            </View>
          </View>
          {/* Địa chỉ giao với thông tin thực */}
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
                {order.deliveryAddress}
              </Text>
              <Text style={tw`text-xs text-gray-500`}>
                {order.deliveryContact} | {order.deliveryPhone}
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
