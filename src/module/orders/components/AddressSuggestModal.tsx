import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { LOCATIONIQ_API_KEY } from "@env";

type AddressSuggestModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (address: string) => void;
  title?: string;
};

interface AddressSuggestion {
  place_id?: string | number;
  display_name: string;
  [key: string]: any;
}

export default function AddressSuggestModal({
  visible,
  onClose,
  onSelect,
  title = "Nhập địa chỉ giao hàng",
}: AddressSuggestModalProps) {
  const [addressInput, setAddressInput] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestion[]
  >([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchAddressSuggestions = async (input: string): Promise<void> => {
    if (!input.trim()) {
      setAddressSuggestions([]);
      setShowDropdown(false);
      return;
    }
    try {
      const url = `https://us1.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
        input.trim()
      )}&limit=8&countrycodes=vn&normalizeaddress=1`;
      const res = await fetch(url);
      const data: AddressSuggestion[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setAddressSuggestions(data);
        setShowDropdown(true);
      } else {
        setAddressSuggestions([]);
        setShowDropdown(true); // show dropdown even khi rỗng để hiển thị "Không có kết quả"
      }
    } catch (error) {
      setAddressSuggestions([]);
      setShowDropdown(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={tw`flex-1 bg-black bg-opacity-30 justify-end`}>
        <View style={tw`bg-white rounded-t-3xl max-h-4/5`}>
          {/* Header */}
          <View
            style={tw`flex-row items-center px-4 py-4 border-b border-gray-200`}
          >
            <TouchableOpacity
              onPress={onClose}
              style={tw`p-2 rounded-full bg-gray-100`}
            >
              <Ionicons name="chevron-back" size={22} color="#00A982" />
            </TouchableOpacity>
            <Text style={tw`text-lg font-semibold text-black ml-4 flex-1`}>
              {title}
            </Text>
          </View>

          {/* Search box */}
          <View style={tw`px-4 py-4`}>
            <View style={tw`flex-row items-center bg-gray-100 rounded-lg px-3`}>
              <Ionicons
                name="search-outline"
                size={18}
                color="#6B7280"
                style={tw`mr-2`}
              />
              <TextInput
                style={tw`flex-1 py-2 text-base text-black`}
                placeholder="Nhập địa chỉ giao hàng..."
                value={addressInput}
                onChangeText={(text) => {
                  setAddressInput(text);
                  fetchAddressSuggestions(text);
                }}
                placeholderTextColor="#9CA3AF"
                autoFocus
              />
              {addressInput.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setAddressInput("");
                    setAddressSuggestions([]);
                    setShowDropdown(false);
                  }}
                >
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Suggestions */}
          {showDropdown && (
            <ScrollView
              style={tw`px-4`}
              contentContainerStyle={{ paddingBottom: 20 }}
              nestedScrollEnabled
            >
              {addressSuggestions.length > 0 ? (
                addressSuggestions.map((item, idx) => (
                  <TouchableOpacity
                    key={idx.toString()} // fix duplicate key
                    style={tw`flex-row items-start py-3 px-2 border-b border-gray-200 rounded-lg`}
                    onPress={() => {
                      onSelect(item.display_name);
                      onClose();
                    }}
                    activeOpacity={0.6}
                  >
                    <Ionicons
                      name="location-outline"
                      size={18}
                      color="#00A982"
                      style={tw`mr-2 mt-1`}
                    />
                    <Text style={tw`text-base text-black flex-1`}>
                      {item.display_name}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={tw`py-3 px-2`}>
                  <Text style={tw`text-gray-400 text-center`}>
                    Không có kết quả
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
