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

  const specialFeesTotal = selectedSpecials.reduce((total, item) => {
    return total + parseInt(item.value.replace(/\D/g, ""), 10);
  }, 0);

  return (
    <View
      style={[
        tw`absolute top-0 left-0 right-0 bottom-0 items-center justify-center`,
        {
          zIndex: 999,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        },
      ]}
    >
      {/* Backdrop blur effect */}
      <View
        style={[
          tw`absolute top-0 left-0 right-0 bottom-0`,
          {
            backgroundColor: "rgba(15, 23, 42, 0.4)",
          },
        ]}
      />

      {/* Main content */}
      <View
        style={[
          tw`bg-white rounded-3xl mx-4 shadow-2xl overflow-hidden`,
          {
            width: "92%",
            maxWidth: 420,
            elevation: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
          },
        ]}
      >
        {/* Header */}
        <View
          style={[
            tw`p-6 pb-0 flex-row items-center`,
            {
              background: "linear-gradient(135deg, #10B981, #059669)",
            },
          ]}
        >
          <View style={tw`flex-row items-center flex-1 justify-center`}>
            <View
              style={[
                tw`w-10 h-10 rounded-full items-center justify-center mr-3`,
                {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              ]}
            >
              <Ionicons name="card-outline" size={22} color="#FFFFFF" />
            </View>
            <View>
              <Text style={tw`text-xl font-bold text-black text-center`}>
                Chi tiết thanh toán
              </Text>
              <Text style={tw`text-sm text-black opacity-90 text-center`}>
                Phân tích chi phí giao hàng
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              tw`p-2 rounded-full ml-2`,
              {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            ]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={20} color="black" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={tw`p-6`}>
          {/* Base Fee */}
          <View
            style={[
              tw`p-4 rounded-2xl mb-4`,
              {
                backgroundColor: "#F0FDF4",
                borderWidth: 1,
                borderColor: "#BBF7D0",
              },
            ]}
          >
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-row items-center flex-1`}>
                <View
                  style={[
                    tw`w-8 h-8 rounded-full items-center justify-center mr-3`,
                    {
                      backgroundColor: "#10B981",
                    },
                  ]}
                >
                  <Ionicons name="cube-outline" size={16} color="#FFFFFF" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-base font-semibold text-slate-800`}>
                    Phí giao hàng cơ bản
                  </Text>
                  <Text style={tw`text-xs text-slate-600`}>
                    Phí vận chuyển tiêu chuẩn
                  </Text>
                </View>
              </View>
              <Text style={tw`text-lg font-bold text-emerald-600`}>
                {baseFee.toLocaleString()}₫
              </Text>
            </View>
          </View>

          {/* Special Requests */}
          <View
            style={[
              tw`p-4 rounded-2xl mb-4`,
              {
                backgroundColor:
                  selectedSpecials.length > 0 ? "#FEF3C7" : "#F8FAFC",
                borderWidth: 1,
                borderColor:
                  selectedSpecials.length > 0 ? "#FDE68A" : "#E2E8F0",
              },
            ]}
          >
            <View style={tw`flex-row items-center mb-3`}>
              <View
                style={[
                  tw`w-8 h-8 rounded-full items-center justify-center mr-3`,
                  {
                    backgroundColor:
                      selectedSpecials.length > 0 ? "#F59E0B" : "#64748B",
                  },
                ]}
              >
                <Ionicons name="star-outline" size={16} color="#FFFFFF" />
              </View>
              <Text style={tw`text-base font-semibold text-slate-800`}>
                Dịch vụ bổ sung
              </Text>
            </View>

            {selectedSpecials.length === 0 ? (
              <View style={tw`pl-11`}>
                <Text style={tw`text-sm text-slate-500 italic`}>
                  Không có dịch vụ bổ sung
                </Text>
              </View>
            ) : (
              <View style={tw`pl-11 space-y-2`}>
                {selectedSpecials.map((item, index) => (
                  <View
                    key={item.label}
                    style={tw`flex-row justify-between items-center`}
                  >
                    <View style={tw`flex-row items-center flex-1`}>
                      <View
                        style={[
                          tw`w-1.5 h-1.5 rounded-full mr-2`,
                          {
                            backgroundColor: "#F59E0B",
                          },
                        ]}
                      />
                      <Text style={tw`text-sm text-slate-700 flex-1`}>
                        {item.label}
                      </Text>
                    </View>
                    <Text style={tw`text-sm font-semibold text-amber-600 ml-2`}>
                      +
                      {parseInt(
                        item.value.replace(/\D/g, ""),
                        10
                      ).toLocaleString()}
                      ₫
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Summary */}
          <View
            style={[
              tw`p-5 rounded-2xl`,
              {
                backgroundColor: "#F1F5F9",
                borderWidth: 2,
                borderColor: "#CBD5E1",
                borderStyle: "dashed",
              },
            ]}
          >
            {/* Subtotal breakdown */}
            <View style={tw`mb-4`}>
              <View style={tw`flex-row justify-between items-center mb-2`}>
                <Text style={tw`text-sm text-slate-600`}>Phí cơ bản:</Text>
                <Text style={tw`text-sm text-slate-800 font-medium`}>
                  {baseFee.toLocaleString()}₫
                </Text>
              </View>
              {specialFeesTotal > 0 && (
                <View style={tw`flex-row justify-between items-center mb-2`}>
                  <Text style={tw`text-sm text-slate-600`}>Phí bổ sung:</Text>
                  <Text style={tw`text-sm text-slate-800 font-medium`}>
                    +{specialFeesTotal.toLocaleString()}₫
                  </Text>
                </View>
              )}
              <View
                style={[
                  tw`border-t border-slate-300 pt-2 mt-2`,
                  {
                    borderStyle: "dashed",
                  },
                ]}
              >
                <View style={tw`flex-row justify-between items-center`}>
                  <Text style={tw`text-base font-bold text-slate-800`}>
                    Tổng cộng:
                  </Text>
                  <Text style={tw`text-xl font-bold text-emerald-600`}>
                    {totalFee.toLocaleString()}₫
                  </Text>
                </View>
              </View>
            </View>

            {/* VAT Info */}
            <View
              style={[
                tw`flex-row items-center justify-center py-2 px-3 rounded-lg`,
                {
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                },
              ]}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={14}
                color="#10B981"
              />
              <Text style={tw`text-xs text-emerald-700 ml-2 font-medium`}>
                Giá đã bao gồm VAT
              </Text>
            </View>
          </View>

          {/* Payment methods info */}
          <View
            style={[
              tw`mt-4 p-3 rounded-xl flex-row items-center`,
              {
                backgroundColor: "#EFF6FF",
                borderLeftWidth: 3,
                borderLeftColor: "#3B82F6",
              },
            ]}
          >
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#3B82F6"
            />
            <Text style={tw`text-xs text-blue-700 ml-2 flex-1`}>
              Thanh toán khi nhận hàng (COD) hoặc chuyển khoản trước
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={tw`p-6 pt-0`}>
          <TouchableOpacity
            style={[
              tw`py-4 rounded-xl flex-row items-center justify-center`,
              {
                backgroundColor: "#10B981",
                shadowColor: "#10B981",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              },
            ]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#FFFFFF"
            />
            <Text style={tw`ml-2 text-white font-bold text-base`}>
              Tôi đã hiểu
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PaymentDetailOverlay;
