import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import tw from "twrnc";
import VoucherCard from "../components/VoucherCard";
import { useState } from "react";
import vouchers from "src/constants/voucher";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "src/hooks/useToast";
import Toast from "src/components/Toast";
import { Ionicons } from "@expo/vector-icons";
import VoucherConditionModal from "../components/VoucherConditionModel";

const tabs = [
  { key: "explore", label: "Khám phá" },
  { key: "mine", label: "Gói của tôi" },
] as const;

export default function VoucherScreen() {
  const [activeTab, setActiveTab] = useState<"explore" | "mine">("explore");
  const [ownedVouchers, setOwnedVouchers] = useState<string[]>([]);
  const [showConditions, setShowConditions] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string>("");

  const { toast, showSuccess, showWarning, showInfo, hideToast } = useToast();

  const handleClaimVoucher = (voucherId: string) => {
    if (!ownedVouchers.includes(voucherId)) {
      setOwnedVouchers((prev) => [...prev, voucherId]);
      showSuccess("Lấy voucher thành công!");

      setTimeout(() => {
        setActiveTab("mine");
      }, 1500);
    } else {
      showWarning("Bạn đã có voucher này rồi!");
    }
  };

  const handleUseVoucher = (voucherId: string) => {
    showSuccess("Voucher đã được áp dụng!");
    // Logic sử dụng voucher
    console.log("Using voucher:", voucherId);
  };

  const handleViewConditions = (voucherId: string) => {
    const voucher = vouchers.find((v) => v.id === voucherId);
    setSelectedVoucherId(voucherId);
    setShowConditions(true);
  };

  const renderEmptyState = () => (
    <View style={tw`flex-1 items-center justify-center py-20`}>
      <View
        style={tw`w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4`}
      >
        <Ionicons name="ticket-outline" size={32} color="#9CA3AF" />
      </View>
      <Text style={tw`text-gray-500 text-base font-medium mb-1`}>
        Bạn chưa có voucher nào
      </Text>
      <Text style={tw`text-gray-400 text-sm text-center px-8`}>
        Khám phá và thu thập các voucher hấp dẫn
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={tw`bg-white px-4 py-3 border-b border-gray-100`}>
      <Text style={tw`text-center text-lg font-semibold text-gray-900`}>
        Mã giảm giá
      </Text>
      {/* Tabs */}
      <View style={tw`flex-row mt-4 bg-gray-100 rounded-lg p-1`}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={tw.style(
              "flex-1 py-2 rounded-md items-center",
              activeTab === tab.key ? "bg-white shadow-sm" : ""
            )}
            onPress={() => setActiveTab(tab.key)}
          >
            <View style={tw`flex-row items-center`}>
              <Text
                style={tw.style(
                  "text-sm font-medium",
                  activeTab === tab.key ? "text-gray-900" : "text-gray-600"
                )}
              >
                {tab.label}
              </Text>
              {tab.key === "mine" && ownedVouchers.length > 0 && (
                <View
                  style={tw`bg-[#00A982] rounded-full w-5 h-5 items-center justify-center ml-1`}
                >
                  <Text style={tw`text-white text-xs font-bold`}>
                    {ownedVouchers.length}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderContent = () => {
    if (activeTab === "explore") {
      return vouchers.map((voucher) => (
        <VoucherCard
          key={voucher.id}
          image={voucher.image}
          title={voucher.title}
          description={voucher.description}
          expiredDate={voucher.expiredDate}
          variant="explore"
          isSelected={ownedVouchers.includes(voucher.id)}
          onPress={() => handleClaimVoucher(voucher.id)}
          onConditionPress={() => handleViewConditions(voucher.id)}
        />
      ));
    } else {
      const myVouchers = vouchers.filter((v) => ownedVouchers.includes(v.id));

      if (myVouchers.length === 0) {
        return renderEmptyState();
      }

      return myVouchers.map((voucher) => (
        <VoucherCard
          key={voucher.id}
          image={voucher.image}
          title={voucher.title}
          description={voucher.description}
          expiredDate={voucher.expiredDate}
          variant="owned"
          onPress={() => handleUseVoucher(voucher.id)}
          onConditionPress={() => handleViewConditions(voucher.id)}
        />
      ));
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      {renderHeader()}
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-4`}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>

      <VoucherConditionModal
        visible={showConditions}
        onClose={() => setShowConditions(false)}
        voucherTitle={
          vouchers.find((v) => v.id === selectedVoucherId)?.title || "Voucher"
        }
      />

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
        position="top"
      />
    </SafeAreaView>
  );
}
