import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

interface OrderCardProps {
  order: {
    id: string;
    customerName?: string;
    rating?: number;
    requestTime?: string;
    pickup: {
      address: string;
      details: string;
    };
    delivery: {
      address: string;
      distance?: string;
    };
    price: string;
    co2Reduction?: string;
    status: string;
    serviceType: "single" | "shared";
  };
  onAccept?: (orderId: string) => void;
  onContact?: (orderId: string) => void;
  showCustomerInfo?: boolean;
  variant?: "suggestion" | "current";
}

export default function OrderCard({
  order,
  onAccept,
  onContact,
  showCustomerInfo = true,
  variant = "suggestion",
}: OrderCardProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "CHỜ XÁC NHẬN":
        return "bg-orange-100 text-orange-600";
      case "ĐANG GIAO":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getServiceInfo = (serviceType: string) => {
    switch (serviceType) {
      case "single":
        return {
          icon: "cube-outline",
          name: "Đơn lẻ",
          bgColor: "bg-blue-100",
          iconColor: "#3B82F6",
        };
      case "shared":
        return {
          icon: "albums-outline",
          name: "Đơn ghép",
          bgColor: "bg-purple-100",
          iconColor: "#8B5CF6",
        };
      default:
        return {
          icon: "cube-outline",
          name: "Đơn lẻ",
          bgColor: "bg-blue-100",
          iconColor: "#3B82F6",
        };
    }
  };

  const getTimeNote = (status: string, requestTime: string) => {
    switch (status) {
      case "CHỜ XÁC NHẬN":
        return `Yêu cầu: ${requestTime}`;
      case "ĐANG GIAO":
        return `Đã nhận: ${requestTime}`;
      default:
        return `Yêu cầu: ${requestTime}`;
    }
  };

  const serviceInfo = getServiceInfo(order.serviceType);

  const shadowStyle = {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  };

  return (
    <View style={[tw`bg-white rounded-xl p-4 mb-3`, shadowStyle]}>
      <View style={tw`flex-row items-center justify-between mb-3`}>
        <View style={tw`flex-row items-center flex-1`}>
          <View
            style={tw`w-10 h-10 ${serviceInfo.bgColor} rounded-full items-center justify-center mr-3`}
          >
            <Ionicons
              name={serviceInfo.icon as any}
              size={20}
              color={serviceInfo.iconColor}
            />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`font-semibold text-gray-800 text-base`}>
              {serviceInfo.name}
            </Text>
            {order.requestTime && (
              <Text style={tw`text-xs text-gray-500`}>
                {getTimeNote(order.status, order.requestTime)}
              </Text>
            )}
          </View>
        </View>
        <View
          style={tw`px-3 py-1 rounded-full ${getStatusStyle(order.status)}`}
        >
          <Text style={tw`text-xs font-semibold`}>{order.status}</Text>
        </View>
      </View>
      <View style={tw`flex-row items-center mb-3`}>
        <View
          style={tw`w-6 h-6 bg-green-100 rounded-lg items-center justify-center mr-2`}
        >
          <Ionicons name="cube-outline" size={14} color="#00A982" />
        </View>
        <Text style={tw`text-xs text-gray-600 flex-1`} numberOfLines={1}>
          {order.pickup.details}
        </Text>
      </View>
      <View style={tw`mb-3`}>
        <View style={tw`flex-row items-center mb-2 bg-gray-50 p-3 rounded-lg`}>
          <View style={tw`flex-1`}>
            <Text
              style={tw`font-semibold text-gray-800 text-sm`}
              numberOfLines={1}
            >
              {order.pickup.address}
            </Text>
          </View>
          <View style={tw`items-center mx-3`}>
            {order.delivery.distance && (
              <Text style={tw`text-xs text-gray-500 mb-1`}>
                {order.delivery.distance}
              </Text>
            )}
            <View style={tw`flex-row items-center`}>
              <View style={tw`w-2 h-2 bg-[#00A982] rounded-full`} />
              <View style={tw`w-6 h-px bg-[#00A982] mx-1`} />
              <Ionicons name="arrow-forward" size={12} color="#00A982" />
            </View>
          </View>
          <View style={tw`flex-1`}>
            <Text
              style={tw`font-semibold text-gray-800 text-sm`}
              numberOfLines={1}
            >
              {order.delivery.address}
            </Text>
          </View>
        </View>
      </View>
      <View style={tw`flex-row justify-between items-center mb-3`}>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`text-sm text-gray-600 mr-1`}>Thu nhập:</Text>
          <Text style={tw`text-lg font-bold text-green-600`}>
            {order.price}
          </Text>
        </View>

        {order.co2Reduction && (
          <View style={tw`flex-row items-center`}>
            <Ionicons name="sync-outline" size={14} color="#00A982" />
            <Text
              style={tw`text-xs text-[#00A982] ml-1 font-medium`}
              numberOfLines={1}
            >
              Giảm 12kg CO₂
            </Text>
          </View>
        )}
      </View>
      {order.status === "CHỜ XÁC NHẬN" && (
        <View style={tw`flex-row gap-2`}>
          <TouchableOpacity
            style={tw`flex-1 bg-[#00A982] rounded-lg py-3`}
            onPress={() => onAccept?.(order.id)}
          >
            <Text style={tw`text-white text-center font-semibold text-sm`}>
              Nhận đơn
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-1 border border-[#00A982] rounded-lg py-3`}
            onPress={() => onContact?.(order.id)}
          >
            <Text style={tw`text-[#00A982] text-center font-semibold text-sm`}>
              Liên hệ
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {order.status === "ĐANG GIAO" && (
        <TouchableOpacity
          style={tw`bg-[#00A982] rounded-lg py-3`}
          onPress={() => onAccept?.(order.id)}
        >
          <Text style={tw`text-white text-center font-semibold text-sm`}>
            Cập nhật
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
