import React, { useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import * as Contacts from "expo-contacts";

interface ContactPickerModalProps {
  visible: boolean;
  contacts: Contacts.Contact[];
  onSelect: (contact: Contacts.Contact) => void;
  onClose: () => void;
}

interface MyContact extends Contacts.Contact {
  id: string;
}

export default function ContactPickerModal({
  visible,
  contacts,
  onSelect,
  onClose,
}: ContactPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter contacts based on search query
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;

    return contacts.filter(
      (contact) =>
        contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phoneNumbers?.some((phone) =>
          phone.number?.includes(searchQuery)
        )
    );
  }, [contacts, searchQuery]);

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayPhone = (contact: Contacts.Contact) => {
    return contact.phoneNumbers?.[0]?.number || "Không có số điện thoại";
  };

  const renderContact = ({ item }: { item: Contacts.Contact }) => (
    <TouchableOpacity
      style={tw`flex-row items-center px-4 py-4 border-b border-slate-100`}
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View
        style={[
          tw`w-12 h-12 rounded-full items-center justify-center mr-4`,
          {
            backgroundColor: "#E2E8F0",
          },
        ]}
      >
        <Text style={tw`text-slate-600 font-semibold text-sm`}>
          {getInitials(item.name || "")}
        </Text>
      </View>

      {/* Contact info */}
      <View style={tw`flex-1`}>
        <Text style={tw`text-base font-semibold text-slate-800 mb-1`}>
          {item.name || "Không có tên"}
        </Text>
        <Text style={tw`text-sm text-slate-500`}>{getDisplayPhone(item)}</Text>
      </View>

      {/* Arrow */}
      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={tw`flex-1 items-center justify-center py-20`}>
      <View
        style={[
          tw`w-16 h-16 rounded-full items-center justify-center mb-4`,
          {
            backgroundColor: "#F1F5F9",
          },
        ]}
      >
        <Ionicons name="people-outline" size={32} color="#94A3B8" />
      </View>
      <Text style={tw`text-lg font-medium text-slate-600 mb-2`}>
        {searchQuery ? "Không tìm thấy liên hệ" : "Chưa có liên hệ"}
      </Text>
      <Text style={tw`text-sm text-slate-400 text-center px-8`}>
        {searchQuery
          ? "Thử tìm kiếm với từ khóa khác"
          : "Danh bạ của bạn đang trống"}
      </Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View style={tw`flex-1 bg-white`}>
        {/* Header */}
        <View
          style={[
            tw`flex-row items-center justify-between px-4 py-4`,
            {
              paddingTop: 50, // Safe area
              backgroundColor: "#FAFAFA",
              borderBottomWidth: 1,
              borderBottomColor: "#E2E8F0",
            },
          ]}
        >
          <View style={tw`flex-1`}>
            <Text style={tw`text-xl font-bold text-slate-800`}>
              Chọn liên hệ
            </Text>
            <Text style={tw`text-sm text-slate-500`}>
              {filteredContacts.length} liên hệ
            </Text>
          </View>
          <TouchableOpacity
            style={[
              tw`p-2 rounded-full`,
              {
                backgroundColor: "#F1F5F9",
              },
            ]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={tw`px-4 py-3 bg-white`}>
          <View
            style={[
              tw`flex-row items-center px-4 py-3 rounded-xl border`,
              {
                backgroundColor: "#F8FAFC",
                borderColor: "#E2E8F0",
              },
            ]}
          >
            <Ionicons name="search-outline" size={20} color="#94A3B8" />
            <TextInput
              style={tw`flex-1 ml-3 text-base text-slate-800`}
              placeholder="Tìm kiếm tên hoặc số điện thoại..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={tw`p-1`}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Contact list */}
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContact}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          style={tw`flex-1 bg-white`}
          contentContainerStyle={
            filteredContacts.length === 0 ? tw`flex-1` : undefined
          }
        />

        {/* Footer info */}
        {filteredContacts.length > 0 && (
          <View
            style={[
              tw`px-4 py-3 flex-row items-center justify-center`,
              {
                backgroundColor: "#F8FAFC",
                borderTopWidth: 1,
                borderTopColor: "#E2E8F0",
              },
            ]}
          >
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#64748B"
            />
            <Text style={tw`text-xs text-slate-500 ml-2`}>
              Chạm vào liên hệ để chọn
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
}
