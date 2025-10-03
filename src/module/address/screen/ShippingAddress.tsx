import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import tw from "twrnc";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState, useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AddressItemProps,
  AddressItemType,
  HelpItemProps,
  HelpItemType,
} from "src/types/address.interface,";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/type";
import { GOOGLE_PLACES_API_KEY } from "@env";
import { useCurrentLocation } from "src/hooks/useCurrentLocation";
import { LOCATIONIQ_API_KEY } from "@env";

type ShippingAddressNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Shipping"
>;

const SAVED_ADDRESSES: AddressItemType[] = [
  {
    id: 1,
    title: "72 Lê Thánh Tôn, Bến Nghé",
    subtitle: "Quận 1, TP. Hồ Chí Minh, Vietnam",
  },
  { id: 2, title: "1 Đại Cồ Việt", subtitle: "Hai Bà Trưng, Hà Nội, Vietnam" },
  { id: 3, title: "02 Trường Sa", subtitle: "Ngũ Hành Sơn, Đà Nẵng, Vietnam" },
];
const HELP_ITEMS: HelpItemType[] = [
  {
    id: 1,
    icon: "alert-circle",
    iconColor: "#C20000",
    text: "Báo cáo địa chỉ bị thiếu hoặc sai tại đây!",
  },
  {
    id: 2,
    icon: "information-circle",
    iconColor: "#007AFF",
    text: "Hãy dùng Mã Cộng (Plus Code) để tìm địa chỉ chính xác hơn. Xem hướng dẫn tại đây!",
  },
];

const AddressItem = ({ item, onPress, onMenuPress }: AddressItemProps) => (
  <TouchableOpacity
    style={tw`flex-row items-center py-3 px-4 mb-2 `}
    onPress={() => onPress(item)}
    activeOpacity={0.7}
  >
    <MaterialCommunityIcons
      name="clock"
      size={16}
      color="black"
      style={tw`bg-[#EFEFEF] rounded-lg p-1.5`}
    />
    <View style={tw`flex-1 ml-3`}>
      <Text style={tw`font-semibold text-base text-black`} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={tw`text-sm text-gray-500 mt-1`} numberOfLines={1}>
        {item.subtitle}
      </Text>
    </View>
    <TouchableOpacity
      onPress={() => onMenuPress(item)}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name="ellipsis-vertical" size={18} color="#6B6B6B" />
    </TouchableOpacity>
  </TouchableOpacity>
);

const HelpItem = ({ item, onPress }: HelpItemProps) => (
  <TouchableOpacity
    style={tw`flex-row items-center py-4 px-4 mb-2 rounded-lg`}
    onPress={() => onPress(item)}
    activeOpacity={0.7}
  >
    <Ionicons
      name={item.icon as any}
      size={16}
      color={item.iconColor}
      style={tw`bg-[#EFEFEF] rounded-lg p-1.5`}
    />
    <Text style={tw`ml-3 text-sm font-semibold flex-1 text-black`}>
      {item.text}
    </Text>
    <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
  </TouchableOpacity>
);

// Component riêng cho Suggestion Item - REMOVED vì không dùng nữa

