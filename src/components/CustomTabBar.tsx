import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import tw from "twrnc";

const { width: screenWidth } = Dimensions.get("window");

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const activeTabIndex = state.index;
  const tabWidth = screenWidth / state.routes.length;

  // Animation values
  const animatedPosition = useSharedValue(0);
  const animatedScale = useSharedValue(1);
  const activeButtonPosition = useSharedValue(0);

  // Update position when active tab changes
  useEffect(() => {
    // SVG position
    const targetPosition = activeTabIndex * tabWidth + tabWidth / 2 - 192.5;
    animatedPosition.value = withSpring(targetPosition, {
      damping: 15,
      stiffness: 150,
      mass: 1,
    });

    // Active button position
    const activeButtonTarget = activeTabIndex * tabWidth + tabWidth / 2 - 192.5; // 32 = w-16 / 2
    activeButtonPosition.value = withSpring(activeButtonTarget, {
      damping: 15,
      stiffness: 150,
      mass: 1,
    });

    // Scale animation for feedback
    animatedScale.value = withTiming(
      1.1,
      {
        duration: 100,
        easing: Easing.out(Easing.quad),
      },
      () => {
        animatedScale.value = withTiming(1, {
          duration: 150,
          easing: Easing.out(Easing.quad),
        });
      }
    );
  }, [activeTabIndex, tabWidth]);

  // Animated styles for SVG background
  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: animatedPosition.value },
      { scale: animatedScale.value },
    ],
  }));

  // Animated styles for active button
  const animatedActiveButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: activeButtonPosition.value },
      { scale: animatedScale.value },
    ],
  }));

  // Animated styles for tab icons
  const getAnimatedIconStyle = (index: number) => {
    return useAnimatedStyle(() => {
      const isActive = index === activeTabIndex;
      return {
        transform: [
          {
            scale: withSpring(isActive ? 1 : 0.9, {
              damping: 15,
              stiffness: 200,
            }),
          },
        ],
        opacity: withTiming(isActive ? 1 : 0.7, {
          duration: 200,
        }),
      };
    });
  };

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
        {/* Animated SVG Background */}
        <Animated.View
          style={[
            tw`absolute`,
            {
              width: 110,
              height: 55,
              top: 0,
            },
            animatedBackgroundStyle,
          ]}
        >
          <Svg width={110} height={55} viewBox="0 0 110 55">
            <Path
              d="M110 0C83.5 0 102 54.5 55 54.5C8 54.5 27 0 0 0H110Z"
              fill="#FCFCFC"
            />
          </Svg>
        </Animated.View>

        {/* Animated Active Button Background */}
        <Animated.View
          style={[
            tw`absolute w-16 h-16 rounded-full justify-center items-center`,
            {
              backgroundColor: "#00A982",
              top: -20,
              elevation: 8,
              shadowColor: "#000",
              shadowOpacity: 0.3,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 4 },
            },
            animatedActiveButtonStyle,
          ]}
        >
          {/* Active Tab Content */}
          {state.routes.map((route, index) => {
            if (index !== activeTabIndex) return null;

            let iconName: keyof typeof Ionicons.glyphMap = "home";
            let displayLabel = "";

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

            return (
              <View key={route.key} style={tw`items-center`}>
                <Ionicons name={iconName} size={22} color="white" />
                <Text
                  style={[
                    tw`text-xs font-medium text-center mt-1`,
                    { color: "white", fontSize: 9 },
                  ]}
                >
                  {displayLabel}
                </Text>
              </View>
            );
          })}
        </Animated.View>

        {/* Tab Buttons */}
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

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
          let displayLabel = "";

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

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[
                tw`items-center justify-center`,
                {
                  width: tabWidth,
                  height: 70,
                },
              ]}
            >
              {!isFocused && (
                <Animated.View
                  style={[
                    tw`items-center justify-center`,
                    getAnimatedIconStyle(index),
                  ]}
                >
                  <Ionicons name={iconName} size={20} color="#6B6B6B" />
                  <Text
                    style={[tw`text-xs mt-1 text-center`, { color: "#6B6B6B" }]}
                  >
                    {displayLabel}
                  </Text>
                </Animated.View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
