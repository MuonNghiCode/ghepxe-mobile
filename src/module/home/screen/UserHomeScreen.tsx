import { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

export default function UserHomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  const data = [
    require("../../../assets/pictures/home/ad1.png"),
    require("../../../assets/pictures/home/ad2.png"),
    require("../../../assets/pictures/home/ad3.png"),
    require("../../../assets/pictures/home/ad4.png"),
    require("../../../assets/pictures/home/ad5.png"),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % data.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={tw`flex-1 bg-[#fcfcfc]`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={tw`relative`}>
          <Image
            source={require("../../../assets/pictures/home/background.png")}
            style={tw`w-full h-75`}
            resizeMode="cover"
          />
          <View
            style={[
              tw`absolute inset-0`,
              { backgroundColor: "rgba(0,0,0,0.2)" },
            ]}
          />
          <TouchableOpacity style={tw`absolute top-12 right-6`}>
            <View
              style={tw`w-10 h-10 rounded-full border-2 border-white overflow-hidden`}
            >
              <Image
                source={require("../../../assets/pictures/home/avt.png")}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
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
        <View style={tw`bg-white rounded-t-[3rem] -mt-10 pt-4 px-0 w-full`}>
          <View style={tw`px-5`}>
            <View
              style={[
                tw`mx-0 -mt-15 mb-4 bg-white rounded-2xl p-3`,
                {
                  shadowColor: "#00A982",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 8,
                },
              ]}
            >
              <View style={tw`flex-row items-center mb-2`}>
                <View style={tw`w-2 h-2 rounded-full bg-black mr-3 ml-1`} />
                <TextInput
                  style={tw`flex-1 text-base font-medium text-black py-2`}
                  value="Bạn muốn đặt hàng ở đâu?"
                />
              </View>
              <View style={tw`flex-row items-center`}>
                <View style={tw`w-2 h-2 rounded-full bg-[#00A982] mr-3 ml-1`} />
                <TextInput
                  style={tw`flex-1 text-base py-2`}
                  placeholder="Bạn muốn giao hàng đến đâu?"
                  placeholderTextColor="#6B6B6B"
                />
              </View>
            </View>
            <View style={tw`flex-row items-center justify-between mx-1 mt-2`}>
              <TouchableOpacity style={tw`items-center`}>
                <Image
                  source={require("../../../assets/pictures/home/giaohang.png")}
                  style={tw`w-14 h-14`}
                />
                <Text style={tw`mt-2 text-xs text-gray-700`}>Giao hàng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={tw`items-center`}>
                <Image
                  source={require("../../../assets/pictures/home/noithanh.png")}
                  style={tw`w-14 h-14`}
                />
                <Text style={tw`mt-2 text-xs text-gray-700`}>Nội thành</Text>
              </TouchableOpacity>
              <TouchableOpacity style={tw`items-center`}>
                <Image
                  source={require("../../../assets/pictures/home/lientinh.png")}
                  style={tw`w-14 h-14`}
                />
                <Text style={tw`mt-2 text-xs text-gray-700`}>Liên tỉnh</Text>
              </TouchableOpacity>
              <View style={tw`items-center`}>
                <Ionicons
                  name="ellipsis-horizontal-circle"
                  size={50}
                  color="#00A982"
                />
                <Text style={tw`mt-2 text-xs text-gray-700`}>Thêm</Text>
              </View>
            </View>
            {/* <View style={tw`mt-6 h-0.5 bg-gray-100`} /> */}
            <View style={tw`mt-6`}>
              <FlatList
                ref={flatListRef}
                data={data}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={240}
                decelerationRate="fast"
                contentContainerStyle={tw`px-0`}
                style={tw`w-full`}
                renderItem={({ item, index }) => (
                  <Image
                    source={item}
                    style={tw`${
                      index !== data.length - 1 ? "mr-3" : ""
                    } w-60 h-34 rounded-xl`}
                    resizeMode="cover"
                  />
                )}
                keyExtractor={(index) => index.toString()}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x / 240
                  );
                  setCurrentIndex(index);
                }}
              />
              <View style={tw`flex-row mt-3 ml-3`}>
                {[0, 1, 2, 3, 4].map((index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setCurrentIndex(index);
                      flatListRef.current?.scrollToIndex({
                        index,
                        animated: true,
                      });
                    }}
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
            <View style={tw`flex-row justify-between mb-6 gap-3`}>
              <View style={tw`items-center flex-1`}>
                <Image
                  source={require("../../../assets/pictures/home/service1.png")}
                  style={tw`w-28 h-28`}
                />
              </View>
              <View style={tw`items-center flex-1`}>
                <Image
                  source={require("../../../assets/pictures/home/service2.png")}
                  style={tw`w-28 h-28`}
                />
              </View>
              <View style={tw`items-center flex-1`}>
                <Image
                  source={require("../../../assets/pictures/home/service3.png")}
                  style={tw`w-28 h-28`}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