export default function ShippingAddress() {
  const navigation = useNavigation<ShippingAddressNavigationProp>();
  const [searchText, setSearchText] = useState("");
  const [mapLocation, setMapLocation] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Dùng hook lấy vị trí hiện tại
  const {
    address: currentLocation,
    location,
    loading,
    error,
    refresh,
  } = useCurrentLocation();

  const fetchAddressSuggestions = useCallback(async (input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      const url = `https://us1.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
        input.trim()
      )}&limit=8&countrycodes=vn&normalizeaddress=1`;

      const res = await fetch(url);
      const data = await res.json();
      console.log("Raw response:", data);

      if (Array.isArray(data) && data.length > 0) {
        setSuggestions(data);
        setShowDropdown(true);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.warn("Address search error:", error);
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, []);

  useEffect(() => {
    if (navigation?.getState) {
      const params = navigation
        ?.getState?.()
        ?.routes.find((r) => r.name === "Shipping")?.params as
        | { mapLocation?: any }
        | undefined;
      if (params?.mapLocation) {
        setMapLocation(params.mapLocation);
      }
    }
  }, [navigation]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleCurrentLocation = useCallback(() => {
    navigation.navigate("ConfirmOrder" as never);
  }, []);

  const handleAddNew = useCallback(() => {
    console.log("Add new address...");
  }, []);

  const handleViewAll = useCallback(() => {
    console.log("View all addresses...");
  }, []);

  const handleAddressSelect = useCallback(
    (address: any) => {
      console.log("Selected address:", address);
      navigation.goBack();
    },
    [navigation]
  );

  const handleAddressMenu = useCallback((address: any) => {
    console.log("Address menu:", address);
  }, []);

  const handleHelpItem = useCallback((item: any) => {
    console.log("Help item pressed:", item);
  }, []);

  const handleMapSelection = useCallback(() => {
    navigation.navigate("MapSelect", { returnScreen: "Shipping" });
  }, [navigation]);

  // Debounce hook riêng
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer
    const newTimer = setTimeout(() => {
      fetchAddressSuggestions(text);
    }, 300);

    setDebounceTimer(newTimer);
  };

  const handleSuggestionSelect = useCallback((item: any) => {
    setSearchText(item.display_name);
    setShowDropdown(false);

    // Có thể xử lý thêm logic chọn địa chỉ ở đây
    console.log("Selected suggestion:", item);
  }, []);

  const handleSearchFocus = () => {
    setSearchFocused(true);
    if (searchText.trim() && suggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay để cho phép click vào suggestion
    setTimeout(() => {
      if (!searchFocused) return; // Đã được handle ở chỗ khác
      setSearchFocused(false);
    }, 150);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
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
          Điểm nhận hàng
        </Text>
        <View style={tw`w-10 h-10`} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.1)"]}
          style={[
            tw`absolute left-0 right-0 bottom-0`,
            {
              height: 8,
            },
          ]}
        />
      </View>

      {/* Search Container với dropdown - Cố định ở trên */}
      <View
        style={tw`bg-white border-b-2 border-[#00A982] shadow-sm relative z-50`}
      >
        <View style={tw`flex-row items-center px-4 py-3`}>
          <Entypo
            name="arrow-down"
            size={16}
            color="#fff"
            style={tw`bg-[#00A982] rounded-full p-1.5`}
          />
          <TextInput
            style={tw`flex-1 text-base font-semibold text-gray-600 ml-3 py-2`}
            value={searchText}
            onChangeText={handleSearchTextChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            placeholder="Số nhà, đường, phường, quận"
            placeholderTextColor="#6B6B6B"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="words"
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchText("");
                setSuggestions([]);
                setShowDropdown(false);
              }}
              style={tw`p-2`}
            >
              <Ionicons name="close-circle" size={20} color="#6B6B6B" />
            </TouchableOpacity>
          )}
        </View>

        {/* Dropdown trực tiếp trong container - không dùng Modal */}
        {showDropdown && suggestions.length > 0 && (
          <View
            style={tw`absolute top-full left-0 right-0 bg-white border-l border-r border-b border-gray-200 shadow-xl z-50 max-h-80`}
          >
            {/* Header */}
            <View
              style={tw`flex-row items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50`}
            >
              <Text style={tw`font-medium text-gray-700 text-sm`}>
                {suggestions.length} kết quả
              </Text>
              <TouchableOpacity
                onPress={() => setShowDropdown(false)}
                style={tw`p-1`}
              >
                <Ionicons name="close" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Suggestions */}
            <ScrollView
              style={tw`max-h-64`}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              nestedScrollEnabled={false}
            >
              {suggestions.map((item, index) => (
                <TouchableOpacity
                  key={`suggestion_${index}_${
                    item.place_id || item.osm_id || "none"
                  }`}
                  style={tw`px-4 py-3 border-b border-gray-100 bg-white flex-row items-center`}
                  onPress={() => handleSuggestionSelect(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color="#6B7280"
                    style={tw`mr-3`}
                  />
                  <View style={tw`flex-1`}>
                    <Text
                      style={tw`text-base text-black font-medium`}
                      numberOfLines={2}
                    >
                      {item.display_name ||
                        item.address?.name ||
                        item.address?.road ||
                        item.address?.city}
                    </Text>
                    {item.address && (
                      <Text
                        style={tw`text-sm text-gray-500 mt-1`}
                        numberOfLines={1}
                      >
                        {item.address.city ||
                          item.address.town ||
                          item.address.village ||
                          ""}
                        {item.address.state ? `, ${item.address.state}` : ""}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Footer hint */}
            <View style={tw`px-4 py-2 bg-gray-50 border-t border-gray-100`}>
              <Text style={tw`text-xs text-gray-500 text-center`}>
                Tiếp tục nhập để tìm kiếm chính xác hơn
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Content với ScrollView */}
      <View style={tw`flex-1`}>
        <ScrollView
          style={tw`flex-1 bg-gray-100`}
          contentContainerStyle={tw`pb-6`}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
        >
          <View style={tw`bg-white px-4 py-4 mb-2`}>
            <TouchableOpacity
              style={tw`flex-row items-center`}
              onPress={handleCurrentLocation}
              activeOpacity={0.7}
            >
              <Ionicons
                name="paper-plane"
                size={16}
                color="#000"
                style={tw`bg-[#EFEFEF] rounded-lg p-1.5`}
              />
              <View style={tw`ml-4 flex-1`}>
                <Text style={tw`font-semibold text-base text-black`}>
                  Lấy vị trí hiện tại
                </Text>
                <Text style={tw`text-sm text-gray-500 mt-1`} numberOfLines={1}>
                  {loading ? "Đang lấy vị trí..." : currentLocation}
                </Text>
              </View>
              {loading && (
                <View style={tw`ml-2`}>
                  <Ionicons name="refresh" size={16} color="#00A982" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={tw`px-4 pt-4 bg-white mb-2`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`font-semibold text-base text-black`}>
                Địa chỉ đã lưu
              </Text>

              <TouchableOpacity onPress={handleViewAll}>
                <Text style={tw`text-[#00A982] font-semibold text-sm`}>
                  Xem tất cả
                </Text>
              </TouchableOpacity>
            </View>
            <View style={tw`h-0.2 w-full bg-gray-300 mb-2`} />
            <TouchableOpacity
              style={tw`flex-row items-center mb-4`}
              onPress={handleAddNew}
              activeOpacity={0.7}
            >
              <Ionicons
                name="add-circle"
                size={16}
                color="white"
                style={tw`mr-4 p-1.5 bg-[#00A982] rounded-lg`}
              />
              <View style={tw`flex-1`}>
                <Text style={tw`font-semibold text-base text-black`}>
                  Thêm mới
                </Text>
                <Text style={tw`text-sm text-gray-500 mt-1`}>
                  Lưu địa điểm thân quen của bạn
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={tw`px-4 py-4 bg-white mb-2`}>
            <Text style={tw`font-semibold text-base text-black mb-4`}>
              Thường được sử dụng
            </Text>
            <View style={tw`h-0.2 w-full bg-gray-300 mb-2`} />
            <View style={tw`-mx-4`}>
              {SAVED_ADDRESSES.map((item) => (
                <AddressItem
                  key={item.id}
                  item={item}
                  onPress={handleAddressSelect}
                  onMenuPress={handleAddressMenu}
                />
              ))}
            </View>
          </View>

          <View style={tw`px-4 py-4 bg-white`}>
            <Text style={tw`font-semibold text-base text-black mb-4`}>
              Cần trợ giúp?
            </Text>
            <View style={tw`-mx-4`}>
              {HELP_ITEMS.map((item) => (
                <HelpItem key={item.id} item={item} onPress={handleHelpItem} />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Bottom Button */}
      <View style={tw`bg-white border-t border-gray-100`}>
        <TouchableOpacity
          style={tw`flex-row items-center justify-center py-4 px-4`}
          onPress={handleMapSelection}
          activeOpacity={0.7}
        >
          <Ionicons name="map" size={20} color="#00A982" />
          <Text style={tw`ml-2 text-[#00A982] font-semibold text-base`}>
            Chọn từ bản đồ
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
