import { DriverOrder } from "src/types/driverOrder.interface";

const driverOrders: DriverOrder[] = [
  // --- Đơn lẻ - Đã hủy --- (Không thay đổi)
  {
    id: "1",
    type: "single",
    status: "cancelled",
    date: "28/6/2025 | 9:30",
    time: "29/6/2025 | 10:00",
    pickupAddress: "125 Cống Quỳnh, Phường Nguyễn Cư Trinh, Quận 1, TP.HCM",
    deliveryAddress: "77 Hoàng Văn Thái, Phường Tân Phú, Quận 7, TP.HCM",
    pickupCoordinates: { latitude: 10.7622, longitude: 106.6602 },
    deliveryCoordinates: { latitude: 10.7329, longitude: 106.7172 },
    totalQuantity: 5,
    totalWeight: "45kg",
    totalPrice: "0đ",
    productName: "Rau củ tươi - combo gia đình",
    productImage: require("../assets/pictures/auth/background.png"),
    customers: [
      {
        id: "1",
        name: "Nguyễn Thị Lan",
        phone: "0901234567",
        address: "77 Hoàng Văn Thái, Phường Tân Phú, Quận 7, TP.HCM",
        coordinates: { latitude: 10.7329, longitude: 106.7172 },
        rating: null,
        price: "400.000đ",
        orders: [
          {
            id: "order_1_1",
            productName: "Rau cải xanh hữu cơ",
            quantity: 2,
            weight: "10kg",
            price: "120.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          },
          {
            id: "order_1_2",
            productName: "Củ cải trắng Đà Lạt",
            quantity: 1,
            weight: "15kg",
            price: "80.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          },
          {
            id: "order_1_3",
            productName: "Cà rót tím organic",
            quantity: 2,
            weight: "20kg",
            price: "200.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          }
        ]
      }
    ]
  },

  // --- Đơn ghép - Đã hoàn thành (CẬP NHẬT: Tuyến Tiền Giang -> Đồng Nai) ---
  {
    id: "2",
    type: "grouped",
    status: "completed",
    date: "28/6/2025 | 9:30",
    time: "29/6/2025 | 18:00",
    pickupAddress: "Vựa trái cây Cái Bè, Huyện Cái Bè, Tiền Giang",
    deliveryAddress: "Tuyến Miền Tây - Đông Nam Bộ (Nhiều điểm)",
    pickupCoordinates: { latitude: 10.3204, longitude: 105.9080 },
    deliveryCoordinates: { latitude: 10.5752, longitude: 107.2414 }, // Tọa độ điểm cuối ở Long Thành
    totalQuantity: 12,
    totalWeight: "95kg",
    totalPrice: "+850.000đ",
    productName: "Trái cây nhập khẩu cao cấp",
    productImage: require("../assets/pictures/auth/background.png"),
    customers: [
      {
        id: "1",
        name: "Phạm Minh Quân",
        phone: "0912345678",
        // Điểm giao 1: Nằm ở TP.HCM, trên đường từ Tiền Giang đi Đồng Nai
        address: "Khu đô thị Phú Mỹ Hưng, Quận 7, TP.HCM",
        coordinates: { latitude: 10.7293, longitude: 106.7021 },
        rating: 5,
        price: "+320.000đ",
        orders: [
          {
            id: "order_2_1_1",
            productName: "Táo Envy New Zealand",
            quantity: 2,
            weight: "10kg",
            price: "180.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          },
          {
            id: "order_2_1_2",
            productName: "Nho đen Chile",
            quantity: 1,
            weight: "5kg",
            price: "140.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          }
        ]
      },
      {
        id: "2",
        name: "Trần Văn An",
        phone: "0923456789",
        // Điểm giao 2: Nằm ở Biên Hòa, tiếp tục trên tuyến đường
        address: "KCN Amata, P. Long Bình, TP. Biên Hòa, Đồng Nai",
        coordinates: { latitude: 10.9525, longitude: 106.8441 },
        rating: 5,
        price: "+280.000đ",
        orders: [
          {
            id: "order_2_2_1",
            productName: "Cam Úc cao cấp",
            quantity: 3,
            weight: "15kg",
            price: "160.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          },
          {
            id: "order_2_2_2",
            productName: "Kiwi vàng New Zealand",
            quantity: 2,
            weight: "8kg",
            price: "120.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          }
        ]
      },
      {
        id: "3",
        name: "Lê Thị Bích",
        phone: "0934567890",
        // Điểm giao 3: Điểm cuối của tuyến tại Long Thành
        address: "Sân bay Long Thành, Huyện Long Thành, Đồng Nai",
        coordinates: { latitude: 10.5752, longitude: 107.2414 },
        rating: 4,
        price: "+250.000đ",
        orders: [
          {
            id: "order_2_3_1",
            productName: "Dâu tây Hàn Quốc",
            quantity: 2,
            weight: "6kg",
            price: "200.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          },
          {
            id: "order_2_3_2",
            productName: "Cherry đỏ Mỹ",
            quantity: 2,
            weight: "10kg",
            price: "50.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          }
        ]
      }
    ]
  },

  // --- Đơn lẻ - Đang diễn ra --- (Không thay đổi)
  {
    id: "3",
    type: "single",
    status: "ongoing",
    date: "28/6/2025 | 9:30",
    time: "",
    pickupAddress: "47 Lê Duẩn, Phường Bến Nghé, Quận 1, TP.HCM",
    deliveryAddress: "Tòa nhà Landmark 81, Quận Bình Thạnh, TP.HCM",
    pickupCoordinates: { latitude: 10.7796, longitude: 106.6947 },
    deliveryCoordinates: { latitude: 10.7952, longitude: 106.7218 },
    totalQuantity: 8,
    totalWeight: "65kg",
    totalPrice: "+750.000đ",
    productName: "Hải sản tươi sống cao cấp",
    productImage: require("../assets/pictures/auth/background.png"),
    customers: [
      {
        id: "1",
        name: "Hoàng Văn Nam",
        phone: "0945678901",
        address: "Tòa nhà Landmark 81, Quận Bình Thạnh, TP.HCM",
        coordinates: { latitude: 10.7952, longitude: 106.7218 },
        rating: null,
        price: "+750.000đ",
        orders: [
          {
            id: "order_3_1_1",
            productName: "Tôm hùm Alaska tươi",
            quantity: 2,
            weight: "15kg",
            price: "300.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          },
          {
            id: "order_3_1_2",
            productName: "Cua hoàng đế Canada",
            quantity: 1,
            weight: "20kg",
            price: "250.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          },
          {
            id: "order_3_1_3",
            productName: "Cá hồi Na Uy fillet",
            quantity: 3,
            weight: "18kg",
            price: "120.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          },
          {
            id: "order_3_1_4",
            productName: "Bào ngư tự nhiên",
            quantity: 2,
            weight: "12kg",
            price: "80.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          }
        ]
      }
    ]
  },

  // --- Đơn ghép - Đang diễn ra (CẬP NHẬT: Tuyến Bắc-Nam: HCM -> Đà Nẵng -> Hà Nội) ---
  {
    id: "4",
    type: "grouped",
    status: "ongoing",
    date: "30/6/2025 | 10:00",
    time: "",
    pickupAddress: "Khu công nghệ cao, TP. Thủ Đức, TP.HCM",
    deliveryAddress: "Tuyến Bắc - Nam (HCM - Đà Nẵng - Hà Nội)",
    pickupCoordinates: { latitude: 10.8506, longitude: 106.7717 },
    deliveryCoordinates: { latitude: 21.0285, longitude: 105.8542 }, // Tọa độ điểm cuối ở Hà Nội
    totalQuantity: 15,
    totalWeight: "320kg",
    totalPrice: "+2.800.000đ",
    productName: "Linh kiện điện tử và thiết bị công nghiệp",
    productImage: require("../assets/pictures/auth/background.png"),
    customers: [
      {
        id: "1",
        name: "Công ty TNHH TechLink Đà Nẵng",
        phone: "0956789012",
        // Điểm giao 1: Nằm ở Đà Nẵng, chặng giữa của tuyến
        address: "KCN Hòa Khánh, Q. Liên Chiểu, TP. Đà Nẵng",
        coordinates: { latitude: 16.0748, longitude: 108.1499 },
        rating: null,
        price: "+1.200.000đ",
        orders: [
          {
            id: "order_4_1_1",
            productName: "Bo mạch chủ công nghiệp",
            quantity: 5,
            weight: "80kg",
            price: "800.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          },
          {
            id: "order_4_1_2",
            productName: "Cảm biến nhiệt độ chính xác cao",
            quantity: 3,
            weight: "15kg",
            price: "400.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          }
        ]
      },
      {
        id: "2",
        name: "Nhà máy Vinsmart Hà Nội",
        phone: "0967890123",
        // Điểm giao 2: Điểm cuối của tuyến ở Hà Nội
        address: "Khu công nghệ cao Hoà Lạc, Thạch Thất, Hà Nội",
        coordinates: { latitude: 21.0285, longitude: 105.8542 },
        rating: null,
        price: "+1.000.000đ",
        orders: [
          {
            id: "order_4_2_1",
            productName: "Module LED chuyên dụng",
            quantity: 4,
            weight: "45kg",
            price: "600.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          },
          {
            id: "order_4_2_2",
            productName: "Linh kiện bán dẫn chất lượng cao",
            quantity: 2,
            weight: "25kg",
            price: "400.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          }
        ]
      },
      {
        id: "3",
        name: "Tập đoàn FPT (Trụ sở chính)",
        phone: "0978901234",
        // Điểm giao 3: Cũng là một điểm cuối ở Hà Nội
        address: "Tòa nhà FPT, 17 Duy Tân, Cầu Giấy, Hà Nội",
        coordinates: { latitude: 21.0288, longitude: 105.7836 },
        rating: null,
        price: "+600.000đ",
        orders: [
          {
            id: "order_4_3_1",
            productName: "Thiết bị mạng doanh nghiệp",
            quantity: 1,
            weight: "155kg",
            price: "600.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          }
        ]
      }
    ]
  },

  // --- Đơn ghép - Đã hoàn thành (CẬP NHẬT: Tuyến Miền Tây: HCM -> Vĩnh Long -> Cần Thơ) ---
  {
    id: "5",
    type: "grouped",
    status: "completed",
    date: "25/6/2025 | 7:00",
    time: "25/6/2025 | 16:30",
    pickupAddress: "Chợ đầu mối Bình Điền, Đại lộ Nguyễn Văn Linh, Quận 8, TP.HCM",
    deliveryAddress: "Tuyến Miền Tây (HCM - Vĩnh Long - Cần Thơ)",
    pickupCoordinates: { latitude: 10.7220, longitude: 106.6025 },
    deliveryCoordinates: { latitude: 10.0144, longitude: 105.7644 }, // Tọa độ điểm cuối ở Cái Răng, Cần Thơ
    totalQuantity: 18,
    totalWeight: "280kg",
    totalPrice: "+3.200.000đ",
    productName: "Đặc sản vùng miền và thực phẩm chế biến",
    productImage: require("../assets/pictures/auth/background.png"),
    customers: [
      {
        id: "1",
        name: "Nhà hàng ven sông Cửu Long",
        phone: "0989012345",
        // Điểm giao 1: Nằm ở Vĩnh Long, trên đường từ HCM đi Cần Thơ
        address: "Phà Đình Khao, Xã An Bình, Huyện Long Hồ, Vĩnh Long",
        coordinates: { latitude: 10.2706, longitude: 105.9754 },
        rating: 5,
        price: "+1.800.000đ",
        orders: [
          {
            id: "order_5_1_1",
            productName: "Cá tra sông Hậu tươi",
            quantity: 5,
            weight: "100kg",
            price: "800.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          },
          {
            id: "order_5_1_2",
            productName: "Tôm càng xanh U Minh",
            quantity: 3,
            weight: "45kg",
            price: "600.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          },
          {
            id: "order_5_1_3",
            productName: "Gạo ST25 chính gốc",
            quantity: 2,
            weight: "50kg",
            price: "400.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          }
        ]
      },
      {
        id: "2",
        name: "Cửa hàng Quà Việt",
        phone: "0990123456",
        // Điểm giao 2: Điểm cuối của tuyến tại Cần Thơ
        address: "Chợ nổi Cái Răng, Q. Cái Răng, TP. Cần Thơ",
        coordinates: { latitude: 10.0144, longitude: 105.7644 },
        rating: 5,
        price: "+1.000.000đ",
        orders: [
          {
            id: "order_5_2_1",
            productName: "Bánh tráng Tây Ninh đặc biệt",
            quantity: 4,
            weight: "20kg",
            price: "300.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          },
          {
            id: "order_5_2_2",
            productName: "Mắm ruốc Cà Mau thượng hạng",
            quantity: 3,
            weight: "18kg",
            price: "400.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          },
          {
            id: "order_5_2_3",
            productName: "Kẹo dừa Bến Tre truyền thống",
            quantity: 1,
            weight: "12kg",
            price: "300.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          }
        ]
      },
      {
        id: "3",
        name: "Siêu thị Co.opmart Cần Thơ",
        phone: "0901234567",
        // Điểm giao 3: Cũng là một điểm cuối tại Cần Thơ
        address: "Bến Ninh Kiều, P. Tân An, Q. Ninh Kiều, TP. Cần Thơ",
        coordinates: { latitude: 10.0452, longitude: 105.7469 },
        rating: 4,
        price: "+400.000đ",
        orders: [
          {
            id: "order_5_3_1",
            productName: "Chả cá Nha Trang đông lạnh",
            quantity: 2,
            weight: "25kg",
            price: "250.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          },
          {
            id: "order_5_3_2",
            productName: "Nem nướng Ninh Hòa",
            quantity: 1,
            weight: "10kg",
            price: "150.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          }
        ]
      }
    ]
  },

  // --- Đơn lẻ - Đã hoàn thành (HCM -> Đà Nẵng) --- (Không thay đổi)
  {
    id: "6",
    type: "single",
    status: "completed",
    date: "20/6/2025 | 16:00",
    time: "22/6/2025 | 9:00",
    pickupAddress: "Tân cảng Cát Lái, Phường Cát Lái, TP. Thủ Đức, TP.HCM",
    deliveryAddress: "Cầu Rồng, Phường An Hải Tây, Quận Sơn Trà, TP. Đà Nẵng",
    pickupCoordinates: { latitude: 10.7953, longitude: 106.8197 },
    deliveryCoordinates: { latitude: 16.0544, longitude: 108.2022 },
    totalQuantity: 25,
    totalWeight: "800kg",
    totalPrice: "+8.500.000đ",
    productName: "Hàng may mặc xuất khẩu cao cấp",
    productImage: require("../assets/pictures/auth/background.png"),
    customers: [
      {
        id: "1",
        name: "Công ty Dệt May Hoà Thọ",
        phone: "0912345678",
        address: "Cầu Rồng, Phường An Hải Tây, Quận Sơn Trà, TP. Đà Nẵng",
        coordinates: { latitude: 16.0544, longitude: 108.2022 },
        rating: 5,
        price: "+8.500.000đ",
        orders: [
          {
            id: "order_6_1_1",
            productName: "Áo sơ mi nam xuất khẩu EU",
            quantity: 10,
            weight: "200kg",
            price: "3.000.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          },
          {
            id: "order_6_1_2",
            productName: "Váy công sở nữ cao cấp",
            quantity: 8,
            weight: "160kg",
            price: "2.500.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          },
          {
            id: "order_6_1_3",
            productName: "Quần jean premium denim",
            quantity: 5,
            weight: "300kg",
            price: "2.000.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          },
          {
            id: "order_6_1_4",
            productName: "Áo khoác dạ mùa đông",
            quantity: 2,
            weight: "140kg",
            price: "1.000.000đ",
            image: require("../assets/pictures/home/ad1.png"),
          }
        ]
      }
    ]
  }
];

export default driverOrders;