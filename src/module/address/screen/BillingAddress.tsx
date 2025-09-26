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

type BillingAddressNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Billing"
>;

const SAVED_ADDRESSES: AddressItemType[] = [
  { id: 1, title: "XV44+7R Thành Phố XXX", subtitle: "Tỉnh XXX, Vietnam" },
  { id: 2, title: "XV44+7R Thành Phố XXX", subtitle: "Tỉnh XXX, Vietnam" },
  { id: 3, title: "XV44+7R Thành Phố XXX", subtitle: "Tỉnh XXX, Vietnam" },
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

export default function BillingAddress() {
  const navigation = useNavigation<BillingAddressNavigationProp>();
  const [searchText, setSearchText] = useState("");
  const [mapLocation, setMapLocation] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Dùng hook lấy vị trí hiện tại
  const {
    address: currentLocation,
    location,
    loading,
    error,
    refresh,
  } = useCurrentLocation();

  const fetchAddressSuggestions = useCallback(
    async (input: string) => {
      if (!input) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }
      try {
        // Ưu tiên lấy vị trí từ hook
        const latitude = location?.coords.latitude || 10.7769;
        const longitude = location?.coords.longitude || 106.7009;

        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input
        )}&location=${latitude},${longitude}&radius=5000&language=vi&key=${GOOGLE_PLACES_API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();
        if (data.predictions) {
          setSuggestions(data.predictions);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      } catch (error) {
        setSuggestions([]);
        setShowDropdown(false);
      }
    },
    [location]
  );

  useEffect(() => {
    if (navigation?.getState) {
      const params = navigation
        ?.getState?.()
        ?.routes.find((r) => r.name === "Billing")?.params as
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

  // handleCurrentLocation dùng cho nghiệp vụ khác, không gọi refresh ở đây
  const handleCurrentLocation = useCallback(() => {
    // Nghiệp vụ khác, ví dụ mở modal, chọn lại vị trí, v.v.
    console.log("Nghiệp vụ khác khi lấy vị trí hiện tại");
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
    navigation.navigate("MapSelect", { returnScreen: "Billing" });
  }, [navigation]);

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    fetchAddressSuggestions(text);
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

      <ScrollView
        style={tw`flex-1 bg-gray-100`}
        contentContainerStyle={tw`pb-6`}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={tw`flex-row items-center bg-white px-4 mb-2 shadow-2xl border-b-2 border-[#00A982] `}
        >
          <Entypo
            name="arrow-down"
            size={16}
            color="#fff"
            style={tw`bg-[#00A982] rounded-full p-1.5`}
          />
          <TextInput
            style={tw`flex-1 text-base font-semibold text-gray-600 ml-3`}
            value={searchText}
            onChangeText={handleSearchTextChange}
            placeholder="Số nhà, đường, phường, quận"
            placeholderTextColor="#6B6B6B"
            returnKeyType="search"
          />
          {showDropdown && suggestions.length > 0 && (
            <View
              style={tw`absolute top-12 left-0 right-0 bg-[#fcfcfc] shadow-lg z-50`}
            >
              {suggestions.map((item) => (
                <TouchableOpacity
                  key={item.place_id}
                  style={tw`px-4 py-2 border-b border-gray-100`}
                  onPress={() => {
                    setSearchText(item.description);
                    setShowDropdown(false);
                    // setSuggestions([]);
                  }}
                >
                  <Text style={tw`text-base text-black`}>
                    {item.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

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
