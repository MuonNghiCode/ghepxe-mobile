import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import tw from "twrnc";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/type";
import { LOCATIONIQ_API_KEY } from "@env";
import { useCurrentLocation } from "src/hooks/useCurrentLocation";
import { useOrder } from "src/context/OrderContext";
import { useToast } from "src/hooks/useToast";
import Toast from "src/components/Toast";
import * as Location from "expo-location";
import {
  AddressItemProps,
  AddressItemType,
  HelpItemProps,
  HelpItemType,
} from "src/types/address.interface,";
import { useFocusEffect } from "@react-navigation/native";

type BillingAddressNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Billing"
>;

const SAVED_ADDRESSES: AddressItemType[] = [
  {
    id: 1,
    title: "72 Lê Thánh Tôn, Bến Nghé",
    subtitle: "Quận 1, TP. Hồ Chí Minh, Vietnam",
  },
  {
    id: 2,
    title: "1 Đại Cồ Việt",
    subtitle: "Hai Bà Trưng, Hà Nội, Vietnam",
  },
  {
    id: 3,
    title: "02 Trường Sa",
    subtitle: "Ngũ Hành Sơn, Đà Nẵng, Vietnam",
  },
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
    style={tw`flex-row items-center py-3 px-4 mb-2`}
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

export default function BillingAddressScreen() {
  const navigation = useNavigation<BillingAddressNavigationProp>();
  const [searchText, setSearchText] = useState("");
  const [mapLocation, setMapLocation] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const {
    address: currentLocation,
    location,
    loading,
    error,
    refresh,
    coordinates,
  } = useCurrentLocation();

  const { setPickupLocation } = useOrder();
  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();

  // Parse địa chỉ từ LocationIQ format
  const parseLocationIQAddress = (item: any) => {
    return {
      street: item.address?.road || item.address?.name || "",
      ward: item.address?.suburb || item.address?.neighbourhood || "",
      district: item.address?.city_district || item.address?.county || "",
      city:
        item.address?.city || item.address?.town || item.address?.village || "",
      province: item.address?.state || "",
      postalCode: item.address?.postcode || "700000",
      country: item.address?.country || "Việt Nam",
      latitude: parseFloat(item.lat) || 0,
      longitude: parseFloat(item.lon) || 0,
      fullAddress: item.display_name || "",
    };
  };

  // Parse địa chỉ từ reverse geocoding
  const parseReverseGeocode = async (lat: number, lon: number) => {
    try {
      const addressArr = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lon,
      });

      if (addressArr && addressArr.length > 0) {
        const addr = addressArr[0];
        return {
          street: addr.street || addr.name || "",
          ward: addr.subregion || "",
          district: addr.district || addr.city || "",
          city: addr.city || "",
          province: addr.region || addr.city || "",
          postalCode: addr.postalCode || "700000",
          country: addr.country || "Việt Nam",
          latitude: lat,
          longitude: lon,
          fullAddress: `${addr.name || ""} ${addr.street || ""}, ${
            addr.city || ""
          }, ${addr.country || ""}`.trim(),
        };
      }
    } catch (error) {
      console.error("Reverse geocode error:", error);
    }
    return null;
  };

  // Fetch address suggestions from LocationIQ API
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
        ?.routes.find((r) => r.name === "Billing")?.params as
        | { mapLocation?: any }
        | undefined;
      if (params?.mapLocation) {
        setMapLocation(params.mapLocation);
        // Xử lý location từ map và chuyển sang ConfirmOrder ngay
        handleMapLocationSelect(params.mapLocation);
      }
    }
  }, [navigation]);

  // Lắng nghe khi màn hình được focus lại từ MapSelect
  useFocusEffect(
    useCallback(() => {
      const state = navigation.getState();
      const currentRoute = state.routes[state.index];
      const params = currentRoute.params as { mapLocation?: any } | undefined;

      if (params?.mapLocation) {
        console.log("Received mapLocation:", params.mapLocation);
        handleMapLocationSelect(params.mapLocation);

        // Clear params sau khi xử lý để tránh trigger lại
        navigation.setParams({ mapLocation: undefined } as any);
      }
    }, [navigation])
  );

  const handleMapLocationSelect = async (mapLoc: any) => {
    console.log("Processing mapLocation:", mapLoc);

    if (!mapLoc?.coords) {
      console.log("No coords found");
      return;
    }

    const { latitude, longitude } = mapLoc.coords;
    console.log("Coordinates:", latitude, longitude);

    const parsed = await parseReverseGeocode(latitude, longitude);
    console.log("Parsed address:", parsed);

    if (parsed) {
      setPickupLocation(parsed);
      console.log("Navigating to ConfirmOrder");
      navigation.navigate("ConfirmOrder" as never);
    } else {
      console.log("Failed to parse address");
    }
  };

  const handleCurrentLocation = useCallback(async () => {
    if (!coordinates) {
      refresh();
      return;
    }

    const parsed = await parseReverseGeocode(
      coordinates.latitude,
      coordinates.longitude
    );
    if (parsed) {
      setPickupLocation(parsed);
      navigation.navigate("ConfirmOrder" as never);
    }
  }, [coordinates, navigation, setPickupLocation, refresh]);

  const handleAddNew = useCallback(() => {
    navigation.navigate("OrderBillingAddress" as never);
  }, [navigation]);

  const handleViewAll = useCallback(() => {
    console.log("View all addresses...");
  }, []);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleAddressSelect = useCallback(
    async (address: AddressItemType) => {
      try {
        const fullAddress = `${address.title}, ${address.subtitle}`;
        const geocodeResult = await Location.geocodeAsync(fullAddress);

        if (geocodeResult && geocodeResult.length > 0) {
          const { latitude, longitude } = geocodeResult[0];
          const parsed = await parseReverseGeocode(latitude, longitude);

          if (parsed) {
            setPickupLocation(parsed);
            navigation.navigate("ConfirmOrder" as never);
          }
        }
      } catch (error) {
        console.error("Error selecting address:", error);
      }
    },
    [navigation, setPickupLocation]
  );

  const handleAddressMenu = useCallback((address: any) => {
    console.log("Address menu:", address);
  }, []);

  const handleHelpItem = useCallback((item: any) => {
    console.log("Help item pressed:", item);
  }, []);

  const handleMapSelection = useCallback(() => {
    navigation.navigate("MapSelect", { returnScreen: "Billing" } as never);
  }, [navigation]);

  const handleSearchTextChange = useCallback(
    (text: string) => {
      setSearchText(text);

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const newTimer = setTimeout(() => {
        fetchAddressSuggestions(text);
      }, 300);

      setDebounceTimer(newTimer);
    },
    [debounceTimer, fetchAddressSuggestions]
  );

  const handleSuggestionSelect = useCallback(
    (item: any) => {
      setSearchText(item.display_name);
      setShowDropdown(false);

      const parsed = parseLocationIQAddress(item);
      setPickupLocation(parsed);
      navigation.navigate("ConfirmOrder" as never);
    },
    [navigation, setPickupLocation]
  );

  const handleSearchFocus = useCallback(() => {
    setSearchFocused(true);
    if (searchText.trim() && suggestions.length > 0) {
      setShowDropdown(true);
    }
  }, [searchText, suggestions]);

  const handleSearchBlur = useCallback(() => {
    setTimeout(() => {
      if (!searchFocused) return;
      setSearchFocused(false);
    }, 150);
  }, [searchFocused]);

  const clearSearch = useCallback(() => {
    setSearchText("");
    setSuggestions([]);
    setShowDropdown(false);
  }, []);

  // Render methods
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
        Điểm nhận hàng
      </Text>
      <View style={tw`w-10 h-10`} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.1)"]}
        style={[tw`absolute left-0 right-0 bottom-0`, { height: 8 }]}
      />
    </View>
  );

  const renderSearchBar = () => (
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
          <TouchableOpacity onPress={clearSearch} style={tw`p-2`}>
            <Ionicons name="close-circle" size={20} color="#6B6B6B" />
          </TouchableOpacity>
        )}
      </View>
      {renderSuggestionDropdown()}
    </View>
  );

  const renderSuggestionDropdown = () => {
    if (!showDropdown || suggestions.length === 0) return null;

    return (
      <View
        style={tw`absolute top-full left-0 right-0 bg-white border-l border-r border-b border-gray-200 shadow-xl z-50 max-h-80`}
      >
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
        <View style={tw`px-4 py-2 bg-gray-50 border-t border-gray-100`}>
          <Text style={tw`text-xs text-gray-500 text-center`}>
            Tiếp tục nhập để tìm kiếm chính xác hơn
          </Text>
        </View>
      </View>
    );
  };

  const renderCurrentLocationSection = () => (
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
  );

  const renderSavedAddressesSection = () => (
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
          <Text style={tw`font-semibold text-base text-black`}>Thêm mới</Text>
          <Text style={tw`text-sm text-gray-500 mt-1`}>
            Lưu địa điểm thân quen của bạn
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderFrequentlyUsedSection = () => (
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
  );

  const renderHelpSection = () => (
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
  );

  const renderBottomButton = () => (
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
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {renderHeader()}
      {renderSearchBar()}
      <View style={tw`flex-1`}>
        <ScrollView
          style={tw`flex-1 bg-gray-100`}
          contentContainerStyle={tw`pb-6`}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
        >
          {renderCurrentLocationSection()}
          {renderSavedAddressesSection()}
          {renderFrequentlyUsedSection()}
          {renderHelpSection()}
        </ScrollView>
      </View>
      {renderBottomButton()}

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
