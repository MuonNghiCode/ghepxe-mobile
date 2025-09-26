import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import tw from "twrnc";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCurrentLocation } from "src/hooks/useCurrentLocation";

const { width: screenWidth } = Dimensions.get("window");

const adData = [
  require("../../../assets/pictures/home/ad1.png"),
  require("../../../assets/pictures/home/ad2.png"),
  require("../../../assets/pictures/home/ad3.png"),
  require("../../../assets/pictures/home/ad4.png"),
  require("../../../assets/pictures/home/ad5.png"),
];

const exploreData = [
  { id: "1", image: require("../../../assets/pictures/home/service1.png") },
  { id: "2", image: require("../../../assets/pictures/home/service2.png") },
  { id: "3", image: require("../../../assets/pictures/home/service3.png") },
];

export default function UserHomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deliveryLocation, setDeliveryLocation] = useState(
    "Bạn muốn giao hàng đến đâu?"
  );
  const [showAllServices, setShowAllServices] = useState(false);

  const {
    address: pickupLocation,
    loading,
    error,
    refresh,
  } = useCurrentLocation();

  const flatListRef = useRef<FlatList<any>>(null);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);
  const navigation = useNavigation();
  const shadowStyle = useMemo(
    () => ({
      shadowColor: "#00A982",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
    }),
    []
  );

  const overlayStyle = useMemo(
    () => ({
      backgroundColor: "rgba(0,0,0,0.2)",
    }),
    []
  );

  const startAutoScroll = useCallback(() => {
    autoScrollInterval.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % adData.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 4000);
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
  }, [startAutoScroll, stopAutoScroll]);

  const handleScrollEnd = useCallback((event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / 240);
    setCurrentIndex(index);
  }, []);

  const handlePaginationPress = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      flatListRef.current?.scrollToIndex({ index, animated: true });
      stopAutoScroll();
      setTimeout(startAutoScroll, 5000);
    },
    [startAutoScroll, stopAutoScroll]
  );

  const renderAdItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <Image
        source={item}
        style={tw`${
          index !== adData.length - 1 ? "mr-3" : ""
        } w-60 h-34 rounded-xl`}
        resizeMode="cover"
      />
    ),
    []
  );

  const renderExploreItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity style={tw`items-center flex-1`}>
        <Image source={item.image} style={tw`w-28 h-28`} />
      </TouchableOpacity>
    ),
    []
  );
  const allServiceData = [
    {
      id: "delivery",
      image: require("../../../assets/pictures/home/giaohang.png"),
      title: "Giao hàng",
    },
    {
      id: "city",
      image: require("../../../assets/pictures/home/noithanh.png"),
      title: "Nội thành",
    },
    {
      id: "province",
      image: require("../../../assets/pictures/home/lientinh.png"),
      title: "Liên tỉnh",
    },
    {
      id: "express",
      image: require("../../../assets/pictures/home/lientinh.png"),
      title: "Hỏa tốc",
    },
    {
      id: "cod",
      image: require("../../../assets/pictures/home/lientinh.png"),
      title: "Thu hộ COD",
    },
    {
      id: "fragile",
      image: require("../../../assets/pictures/home/lientinh.png"),
      title: "Hàng dễ vỡ",
    },
    {
      id: "bulk",
      image: require("../../../assets/pictures/home/lientinh.png"),
      title: "Hàng cồng kềnh",
    },
    {
      id: "food",
      image: require("../../../assets/pictures/home/lientinh.png"),
      title: "Thực phẩm",
    },
  ];

  const displayedServices = showAllServices
    ? allServiceData
    : allServiceData.slice(0, 3);

  const toggleShowAllServices = useCallback(() => {
    setShowAllServices((prev) => !prev);
  }, []);

  const renderServiceGrid = useCallback(() => {
    if (showAllServices) {
      return (
        <View style={tw`mt-2`}>
          <View style={tw`flex-row flex-wrap justify-between`}>
            {allServiceData.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={tw`items-center w-1/4 mb-4`}
                onPress={() => {
                  console.log(`Navigate to ${service.id}`);
                }}
              >
                <Image source={service.image} style={tw`w-12 h-12`} />
                <Text
                  style={tw`mt-1 text-xs font-semibold text-gray-700 text-center`}
                >
                  {service.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={tw`items-center mt-2`}
            onPress={toggleShowAllServices}
          >
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-[#00A982] font-semibold mr-1`}>Thu gọn</Text>
              <Ionicons name="chevron-up" size={16} color="#00A982" />
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={tw`flex-row items-center justify-between mx-1 mt-2`}>
          {displayedServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={tw`items-center`}
              onPress={() => {
                console.log(`Navigate to ${service.id}`);
              }}
            >
              <Image source={service.image} style={tw`w-14 h-14`} />
              <Text style={tw`mt-2 text-xs font-semibold text-gray-700`}>
                {service.title}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={tw`items-center`}
            onPress={toggleShowAllServices}
          >
            <Ionicons name="ellipsis-horizontal" size={40} color="#00A982" />
            <Text style={tw`mt-2 text-xs font-semibold text-gray-700`}>
              Thêm
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }, [showAllServices, displayedServices, toggleShowAllServices]);

  return (
    <View style={tw`flex-1 bg-[#fcfcfc]`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 0 }}
      >
        <View style={tw`relative`}>
          <Image
            source={require("../../../assets/pictures/home/background.png")}
            style={[tw`h-75`, { width: screenWidth }]}
            resizeMode="cover"
          />
          <View style={[tw`absolute inset-0`, overlayStyle]} />

          <TouchableOpacity
            style={tw`absolute top-12 right-6`}
            onPress={() => navigation.navigate("User" as never)}
          >
            <View
              style={tw`w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-[#00A982] items-center justify-center`}
            >
              <Text style={tw`text-white font-bold text-lg`}>P</Text>
            </View>
          </TouchableOpacity>

          <View style={tw`absolute bottom-30 left-6`}>
            <Text
              style={[
                tw`text-white text-3xl max-w-[160px]`,
                { fontFamily: "RobotoSerifSemiBold", lineHeight: 32 },
              ]}
            >
              Bạn đã lên{"\n"}đơn chưa?
            </Text>
          </View>
        </View>

        <View style={tw`bg-white rounded-t-[3rem] -mt-10 pt-4 w-full`}>
          <View style={tw`px-5`}>
            <View
              style={[tw`-mt-15 mb-4 bg-white rounded-2xl p-3`, shadowStyle]}
            >
              <TouchableOpacity
                style={tw`flex-row items-center mb-3`}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Billing" as never)}
              >
                <MaterialCommunityIcons
                  name="stop"
                  size={16}
                  color="white"
                  style={tw`bg-black rounded-full p-1 `}
                />
                <Text
                  style={tw`flex-1 text-base font-medium text-gray-600 py-2 ml-5`}
                  numberOfLines={1}
                >
                  {loading ? "Đang lấy vị trí..." : pickupLocation}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`flex-row items-center mb-2`}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Shipping" as never)}
              >
                <Entypo
                  name="arrow-down"
                  size={16}
                  color="#fff"
                  style={tw`bg-[#00A982] rounded-full p-1 `}
                />
                <Text
                  style={tw`flex-1 text-base font-medium text-gray-600 ml-5`}
                >
                  {deliveryLocation}
                </Text>
              </TouchableOpacity>
            </View>

            {renderServiceGrid()}

            <View style={tw`mt-6`}>
              <FlatList
                ref={flatListRef}
                data={adData}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={240}
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal: 0 }}
                renderItem={renderAdItem}
                keyExtractor={(_, index) => index.toString()}
                onMomentumScrollEnd={handleScrollEnd}
                onScrollBeginDrag={stopAutoScroll}
                onScrollEndDrag={() => setTimeout(startAutoScroll, 3000)}
                getItemLayout={(_, index) => ({
                  length: 240,
                  offset: 240 * index,
                  index,
                })}
              />

              <View style={tw`flex-row mt-3 ml-3`}>
                {adData.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handlePaginationPress(index)}
                    style={[
                      tw`h-1 rounded-full mr-1`,
                      {
                        width: currentIndex === index ? 24 : 12,
                        backgroundColor:
                          currentIndex === index ? "#00A982" : "#D1D5DB",
                      },
                    ]}
                  />
                ))}
              </View>
            </View>

            <Text style={tw`mt-6 mb-3 text-base font-semibold text-gray-700`}>
              Tìm hiểu thêm
            </Text>
            <FlatList
              data={exploreData}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderExploreItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={tw`gap-3 mb-6`}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
