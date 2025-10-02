const suggestedOrders: {
  id: string;
  serviceType: "single" | "shared";
  requestTime: string;
  pickup: { address: string; details: string };
  delivery: { address: string; distance: string };
  price: string;
  co2Reduction: string;
  status: string;
}[] = [
  {
    id: "1",
    serviceType: "single",
    requestTime: "1 giờ trước",
    pickup: {
      address: "TP. Hồ Chí Minh",
      details: "Quần áo • 8kg • 35x25x15cm",
    },
    delivery: {
      address: "TP. Vũng Tàu",
      distance: "100km - 2h",
    },
    price: "+120.000đ",
    co2Reduction: "Giảm 12kg CO₂ với đơn này",
    status: "CHỜ XÁC NHẬN",
  },
  {
    id: "2",
    serviceType: "shared",
    requestTime: "30 phút trước",
    pickup: {
      address: "TP. Hồ Chí Minh",
      details: "Quận 1 • 5kg • 20x15x10cm",
    },
    delivery: {
      address: "TP. Biên Hòa",
      distance: "50km - 1h",
    },
    price: "+85.000đ",
    co2Reduction: "Giảm 8kg CO₂ với đơn này",
    status: "ĐANG GIAO",
  },
  {
    id: "3",
    serviceType: "shared",
    requestTime: "2 giờ trước",
    pickup: {
      address: "TP. Hồ Chí Minh",
      details: "Đồ điện tử • 3kg • 30x20x10cm",
    },
    delivery: {
      address: "TP. Thủ Đức",
      distance: "25km - 45min",
    },
    price: "+60.000đ",
    co2Reduction: "Giảm 5kg CO₂ với đơn này",
    status: "CHỜ XÁC NHẬN",
  },
];

export default suggestedOrders;