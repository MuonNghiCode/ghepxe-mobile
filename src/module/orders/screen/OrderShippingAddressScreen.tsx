import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import tw from "twrnc";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCurrentLocation } from "src/hooks/useCurrentLocation";
import * as Location from "expo-location";
import * as Contacts from "expo-contacts";
import ContactPickerModal from "../components/ContactPickerModel";
import AddressSuggestModal from "../components/AddressSuggestModal";
import { useOrder } from "src/context/OrderContext";
import { useToast } from "src/hooks/useToast";
import Toast from "src/components/Toast";
import ConfirmDialog from "src/components/ConfirmDialog";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAP_HEIGHT = SCREEN_HEIGHT * 0.45;

interface AddressObject {
  name?: string | null;
  street?: string | null;
  city?: string | null;
  country?: string | null;
  district?: string | null;
  subLocality?: string | null;
  region?: string | null;
  postalCode?: string | null;
  [key: string]: any;
}

function formatAddress(addressArr: AddressObject[]): string {
  if (!addressArr || addressArr.length === 0) return "";
  const { name, street, city, country } = addressArr[0];
  return `${name ?? ""} ${street ?? ""}, ${city ?? ""}, ${
    country ?? ""
  }`.trim();
}

function parseAddressComponents(addressArr: AddressObject[]) {
  if (!addressArr || addressArr.length === 0) return null;
  const addr = addressArr[0];
  return {
    street: addr.street || addr.name || "",
    ward: addr.subLocality || "",
    district: addr.district || addr.city || "",
    city: addr.city || "",
    province: addr.region || addr.city || "",
    postalCode: addr.postalCode || "700000",
    country: addr.country || "Việt Nam",
  };
}

