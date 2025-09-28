import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

interface PaymentDetailOverlayProps {
  visible: boolean;
  baseFee: number;
  specialRequests: { label: string; value: string }[];
  selectedRequests: string[];
  totalFee: number;
  onClose: () => void;
}

const PaymentDetailOverlay: React.FC<PaymentDetailOverlayProps> = ({
  visible,
  baseFee,
  specialRequests,
  selectedRequests,
  totalFee,
  onClose,
}) => {
  if (!visible) return null;

  const selectedSpecials = specialRequests.filter((item) =>
    selectedRequests.includes(item.label)
  );

  return (
    <View
      style={[
        tw`absolute top-0 left-0 right-0 bottom-0 bg-black/40 items-center justify-center`,
        { zIndex: 999 },
      ]}
    >
      <View style={tw`bg-white rounded-3xl p-6 w-11/12 shadow-xl`}>
        {/* Header */}
        <View style={tw`flex-row items-center justify-center mb-6`}>
          <Ionicons name="card-outline" size={22} color="#00A982" />
          <Text style={tw`ml-2 text-lg font-bold text-black`}>
            Chi tiết thanh toán
          </Text>
        </View>

        {/* Phí giao hàng */}
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <Text style={tw`text-base text-gray-700`}>Phí giao hàng</Text>
          <Text style={tw`text-base text-black font-semibold`}>
            ₫{baseFee.toLocaleString()}
          </Text>
        </View>

        {/* Phí yêu cầu đặc biệt */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-base font-medium text-gray-700 mb-2`}>
            Phí yêu cầu đặc biệt
          </Text>
          {selectedSpecials.length === 0 ? (
            <Text style={tw`text-sm text-gray-400`}>Không có</Text>
          ) : (
            selectedSpecials.map((item) => (
              <View
                key={item.label}
                style={tw`flex-row justify-between items-center mb-2`}
              >
                <Text style={tw`text-sm text-gray-600`}>{item.label}</Text>
                <Text style={tw`text-sm text-black font-medium`}>
                  {parseInt(item.value.replace(/\D/g, ""), 10).toLocaleString()}
                  ₫
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Tổng phí */}
        <View style={tw`border-t border-gray-200 pt-5 mb-6`}>
          <Text style={tw`text-2xl text-[#00A982] font-bold text-center`}>
            ₫{totalFee.toLocaleString()}
          </Text>
          <Text style={tw`text-sm text-gray-500 text-center mt-1`}>
            (Đã bao gồm VAT)
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={tw`mt-2 bg-[#00A982] py-3 rounded-2xl shadow-md`}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Text style={tw`text-white text-center font-semibold text-base`}>
            Tôi đã hiểu
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentDetailOverlay;
