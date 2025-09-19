import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Svg, { Path } from "react-native-svg";
import tw from "twrnc";

const { width: screenWidth } = Dimensions.get("window");

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const activeTabIndex = state.index;
  const tabWidth = screenWidth / state.routes.length;

  return (
    <View style={tw`relative`}>
      <View
        style={[
          tw`flex-row justify-around items-center relative rounded-t-xl`,
          {
            height: 70,
            backgroundColor: "#EFEFEF",
          },
        ]}
      >
        <View
          style={[
            tw`absolute`,
            {
              width: 110,
              height: 55,
              top: 0,
              left: activeTabIndex * tabWidth + (tabWidth - 110) / 2,
            },
          ]}
        >
          <Svg width={110} height={55} viewBox="0 0 110 55">
            <Path
              d="M110 0C83.5 0 102 54.5 55 54.5C8 54.5 27 0 0 0H110Z"
              fill="#FCFCFC"
            />
          </Svg>
        </View>

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const { options } = descriptors[route.key];
          let label: string;
          if (typeof options.tabBarLabel === "function") {
            label = route.name;
          } else if (options.tabBarLabel !== undefined) {
            label = options.tabBarLabel as string;
          } else if (options.title !== undefined) {
            label = options.title as string;
          } else {
            label = route.name;
          }

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName: keyof typeof Ionicons.glyphMap = "home";
          let displayLabel = label;
          switch (route.name) {
            case "Home":
              iconName = "home";
              displayLabel = "Trang chủ";
              break;
            case "Trip":
              iconName = "car";
              displayLabel = "Chuyến đi";
              break;
            case "Order":
              iconName = "time";
              displayLabel = "Đơn hàng";
              break;
            case "Voucher":
              iconName = "pricetag";
              displayLabel = "Ví voucher";
              break;
            case "User":
              iconName = "person";
              displayLabel = "Người dùng";
              break;
            case "Statistic":
              iconName = "bar-chart";
              displayLabel = "Thống kê";
              break;
          }

          if (isFocused) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={[
                  tw`items-center justify-center`,
                  {
                    width: tabWidth,
                    marginTop: -37,
                  },
                ]}
              >
                <View
                  style={[
                    tw`w-16 h-16 rounded-full justify-center items-center`,
                    {
                      backgroundColor: "#00A982",
                      elevation: 8,
                      shadowColor: "#000",
                      shadowOpacity: 0.3,
                      shadowRadius: 6,
                      shadowOffset: { width: 0, height: 4 },
                    },
                  ]}
                >
                  <Ionicons name={iconName} size={18} color="white" />
                  <Text
                    style={[
                      tw`text-xs font-medium text-center`,
                      { color: "white", fontSize: 10 },
                    ]}
                  >
                    {displayLabel}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[tw`items-center justify-center`, { width: tabWidth }]}
            >
              <View style={tw`items-center`}>
                <Ionicons name={iconName} size={20} color="#6B6B6B" />
                <Text style={[tw`text-xs mt-1`, { color: "#6B6B6B" }]}>
                  {displayLabel}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