export default function OrderShippingAddressScreen() {
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressNote, setAddressNote] = useState("");
  // Thêm state cho COD và giá trị hàng hóa
  const [cod, setCod] = useState("");
  const [goodsValue, setGoodsValue] = useState("");
  const navigation = useNavigation();
  const [region, setRegion] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);
  const [address, setAddress] = useState<string>("");
  const [isMapFull, setIsMapFull] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { dropoffLocation, setDropoffLocation } = useOrder();
  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();

  const {
    location,
    address: currentAddress,
    loading,
    error,
    refresh,
    coordinates,
  } = useCurrentLocation();

  // Load dữ liệu từ context - CHỈ CHẠY 1 LẦN
  useEffect(() => {
    if (isInitialized) return;

    if (dropoffLocation) {
      setAddress(dropoffLocation.fullAddress);
      setAddressNote(dropoffLocation.note || "");
      setReceiverName(dropoffLocation.receiverName || "");
      setReceiverPhone(dropoffLocation.receiverPhone || "");
      setCod(dropoffLocation.cod || "");
      setGoodsValue(dropoffLocation.goodsValue || "");

      setRegion({
        latitude: dropoffLocation.latitude,
        longitude: dropoffLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setSelected({
        latitude: dropoffLocation.latitude,
        longitude: dropoffLocation.longitude,
      });
      setIsInitialized(true);
    } else if (coordinates) {
      setRegion({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setSelected({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
      setAddress(currentAddress || "");
      setIsInitialized(true);
    }
  }, [dropoffLocation, coordinates, currentAddress, isInitialized]);

  // Khi chọn vị trí mới trên map - GIỮ LẠI thông tin
  const handleMapPress = async (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelected({ latitude, longitude });

    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    try {
      const addressArr = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      const formatted = formatAddress(addressArr);
      setAddress(formatted);

      const parsed = parseAddressComponents(addressArr);
      if (parsed) {
        setDropoffLocation({
          ...parsed,
          latitude,
          longitude,
          fullAddress: formatted,
          // Giữ lại thông tin đã nhập
          note: addressNote,
          receiverName,
          receiverPhone,
          cod,
          goodsValue,
        });
      }
    } catch (error) {
      setAddress("Không thể xác định địa chỉ");
      showError("Không thể xác định địa chỉ");
    }
  };

  // Nút định vị lại vị trí hiện tại - GIỮ LẠI thông tin
  const handleMyLocation = () => {
    refresh();
    if (coordinates && currentAddress) {
      setRegion({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setSelected({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
      setAddress(currentAddress);

      Location.reverseGeocodeAsync(coordinates).then((addressArr) => {
        const parsed = parseAddressComponents(addressArr);
        if (parsed) {
          setDropoffLocation({
            ...parsed,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            fullAddress: currentAddress,
            // Giữ lại thông tin đã nhập
            note: addressNote,
            receiverName,
            receiverPhone,
            cod,
            goodsValue,
          });
        }
      });
      showSuccess("Đã cập nhật vị trí hiện tại");
    }
  };

  const handleOpenContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== "granted") {
        showWarning("Cần cấp quyền truy cập danh bạ");
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
      });

      if (data.length > 0) {
        setContacts(data);
        setShowContactModal(true);
      }
    } catch (error) {
      showError("Không thể truy cập danh bạ");
    }
  };

  const handleSelectContact = (contact: Contacts.Contact) => {
    if (contact.name) {
      setReceiverName(contact.name);
    }
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      setReceiverPhone(contact.phoneNumbers[0].number || "");
    }
    setShowContactModal(false);
    showSuccess("Đã chọn người nhận từ danh bạ");
  };

  const handleConfirm = () => {
    if (!selected || !address) {
      showWarning("Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    if (!receiverName || !receiverPhone) {
      showWarning("Vui lòng nhập đầy đủ thông tin người nhận");
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmAddress = () => {
    Location.reverseGeocodeAsync(selected).then((addressArr) => {
      const parsed = parseAddressComponents(addressArr);
      if (parsed) {
        setDropoffLocation({
          ...parsed,
          latitude: selected.latitude,
          longitude: selected.longitude,
          fullAddress: address,
          note: addressNote,
          receiverName,
          receiverPhone,
          cod,
          goodsValue,
        });

        setShowConfirmDialog(false);
        showSuccess("Đã lưu địa chỉ giao hàng");
        setTimeout(() => {
          navigation.navigate("ConfirmOrder" as never);
        }, 1000);
      }
    });
  };

  const handleSelectAddressFromModal = async (addressString: string) => {
    setAddress(addressString);
    setShowAddressModal(false);

    try {
      const geocodeResult = await Location.geocodeAsync(addressString);
      if (geocodeResult && geocodeResult.length > 0) {
        const { latitude, longitude } = geocodeResult[0];

        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setSelected({ latitude, longitude });

        const addressArr = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        const parsed = parseAddressComponents(addressArr);
        if (parsed) {
          setDropoffLocation({
            ...parsed,
            latitude,
            longitude,
            fullAddress: addressString,
            // Giữ lại thông tin đã nhập
            note: addressNote,
            receiverName,
            receiverPhone,
            cod,
            goodsValue,
          });
        }
        showSuccess("Đã cập nhật địa chỉ");
      }
    } catch (error) {
      showError("Không thể xác định vị trí của địa chỉ này");
    }
  };

  // --- Render functions ---
  const renderBackButton = () => (
    <TouchableOpacity
      style={[
        tw`absolute top-10 left-5 bg-white rounded-full p-2`,
        { zIndex: 999, elevation: 10 },
      ]}
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="arrow-back" size={22} color="#00A982" />
    </TouchableOpacity>
  );

  const renderMapView = () => (
    <View
      style={[
        tw`overflow-hidden`,
        isMapFull
          ? {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 20,
            }
          : {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: MAP_HEIGHT,
              zIndex: 1,
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
            },
      ]}
    >
      {region && (
        <MapView
          style={tw`flex-1`}
          initialRegion={region}
          region={region}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {selected && (
            <Marker coordinate={selected} pinColor="#00A982">
              <View style={tw`bg-[#00A982] p-2 rounded-full shadow-lg`}>
                <Ionicons name="location" size={18} color="white" />
              </View>
            </Marker>
          )}
        </MapView>
      )}
      {!isMapFull && (
        <TouchableOpacity
          style={tw`absolute bottom-10 right-4 bg-white px-3 py-1 rounded-full shadow`}
          onPress={() => setIsMapFull(true)}
        >
          <Text style={tw`text-[#00A982] font-semibold`}>Chọn từ bản đồ</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={handleMyLocation}
        style={tw`absolute bottom-10 left-4 bg-white p-3 rounded-full shadow-lg`}
      >
        <Ionicons name="locate" size={24} color="#00A982" />
      </TouchableOpacity>
      {isMapFull && (
        <TouchableOpacity
          style={tw`absolute top-10 right-4 bg-white p-2 rounded-full shadow`}
          onPress={() => setIsMapFull(false)}
        >
          <Ionicons name="close" size={24} color="#00A982" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderAddressSection = () => (
    <View style={tw`px-4 pt-4 w-full`}>
      <View style={tw`mb-4 w-full`}>
        <Text style={tw`text-base font-semibold text-black mb-3`}>
          Giao hàng đến
        </Text>
        <View
          style={[
            tw`flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm border border-[#E6F7F3] w-full`,
            {
              shadowColor: "#00A982",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 6,
            },
          ]}
        >
          <TouchableOpacity
            style={tw`flex-row items-center flex-1`}
            onPress={() => setShowAddressModal(true)}
            activeOpacity={0.8}
          >
            <View
              style={tw`w-7 h-7 rounded-full bg-[#00A982] items-center justify-center mr-3`}
            >
              <Entypo
                name="arrow-down"
                size={14}
                color="#fff"
                style={tw`bg-[#00A982] rounded-full p-1 `}
              />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-black font-semibold`}>
                {address || "Chọn địa chỉ giao hàng"}
              </Text>
            </View>
            <View>
              <Ionicons name="create-outline" size={20} color="#3B82F6" />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={tw`bg-white rounded-xl border border-gray-300 px-4 py-3 mt-3 flex-row items-center`}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={18}
            color="#6B6B6B"
          />
          <TextInput
            style={tw`flex-1 ml-2 text-sm text-black`}
            placeholder="Thêm ghi chú địa chỉ"
            placeholderTextColor="#6B6B6B"
            value={addressNote}
            onChangeText={setAddressNote}
          />
          {addressNote.length > 0 && (
            <TouchableOpacity onPress={() => setAddressNote("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color="#FF4D4F"
                style={tw`ml-2`}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const renderReceiverSection = () => (
    <View style={tw`border-t border-gray-200 py-4 w-full px-4`}>
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <Text style={tw`text-base font-semibold text-black`}>
          Thông tin người nhận
        </Text>
        <TouchableOpacity>
          <Text style={tw`text-[#00A982] font-semibold`}>
            Tôi là người nhận
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={tw`bg-white rounded-xl border border-gray-300 px-3 py-2 mb-2 flex-row items-center`}
      >
        <View style={tw`flex-1`}>
          <Text style={tw`text-xs text-gray-500`}>Tên người nhận</Text>
          <TextInput
            style={tw`text-base text-black py-1`}
            placeholder="Vui lòng nhập tên người nhận"
            placeholderTextColor="#6B6B6B"
            value={receiverName}
            onChangeText={setReceiverName}
          />
        </View>
        {receiverName.length > 0 && (
          <TouchableOpacity onPress={() => setReceiverName("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color="#FF4D4F"
              style={tw`ml-2`}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleOpenContacts}>
          <FontAwesome
            name="address-book"
            size={22}
            color="#6B6B6B"
            style={tw`ml-2`}
          />
        </TouchableOpacity>
      </View>
      <View
        style={tw`bg-white rounded-xl border border-gray-300 px-3 py-2 flex-row items-center`}
      >
        <TextInput
          style={tw`flex-1 text-base text-black py-1`}
          placeholder="Số điện thoại"
          placeholderTextColor="#6B6B6B"
          value={receiverPhone}
          onChangeText={setReceiverPhone}
          keyboardType="phone-pad"
        />
        {receiverPhone.length > 0 && (
          <TouchableOpacity onPress={() => setReceiverPhone("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color="#FF4D4F"
              style={tw`ml-2`}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderCodSection = () => (
    <View style={tw`border-t border-gray-200 pt-4 w-full px-4`}>
      <View style={tw`flex-row items-center mb-2`}>
        <Text style={tw`text-base font-semibold text-black`}>COD</Text>
        <Ionicons
          name="information-circle-outline"
          size={14}
          color="#6B6B6B"
          style={tw`ml-1`}
        />
      </View>
      <View
        style={tw`bg-gray-200 rounded-xl px-3 py-2 flex-row items-center mb-2`}
      >
        <TextInput
          style={tw`flex-1 text-base text-black`}
          placeholder="Nhập số tiền"
          placeholderTextColor="#6B6B6B"
          value={cod}
          onChangeText={setCod}
          keyboardType="numeric"
          editable={true}
        />
        {cod.length > 0 && (
          <TouchableOpacity onPress={() => setCod("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color="#FF4D4F"
              style={tw`ml-2`}
            />
          </TouchableOpacity>
        )}
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#6B6B6B"
          style={tw`ml-2`}
        />
      </View>
      <View style={tw`bg-[#BDE7FF] rounded-lg px-3 py-2 flex-row items-center`}>
        <Ionicons
          name="information"
          size={18}
          color="#5ABCE5"
          style={tw`mr-2 p-1 bg-[#005AAE]/80 rounded-full items-center justify-center`}
        />
        <Text style={tw`text-xs text-black flex-1 font-semibold`}>
          Định danh tài khoản để mở mức ứng COD lên đến 1.000.000đ
        </Text>
      </View>
    </View>
  );

  const renderGoodsValueSection = () => (
    <View style={tw`border-t border-gray-200 pt-4 w-full px-4`}>
      <View style={tw`flex-row items-center mb-2`}>
        <Text style={tw`text-base font-semibold text-black`}>
          Giá trị hàng hóa
        </Text>
        <Ionicons
          name="information-circle-outline"
          size={16}
          color="#6B6B6B"
          style={tw`ml-1`}
        />
      </View>
      <View
        style={tw`bg-white rounded-xl border border-gray-300 px-3 py-2 flex-row items-center mb-1`}
      >
        <TextInput
          style={tw`flex-1 text-base text-black`}
          placeholder="Giá trị hàng hóa"
          placeholderTextColor="#6B6B6B"
          value={goodsValue}
          onChangeText={setGoodsValue}
          keyboardType="numeric"
        />
        {goodsValue.length > 0 && (
          <TouchableOpacity onPress={() => setGoodsValue("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color="#FF4D4F"
              style={tw`ml-2`}
            />
          </TouchableOpacity>
        )}
      </View>
      <Text style={tw`text-xs text-gray-500 mt-1`}>
        Nhập giá trị hàng hóa để được đền bù lên đến 5.000.000đ
      </Text>
    </View>
  );

  const renderFooter = () => (
    <View style={tw`absolute bottom-0 left-0 right-0 bg-white px-4 pb-6 pt-3`}>
      <TouchableOpacity
        style={tw`bg-[#00A982] rounded-xl py-3 items-center w-full`}
        onPress={handleConfirm}
      >
        <Text style={tw`text-white text-base font-bold`}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      {renderBackButton()}
      {renderMapView()}
      {!isMapFull && (
        <View
          style={[
            tw`absolute left-0 right-0 bottom-0 bg-white rounded-t-[2rem] overflow-hidden`,
            { top: MAP_HEIGHT - 32, zIndex: 10 },
          ]}
        >
          <ScrollView
            style={tw`bg-transparent`}
            contentContainerStyle={tw`pb-32`}
          >
            {renderAddressSection()}
            {renderReceiverSection()}
            {renderCodSection()}
            {renderGoodsValueSection()}
          </ScrollView>
          {renderFooter()}
        </View>
      )}

      <ContactPickerModal
        visible={showContactModal}
        contacts={contacts as Contacts.Contact[]}
        onSelect={handleSelectContact as (contact: Contacts.Contact) => void}
        onClose={() => setShowContactModal(false)}
      />
      <AddressSuggestModal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSelect={handleSelectAddressFromModal}
      />

      <ConfirmDialog
        visible={showConfirmDialog}
        title="Xác nhận địa chỉ"
        message="Xác nhận địa chỉ giao hàng và thông tin người nhận?"
        type="info"
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={confirmAddress}
        onCancel={() => setShowConfirmDialog(false)}
      />

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
        position="top"
      />
    </View>
  );
}
