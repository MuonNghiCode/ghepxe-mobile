import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import tw from "twrnc";
import {
  Entypo,
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  useNavigation,
  CommonActions,
  StackActions,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import DriverNoteOverlay from "../components/DriverNoteOverlay";
import ServiceSelectOverlay from "../components/ServiceSelectOverlay";
import GoodsTypeOverlay from "../components/GoodsTypeOverlay";
import PickupTimeOverlay from "../components/PickupTimeOverlay";
import PaymentDetailOverlay from "../components/PaymnetDetailOverlay";
import { useOrder } from "src/context/OrderContext";
import { useShipRequest } from "src/hooks/useShipRequest";
import { useAuth } from "src/context/AuthContext";
import { useToast } from "src/hooks/useToast";
import Toast from "src/components/Toast";
import ConfirmDialog from "src/components/ConfirmDialog";
import { useForm } from "src/hooks/useForm";
import { useFormValidation } from "src/hooks/useFormValidation";
import {
  shipRequestSchema,
  ShipRequestFormData,
} from "src/schemas/shipRequestSchemas";
import * as ImagePicker from "expo-image-picker";
import CategorySelectOverlay from "../components/CategorySelectOverlay";
import { Product } from "src/types/product.interface";

// Cập nhật interface cho special requests
const specialRequests = [
  { label: "Giao hàng về", value: "120000", key: "returnDelivery" },
  { label: "Bốc hàng", value: "50000", key: "loading" },
  { label: "Hỗ trợ tài xế", value: "30000", key: "driverAssistance" },
  { label: "Nhắn tin SMS", value: "10000", key: "smsNotification" },
  { label: "Xuất hóa đơn điện tử", value: "5000", key: "electronicInvoice" },
];

const sizes = ["S", "M", "L", "XL", "2XL", "3XL"];
const categories = [
  "Thời trang",
  "Điện tử",
  "Khác", // Chỉ hiển thị 3 loại, "Khác" sẽ mở overlay
];

const allCategories = [
  "Thời trang",
  "Mỹ phẩm",
  "Thực phẩm",
  "Điện tử",
  "Sách vở",
  "Đồ gia dụng",
  "Đồ chơi",
  "Thể thao",
  "Nội thất",
  "Trang sức",
]; // Danh sách đầy đủ cho overlay

export default function ConfirmOrderScreen() {
  const navigation = useNavigation();

  const {
    pickupLocation,
    dropoffLocation,
    orderDraft,
    buildShipRequest,
    setPickupLocation,
    setDropoffLocation,
    setOrderDraft,
  } = useOrder();

  // Khởi tạo state từ draft hoặc giá trị mặc định
  const [orderCategory, setOrderCategory] = useState(
    orderDraft?.orderCategory || categories[0]
  );
  const [showCategoryOverlay, setShowCategoryOverlay] = useState(false);
  const [showProductsList, setShowProductsList] = useState(true);
  const [showGoodsInfo, setShowGoodsInfo] = useState(true);
  const [products, setProducts] = useState<Product[]>(
    orderDraft?.products || [
      {
        id: Date.now().toString(),
        name: "",
        size: sizes[0],
        weight: "",
        imageUri: undefined,
      },
    ]
  );
  const [showNoteOverlay, setShowNoteOverlay] = useState(false);
  const [tempNote, setTempNote] = useState("");
  const [showServiceOverlay, setShowServiceOverlay] = useState(false);
  const [serviceType, setServiceType] = useState(
    orderDraft?.serviceType || "single"
  );
  const [showGoodsTypeOverlay, setShowGoodsTypeOverlay] = useState(false);
  const [showPickupTimeOverlay, setShowPickupTimeOverlay] = useState(false);
  const [pickupTime, setPickupTime] = useState(
    orderDraft?.pickupTime || "standard"
  );
  const [selectedRequests, setSelectedRequests] = useState<{
    returnDelivery: boolean;
    loading: boolean;
    driverAssistance: boolean;
    smsNotification: boolean;
    electronicInvoice: boolean;
  }>(
    orderDraft?.selectedRequests || {
      returnDelivery: false,
      loading: false,
      driverAssistance: false,
      smsNotification: false,
      electronicInvoice: false,
    }
  );
  const [totalFee, setTotalFee] = useState(55000);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);

  const { user } = useAuth();
  const { createShipRequest, loading: creatingOrder } = useShipRequest();
  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();

  // State cho confirm dialog
  const [showSwapConfirm, setShowSwapConfirm] = useState(false);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);

  // Form state với validation
  const emptyLocation = {
    fullAddress: "",
    street: "",
    ward: "",
    district: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
    latitude: 0,
    longitude: 0,
    receiverName: "",
    receiverPhone: "",
  };

  const { values, setValue, setValues } = useForm<ShipRequestFormData>({
    goodsType:
      (orderDraft?.goodsType as "private" | "personal") || ("private" as const),
    driverNote: orderDraft?.driverNote || "",
    pickupLocation: pickupLocation ?? emptyLocation,
    dropoffLocation: dropoffLocation ?? emptyLocation,
  });

  const { fieldErrors, validate, clearFieldError, hasError, getError } =
    useFormValidation(shipRequestSchema);

  // Sync locations từ context vào form
  useEffect(() => {
    setValues({
      pickupLocation: pickupLocation ?? emptyLocation,
      dropoffLocation: dropoffLocation ?? emptyLocation,
    });
  }, [pickupLocation, dropoffLocation]);

  const handleToggleRequest = (item: (typeof specialRequests)[0]) => {
    const value: number = parseInt(item.value, 10);
    const key = item.key as keyof typeof selectedRequests;

    setSelectedRequests((prev) => {
      const newState = { ...prev, [key]: !prev[key] };

      // Cập nhật tổng phí
      if (newState[key]) {
        setTotalFee((fee) => fee + value);
      } else {
        setTotalFee((fee) => fee - value);
      }

      return newState;
    });
  };

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNavigateBillingAddress = useCallback(() => {
    // Lưu draft trước khi chuyển màn hình
    setOrderDraft({
      products,
      orderCategory,
      serviceType,
      pickupTime,
      goodsType: values.goodsType,
      driverNote: values.driverNote || "",
      selectedRequests,
    });
    navigation.navigate("OrderBilling" as never);
  }, [
    navigation,
    products,
    orderCategory,
    serviceType,
    pickupTime,
    values.goodsType,
    values.driverNote,
    selectedRequests,
  ]);

  const handleNavigateShippingAddress = useCallback(() => {
    // Lưu draft trước khi chuyển màn hình
    setOrderDraft({
      products,
      orderCategory,
      serviceType,
      pickupTime,
      goodsType: values.goodsType,
      driverNote: values.driverNote || "",
      selectedRequests,
    });
    navigation.navigate("OrderShipping" as never);
  }, [
    navigation,
    products,
    orderCategory,
    serviceType,
    pickupTime,
    values.goodsType,
    values.driverNote,
    selectedRequests,
  ]);

  const handleMatchRoute = useCallback(() => {
    navigation.navigate("Matching" as never);
  }, [navigation]);

  // Kiểm tra khi vào màn hình, nếu chưa có địa chỉ thì yêu cầu nhập
  useEffect(() => {
    if (!pickupLocation) {
      showWarning("Vui lòng chọn địa chỉ lấy hàng");
      setTimeout(() => {
        navigation.navigate("OrderBillingAddress" as never);
      }, 2000);
    }
  }, [pickupLocation, navigation]);

  // Hàm hoán đổi địa chỉ với confirm
  const handleSwapLocations = useCallback(() => {
    if (!pickupLocation && !dropoffLocation) {
      showWarning("Chưa có địa chỉ nào để hoán đổi");
      return;
    }
    setShowSwapConfirm(true);
  }, [pickupLocation, dropoffLocation]);

  const confirmSwap = useCallback(() => {
    const tempPickup = pickupLocation;
    const tempDropoff = dropoffLocation;

    setPickupLocation(tempDropoff);
    setDropoffLocation(tempPickup);
    setShowSwapConfirm(false);
    showSuccess("Đã hoán đổi địa chỉ thành công");
  }, [pickupLocation, dropoffLocation, setPickupLocation, setDropoffLocation]);

  // Thêm hàm validate products
  const validateProducts = () => {
    // Kiểm tra có ít nhất 1 sản phẩm
    if (products.length === 0) {
      showError("Vui lòng thêm ít nhất 1 sản phẩm");
      return false;
    }

    // Kiểm tra từng sản phẩm
    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      if (!product.name.trim()) {
        showError(`Vui lòng nhập tên cho sản phẩm ${i + 1}`);
        return false;
      }

      if (!product.weight || parseFloat(product.weight) <= 0) {
        showError(`Vui lòng nhập khối lượng cho sản phẩm ${i + 1}`);
        return false;
      }

      if (parseFloat(product.weight) > 1000) {
        showError(`Khối lượng sản phẩm ${i + 1} không được vượt quá 1000kg`);
        return false;
      }
    }

    return true;
  };

  // Cập nhật handleCreateOrder
  const handleCreateOrder = () => {
    if (!user?.userId) {
      showError("Vui lòng đăng nhập để tạo đơn");
      return;
    }

    // Validate products
    if (!validateProducts()) {
      return;
    }

    // Validate form locations
    const formData = {
      ...values,
      pickupLocation,
      dropoffLocation,
    };

    const { isValid, errors, firstError } = validate(formData);

    if (!isValid) {
      showError(firstError || "Vui lòng kiểm tra lại thông tin");
      return;
    }

    setShowCreateConfirm(true);
  };

  // Hàm thêm sản phẩm mới
  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: "",
      size: sizes[0],
      weight: "",
      imageUri: undefined,
    };
    setProducts([...products, newProduct]);
  };

  // Hàm xóa sản phẩm
  const handleRemoveProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter((p) => p.id !== id));
    } else {
      showWarning("Phải có ít nhất 1 sản phẩm");
    }
  };

  // Hàm cập nhật thông tin sản phẩm
  const handleUpdateProduct = (
    id: string,
    field: keyof Product,
    value: string
  ) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Hàm chọn ảnh cho sản phẩm
  const handlePickImage = async (productId: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        handleUpdateProduct(productId, "imageUri", result.assets[0].uri);
      }
    } catch (error) {
      showError("Không thể chọn ảnh");
    }
  };

  // Hàm chụp ảnh cho sản phẩm
  const handleTakePhoto = async (productId: string) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        showError("Cần cấp quyền truy cập camera");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        handleUpdateProduct(productId, "imageUri", result.assets[0].uri);
      }
    } catch (error) {
      showError("Không thể chụp ảnh");
    }
  };

  // Cập nhật hàm tạo đơn
  const confirmCreateOrder = async () => {
    setShowCreateConfirm(false);

    try {
      // Validate products
      const invalidProducts = products.filter(
        (p) => !p.name.trim() || !p.weight || parseFloat(p.weight) <= 0
      );

      if (invalidProducts.length > 0) {
        showError("Vui lòng nhập đầy đủ thông tin cho tất cả sản phẩm");
        return;
      }

      // Map products thành items
      const items = products.map((product) => {
        const item: any = {
          name: product.name,
          amount: 1,
          weight: parseFloat(product.weight),
          size: product.size,
          imageFileId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        };

        if (values.driverNote) {
          item.description = values.driverNote;
        }

        return item;
      });

      const now = new Date();
      const pickupTimeWindow = {
        start: now.toISOString(),
        end: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      };

      // SỬA LẠI:
      // itemType = loại sản phẩm (orderCategory: "Thời trang", "Điện tử", v.v.)
      // itemCategory = loại hàng hóa (goodsType: "Business" hoặc "Personal")
      const itemType = orderCategory; // "Thời trang", "Điện tử", etc.
      const itemCategory =
        values.goodsType === "private" ? "Bussiness" : "Personal";

      const shipRequest = buildShipRequest(
        user.userId,
        items,
        pickupTimeWindow,
        itemType,
        itemCategory,
        selectedRequests
      );

      console.log(
        "Creating ship request:",
        JSON.stringify(shipRequest, null, 2)
      );

      const response = await createShipRequest(shipRequest);

      console.log("Response:", JSON.stringify(response, null, 2));

      if (response?.isSuccess) {
        showSuccess("Tạo đơn hàng thành công!");
        setOrderDraft(null);
        setTimeout(() => {
          navigation.dispatch(StackActions.popToTop());
          const parent = navigation.getParent();
          if (parent) {
            parent.navigate("Order" as never);
          }
        }, 1500);
      } else {
        const errorMsg = response?.error?.description || "Tạo đơn thất bại";
        console.error("Create order error:", errorMsg);
        showError(errorMsg);
      }
    } catch (error: any) {
      console.error("Create order exception:", error);
      showError(error.message || "Có lỗi xảy ra");
    }
  };

  // --- Render functions ---
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
        Chi tiết đơn hàng
      </Text>
      <TouchableOpacity style={tw`w-10 h-10 items-center justify-center`}>
        <Feather name="file-plus" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  const renderRouteSection = () => (
    <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4 shadow-lg`}>
      <View style={tw`flex-row items-center mb-2`}>
        <Text style={tw`text-base font-semibold text-black`}>Lộ trình</Text>
        <View style={tw`flex-1`} />
        <TouchableOpacity
          style={tw`flex-row items-center`}
          onPress={handleSwapLocations}
          activeOpacity={0.7}
        >
          <FontAwesome5
            name="exchange-alt"
            size={16}
            color="black"
            style={{ transform: [{ rotate: "90deg" }] }}
          />
          <Text style={tw`ml-1 text-base font-semibold text-black`}>
            Hoán đổi
          </Text>
        </TouchableOpacity>
      </View>
      <View style={tw`mt-2`}>
        <TouchableOpacity
          style={tw`flex-row items-center mb-4 ${
            hasError("pickupLocation")
              ? "border border-red-500 rounded-lg p-2"
              : ""
          }`}
          onPress={handleNavigateBillingAddress}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="stop"
            size={14}
            color="white"
            style={tw`bg-black rounded-full p-1 `}
          />
          <View style={tw`ml-2 flex-1`}>
            <Text style={tw`text-xs text-gray-500`}>Địa chỉ lấy hàng</Text>
            <Text style={tw`text-sm text-black font-medium`} numberOfLines={2}>
              {pickupLocation?.fullAddress || "Chưa chọn địa chỉ lấy hàng"}
            </Text>
            {pickupLocation?.receiverName && (
              <Text style={tw`text-xs text-gray-600`}>
                {pickupLocation.receiverName} - {pickupLocation.receiverPhone}
              </Text>
            )}
            {hasError("pickupLocation") && (
              <Text style={tw`text-xs text-red-500 mt-1`}>
                {getError("pickupLocation")}
              </Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-row items-center ${
            hasError("dropoffLocation")
              ? "border border-red-500 rounded-lg p-2"
              : ""
          }`}
          onPress={handleNavigateShippingAddress}
          activeOpacity={0.8}
        >
          <Entypo
            name="arrow-down"
            size={14}
            color="#fff"
            style={tw`bg-[#00A982] rounded-full p-1 `}
          />
          <View style={tw`ml-2 flex-1`}>
            <Text style={tw`text-xs text-gray-500`}>Địa chỉ giao hàng</Text>
            <Text style={tw`text-sm text-black font-medium`} numberOfLines={2}>
              {dropoffLocation?.fullAddress || "Chưa chọn địa chỉ giao hàng"}
            </Text>
            {dropoffLocation?.receiverName && (
              <Text style={tw`text-xs text-gray-600`}>
                {dropoffLocation.receiverName} - {dropoffLocation.receiverPhone}
              </Text>
            )}
            {hasError("dropoffLocation") && (
              <Text style={tw`text-xs text-red-500 mt-1`}>
                {getError("dropoffLocation")}
              </Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderServiceSection = () => (
    <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4 shadow-lg`}>
      <TouchableOpacity
        style={tw`flex-row items-center mb-4`}
        onPress={() => setShowServiceOverlay(true)}
        activeOpacity={0.8}
      >
        {serviceType === "single" ? (
          <Ionicons
            name="cube-outline"
            size={24}
            color="#3B82F6"
            style={tw`w-6 h-6 rounded-full bg-[#E6F0FE] items-center justify-center`}
          />
        ) : (
          <Ionicons
            name="albums-outline"
            size={24}
            color="#8B5CF6"
            style={tw`w-6 h-6 rounded-full bg-[#F3E8FF] items-center justify-center`}
          />
        )}
        <View style={tw`ml-2 flex-1`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-base font-semibold text-black`}>
              {serviceType === "single" ? "Đơn lẻ" : "Đơn ghép"}
            </Text>
            <Ionicons
              name="information-circle-outline"
              size={14}
              color="#6B6B6B"
              style={tw`ml-1`}
            />
          </View>
          <Text style={tw`text-xs text-gray-500`}>
            {serviceType === "single" ? "Nhanh chóng" : "Tiết kiệm"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`flex-row items-center`}
        onPress={() => setShowPickupTimeOverlay(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="calendar-outline" size={22} color="#6B6B6B" />
        <View style={tw`ml-2 flex-1`}>
          <Text style={tw`text-base font-semibold text-black`}>
            Thời gian lấy hàng
          </Text>
          <Text style={tw`text-xs text-gray-500`}>
            {pickupTime === "standard"
              ? "Tiêu chuẩn (Lấy hàng trong ngày)"
              : pickupTime === "express"
              ? "Hoả tốc (Lấy hàng trong 2 giờ)"
              : "Chậm (Lấy hàng trong 24 giờ)"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
      </TouchableOpacity>
    </View>
  );

  // Render phần thông tin hàng hóa
  const renderGoodsInfoSection = () => (
    <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4 shadow-lg`}>
      <View style={tw`flex-row items-center mb-3`}>
        <MaterialCommunityIcons
          name="package-variant"
          size={20}
          color="#00A982"
        />
        <Text style={tw`ml-2 text-base font-semibold text-black`}>
          Thông tin hàng hóa <Text style={tw`text-[#00A982]`}>*</Text>
        </Text>
        <Ionicons
          name="information-circle-outline"
          size={14}
          color="#6B6B6B"
          style={tw`ml-1`}
        />
        <View style={tw`flex-1`} />
        <TouchableOpacity onPress={() => setShowGoodsInfo((v) => !v)}>
          <Ionicons
            name={showGoodsInfo ? "chevron-up" : "chevron-down"}
            size={18}
            color="#6B6B6B"
          />
        </TouchableOpacity>
      </View>

      {showGoodsInfo && (
        <>
          {/* itemCategory - Loại hàng hóa (Business/Personal) */}
          <TouchableOpacity
            style={tw`flex-row items-center mb-4 pb-4 border-b border-gray-200`}
            onPress={() => setShowGoodsTypeOverlay(true)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={
                values.goodsType === "private"
                  ? "briefcase-outline"
                  : "person-outline"
              }
              size={20}
              color={values.goodsType === "private" ? "#00A982" : "#3B82F6"}
            />
            <Text style={tw`ml-2 text-sm text-black`}>
              {values.goodsType === "private"
                ? "Hàng hóa doanh nghiệp (Business)"
                : "Hàng hóa cá nhân (Personal)"}
            </Text>
            <Ionicons
              name="information-circle-outline"
              size={14}
              color="#6B6B6B"
              style={tw`ml-1`}
            />
            <View style={tw`flex-1`} />
            <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
          </TouchableOpacity>

          {/* itemType - Loại sản phẩm (Thời trang, Điện tử, v.v.) */}
          <View style={tw`mb-4 pb-4 border-b border-gray-200`}>
            <Text style={tw`text-sm font-semibold text-black mb-3`}>
              Loại sản phẩm <Text style={tw`text-[#00A982]`}>*</Text>
            </Text>
            <View style={tw`flex-row`}>
              {categories.map((type) => {
                const displayText =
                  type === "Khác" && !categories.includes(orderCategory)
                    ? orderCategory
                    : type;
                const isSelected =
                  type === "Khác"
                    ? !categories.slice(0, -1).includes(orderCategory)
                    : orderCategory === type;

                return (
                  <TouchableOpacity
                    key={type}
                    style={tw`flex-1 px-3 py-2.5 rounded-full border mr-2 ${
                      isSelected
                        ? "bg-[#E6F7F3] border-[#00A982]"
                        : "bg-white border-gray-300"
                    } ${
                      type === categories[categories.length - 1] ? "mr-0" : ""
                    }`}
                    onPress={() => {
                      if (type === "Khác") {
                        setShowCategoryOverlay(true);
                      } else {
                        setOrderCategory(type);
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={tw`text-sm text-center ${
                        isSelected
                          ? "text-[#00A982] font-semibold"
                          : "text-black"
                      }`}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {displayText}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Danh sách sản phẩm */}
          <View style={tw`mb-3`}>
            <TouchableOpacity
              style={tw`flex-row items-center justify-between mb-3 py-2 px-3 bg-gray-50 rounded-lg`}
              onPress={() => setShowProductsList((v) => !v)}
              activeOpacity={0.7}
            >
              <View style={tw`flex-row items-center flex-1`}>
                <Ionicons name="cube-outline" size={18} color="#00A982" />
                <Text style={tw`ml-2 text-sm font-semibold text-black`}>
                  Danh sách sản phẩm
                </Text>
                <View style={tw`ml-2 bg-[#00A982] rounded-full px-2 py-0.5`}>
                  <Text style={tw`text-xs text-white font-semibold`}>
                    {products.length}
                  </Text>
                </View>
              </View>
              <Ionicons
                name={showProductsList ? "chevron-up" : "chevron-down"}
                size={18}
                color="#6B6B6B"
              />
            </TouchableOpacity>

            {showProductsList && (
              <>
                {products.map((product, index) => (
                  <View
                    key={product.id}
                    style={tw`mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200`}
                  >
                    {/* Header sản phẩm */}
                    <View style={tw`flex-row items-center mb-3`}>
                      <View style={tw`flex-row items-center flex-1`}>
                        <View
                          style={tw`w-6 h-6 rounded-full bg-[#00A982] items-center justify-center`}
                        >
                          <Text style={tw`text-xs text-white font-bold`}>
                            {index + 1}
                          </Text>
                        </View>
                        <Text style={tw`ml-2 text-sm font-semibold text-black`}>
                          {product.name || `Sản phẩm ${index + 1}`}
                        </Text>
                      </View>
                      {products.length > 1 && (
                        <TouchableOpacity
                          onPress={() => handleRemoveProduct(product.id)}
                          style={tw`p-1`}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={18}
                            color="#FF4D4F"
                          />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Hình ảnh sản phẩm */}
                    <View style={tw`mb-3`}>
                      <Text style={tw`text-xs text-gray-500 mb-2`}>
                        Hình ảnh sản phẩm
                      </Text>
                      {product.imageUri ? (
                        <View style={tw`relative`}>
                          <Image
                            source={{ uri: product.imageUri }}
                            style={tw`w-full h-40 rounded-lg`}
                            resizeMode="cover"
                          />
                          <TouchableOpacity
                            style={tw`absolute top-2 right-2 bg-white rounded-full p-1`}
                            onPress={() =>
                              handleUpdateProduct(product.id, "imageUri", "")
                            }
                          >
                            <Ionicons name="close" size={20} color="#FF4D4F" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={tw`flex-row gap-2`}>
                          <TouchableOpacity
                            style={tw`flex-1 border-2 border-dashed border-gray-300 rounded-lg py-4 items-center justify-center`}
                            onPress={() => handlePickImage(product.id)}
                          >
                            <Ionicons
                              name="images-outline"
                              size={32}
                              color="#6B6B6B"
                            />
                            <Text style={tw`text-xs text-gray-500 mt-2`}>
                              Chọn ảnh
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={tw`flex-1 border-2 border-dashed border-gray-300 rounded-lg py-4 items-center justify-center`}
                            onPress={() => handleTakePhoto(product.id)}
                          >
                            <Ionicons
                              name="camera-outline"
                              size={32}
                              color="#6B6B6B"
                            />
                            <Text style={tw`text-xs text-gray-500 mt-2`}>
                              Chụp ảnh
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                    {/* Tên sản phẩm */}
                    <View style={tw`mb-3`}>
                      <Text style={tw`text-xs text-gray-500 mb-1`}>
                        Tên sản phẩm <Text style={tw`text-[#00A982]`}>*</Text>
                      </Text>
                      <View style={tw`relative`}>
                        <TextInput
                          style={tw`border border-gray-300 rounded-lg px-3 py-2 text-base text-black pr-10`}
                          placeholder="Nhập tên sản phẩm"
                          placeholderTextColor="#6B6B6B"
                          value={product.name}
                          onChangeText={(text) =>
                            handleUpdateProduct(product.id, "name", text)
                          }
                        />
                        {product.name.length > 0 && (
                          <TouchableOpacity
                            style={tw`absolute right-3 top-1/2 -translate-y-1/2`}
                            onPress={() =>
                              handleUpdateProduct(product.id, "name", "")
                            }
                          >
                            <Ionicons
                              name="close-circle"
                              size={22}
                              color="#FF4D4F"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>

                    {/* Kích cỡ */}
                    <View style={tw`mb-3`}>
                      <View style={tw`flex-row items-center mb-2`}>
                        <Text style={tw`text-xs text-gray-500 flex-1`}>
                          Kích cỡ <Text style={tw`text-[#00A982]`}>*</Text>
                        </Text>
                        <TouchableOpacity>
                          <Text style={tw`text-xs text-[#00A982]`}>
                            Xem hình ảnh
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={tw`text-xs text-gray-400 mb-2`}>
                        Tối đa 25x32x12 cm
                      </Text>
                      <View style={tw`flex-row justify-between`}>
                        {sizes.map((size) => (
                          <TouchableOpacity
                            key={size}
                            style={tw`w-12 h-12 rounded-full border items-center justify-center ${
                              product.size === size
                                ? "bg-[#E6F7F3] border-[#00A982]"
                                : "bg-white border-gray-300"
                            }`}
                            onPress={() =>
                              handleUpdateProduct(product.id, "size", size)
                            }
                            activeOpacity={0.8}
                          >
                            <Text
                              style={tw`text-sm ${
                                product.size === size
                                  ? "text-[#00A982] font-semibold"
                                  : "text-black"
                              }`}
                            >
                              {size}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Khối lượng */}
                    <View>
                      <Text style={tw`text-xs text-gray-500 mb-1`}>
                        Khối lượng (kg){" "}
                        <Text style={tw`text-[#00A982]`}>*</Text>
                      </Text>
                      <View style={tw`relative`}>
                        <TextInput
                          style={tw`border border-gray-300 rounded-lg px-3 py-2 text-base text-black pr-10`}
                          placeholder="kg"
                          placeholderTextColor="#6B6B6B"
                          value={
                            product.weight.length > 0
                              ? `${parseFloat(
                                  product.weight
                                ).toLocaleString()} kg`
                              : ""
                          }
                          onChangeText={(text) => {
                            const onlyNumber = text.replace(/[^0-9.]/g, "");
                            handleUpdateProduct(
                              product.id,
                              "weight",
                              onlyNumber
                            );
                          }}
                          keyboardType="numeric"
                        />
                        {product.weight.length > 0 && (
                          <TouchableOpacity
                            style={tw`absolute right-3 top-1/2 -translate-y-1/2`}
                            onPress={() =>
                              handleUpdateProduct(product.id, "weight", "")
                            }
                          >
                            <Ionicons
                              name="close-circle"
                              size={22}
                              color="#FF4D4F"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                ))}

                {/* Nút thêm sản phẩm */}
                <TouchableOpacity
                  style={tw`flex-row items-center justify-center py-3 border border-dashed border-[#00A982] rounded-xl`}
                  onPress={handleAddProduct}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color="#00A982"
                  />
                  <Text style={tw`ml-2 text-sm text-[#00A982] font-semibold`}>
                    Thêm sản phẩm
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Ghi chú cho tài xế */}
          <TouchableOpacity
            style={tw`flex-row items-center border-t border-gray-200 pt-3 mt-3`}
            onPress={() => {
              setTempNote(values.driverNote ?? "");
              setShowNoteOverlay(true);
            }}
          >
            <Ionicons name="document-text-outline" size={18} color="#6B6B6B" />
            <Text style={tw`ml-2 text-sm text-black flex-1`}>
              Ghi chú cho tài xế
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
          </TouchableOpacity>
          {values.driverNote ? (
            <View
              style={tw`mt-2 px-2 py-2 bg-gray-100 rounded-lg flex-row items-center`}
            >
              <Text style={tw`text-sm text-gray-700 flex-1`}>
                {values.driverNote}
              </Text>
              <TouchableOpacity
                style={tw`ml-2 px-2 py-1`}
                onPress={() => setValue("driverNote", "")}
              >
                <Ionicons name="close-circle" size={18} color="#FF4D4F" />
              </TouchableOpacity>
            </View>
          ) : null}
        </>
      )}
    </View>
  );

  // Cập nhật renderSpecialRequestSection
  const renderSpecialRequestSection = () => (
    <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4 shadow-lg`}>
      <Text style={tw`text-base font-semibold text-black mb-2`}>
        Yêu cầu đặc biệt
      </Text>
      {specialRequests.map((item) => {
        const key = item.key as keyof typeof selectedRequests;
        const isSelected = selectedRequests[key];

        return (
          <View
            key={item.label}
            style={tw`flex-row items-center justify-between border border-gray-300 rounded-xl px-3 py-2 mb-2`}
          >
            <View style={tw`flex-col flex-1`}>
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-base text-black`}>{item.label}</Text>
                <TouchableOpacity activeOpacity={0.7} style={tw`ml-1`}>
                  <Ionicons
                    name="information-circle-outline"
                    size={14}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              <Text style={tw`text-xs text-gray-500 mt-1`}>
                ₫{parseInt(item.value).toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleToggleRequest(item)}
            >
              <View
                style={tw`w-6 h-6 ${
                  isSelected ? "bg-red-500" : "bg-[#00A982]"
                } rounded-full items-center justify-center`}
              >
                <Ionicons
                  name={isSelected ? "close" : "add"}
                  size={16}
                  color="white"
                />
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );

  const renderFooter = () => (
    <View style={tw`bg-white rounded-t-2xl mt-4 px-4 pt-2 pb-4`}>
      <View style={tw`flex-row border-b border-gray-200`}>
        <TouchableOpacity
          style={tw`flex-1 flex-row items-center justify-center py-3`}
        >
          <Ionicons name="pricetag-outline" size={18} color="#00A982" />
          <Text style={tw`ml-2 text-base font-semibold text-black`}>
            KHUYẾN MÃI
          </Text>
        </TouchableOpacity>
        <View style={tw`w-[1px] bg-gray-200`} />
        <TouchableOpacity
          style={tw`flex-1 flex-row items-center justify-center py-3`}
        >
          <Ionicons name="card-outline" size={18} color="#00A982" />
          <Text style={tw`ml-2 text-base font-semibold text-black`}>
            THANH TOÁN
          </Text>
        </TouchableOpacity>
      </View>
      <View style={tw`flex-row items-center justify-between my-4`}>
        <View style={tw`flex-row items-center`}>
          <Text
            style={tw`text-base text-black font-semibold`}
            numberOfLines={1}
          >
            Tổng phí
          </Text>
          <Ionicons
            name="information-circle-outline"
            size={14}
            color="#6B6B6B"
            style={tw`ml-1`}
            onPress={() => setShowPaymentDetail(true)}
          />
        </View>
        <Text style={tw`text-xl text-[#00A982] font-bold`}>
          ₫{totalFee.toLocaleString()}
        </Text>
      </View>
      <View style={tw`flex-row`}>
        <TouchableOpacity
          style={tw`flex-1 bg-[#00A982] py-3 rounded-xl mr-2 ${
            creatingOrder ? "opacity-50" : ""
          }`}
          onPress={handleCreateOrder}
          disabled={creatingOrder}
        >
          <Text style={tw`text-white text-center font-bold text-base`}>
            {creatingOrder ? "Đang tạo..." : "Tạo đơn"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1 bg-white border border-[#00A982] py-3 rounded-xl ml-2`}
          onPress={handleMatchRoute}
          activeOpacity={0.8}
        >
          <Text style={tw`text-[#00A982] text-center font-bold text-base`}>
            Tìm chuyến
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // --- Main render ---
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {renderHeader()}
      <ScrollView
        style={tw`flex-1 bg-[#F8FFFE]`}
        contentContainerStyle={tw`pb-6`}
      >
        <View style={{ position: "relative", minHeight: 1200 }}>
          <View style={{ position: "relative", zIndex: 1 }}>
            {renderRouteSection()}
            {renderServiceSection()}
            {renderGoodsInfoSection()}
            {renderSpecialRequestSection()}
          </View>
        </View>
      </ScrollView>

      {/* Overlays */}
      <DriverNoteOverlay
        visible={showNoteOverlay}
        value={tempNote}
        onChange={setTempNote}
        onCancel={() => setShowNoteOverlay(false)}
        onOk={() => {
          setValue("driverNote", tempNote);
          setShowNoteOverlay(false);
        }}
      />

      <ServiceSelectOverlay
        visible={showServiceOverlay}
        selected={serviceType}
        onSelect={(value) => {
          setServiceType(value);
          setShowServiceOverlay(false);
        }}
        onCancel={() => setShowServiceOverlay(false)}
      />

      <GoodsTypeOverlay
        visible={showGoodsTypeOverlay}
        selected={values.goodsType}
        onSelect={(value) => {
          setValue("goodsType", value as "private" | "personal");
          setShowGoodsTypeOverlay(false);
        }}
        onCancel={() => setShowGoodsTypeOverlay(false)}
      />

      <PickupTimeOverlay
        visible={showPickupTimeOverlay}
        selected={pickupTime}
        onSelect={(value) => {
          setPickupTime(value);
          setShowPickupTimeOverlay(false);
        }}
        onCancel={() => setShowPickupTimeOverlay(false)}
      />

      <PaymentDetailOverlay
        visible={showPaymentDetail}
        baseFee={55000}
        specialRequests={specialRequests}
        selectedRequests={Object.keys(selectedRequests).filter(
          (key) => selectedRequests[key as keyof typeof selectedRequests]
        )}
        totalFee={totalFee}
        onClose={() => setShowPaymentDetail(false)}
      />

      {/* Confirm Dialogs */}
      <ConfirmDialog
        visible={showSwapConfirm}
        title="Hoán đổi địa chỉ"
        message="Bạn có chắc muốn hoán đổi địa chỉ lấy hàng và giao hàng không?"
        type="warning"
        confirmText="Hoán đổi"
        cancelText="Hủy"
        onConfirm={confirmSwap}
        onCancel={() => setShowSwapConfirm(false)}
      />

      <ConfirmDialog
        visible={showCreateConfirm}
        title="Xác nhận tạo đơn"
        message="Bạn có chắc muốn tạo đơn hàng này không?"
        type="info"
        confirmText="Tạo đơn"
        cancelText="Hủy"
        onConfirm={confirmCreateOrder}
        onCancel={() => setShowCreateConfirm(false)}
      />

      {/* Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
        position="top"
        duration={3000}
      />

      {renderFooter()}

      <CategorySelectOverlay
        visible={showCategoryOverlay}
        categories={allCategories}
        selected={orderCategory}
        onSelect={setOrderCategory}
        onCancel={() => setShowCategoryOverlay(false)}
      />
    </SafeAreaView>
  );
}
