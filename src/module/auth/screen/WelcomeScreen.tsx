import React, { useEffect } from "react";
import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../navigation/type";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withDelay,
  withSequence,
  Easing,
} from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function WelcomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const logoTranslateY = useSharedValue(50);
  const animationTranslateY = useSharedValue(0);
  const barAnimations = Array.from({ length: 5 }, () => ({
    translateY: useSharedValue(0),
    opacity: useSharedValue(1),
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value },
      { translateY: logoTranslateY.value },
    ],
  }));

  const barStyles = barAnimations.map((bar) =>
    useAnimatedStyle(() => ({
      transform: [{ translateY: bar.translateY.value }],
      opacity: bar.opacity.value,
    }))
  );

  const animationContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: animationTranslateY.value }],
  }));

  useEffect(() => {
    logoOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.quad),
    });
    logoScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.back(1.5)),
    });
    logoTranslateY.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.quad),
    });

    setTimeout(() => {
      logoScale.value = withSequence(
        withTiming(1.1, { duration: 300 }),
        withTiming(1, { duration: 300 })
      );
    }, 1500);

    setTimeout(() => {
      logoTranslateY.value = withTiming(-screenHeight, {
        duration: 1200,
        easing: Easing.in(Easing.quad),
      });

      barAnimations.forEach((bar, index) => {
        bar.translateY.value = withDelay(
          index * 50,
          withTiming(-screenHeight, {
            duration: 1200,
            easing: Easing.in(Easing.quad),
          })
        );
      });

      animationTranslateY.value = withTiming(-screenHeight, {
        duration: 1200,
        easing: Easing.in(Easing.quad),
      });
    }, 2500);
  }, []);

  // --- Render functions ---
  const renderMainContent = () => (
    <ImageBackground
      source={require("../../../assets/pictures/auth/background.png")}
      style={tw`flex-1 justify-center items-center`}
      resizeMode="cover"
    >
      <View
        style={[tw`flex-1 w-full justify-between items-center`, { zIndex: 3 }]}
      >
        <View style={tw`mt-60 items-center`}>
          <Text
            style={[
              tw`text-white text-center text-3xl font-medium mb-2 max-w-[180px] font-bold`,
            ]}
          >
            Trải nghiệm giao hàng tối ưu cùng
          </Text>
          <Text
            style={[
              tw`text-white text-center text-5xl mb-8`,
              { fontFamily: "RobotoSerifBoldItalic" },
            ]}
          >
            GHEPXE
          </Text>
        </View>
        <View style={tw`mb-45 w-full items-center`}>
          <TouchableOpacity
            style={tw`bg-white/40 rounded-2xl w-70 py-3 mb-3`}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={tw`text-center text-base text-white font-semibold`}>
              Đăng Nhập
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={tw`text-center text-white text-base`}>
              Tạo tài khoản
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );

  const renderAnimatedOverlay = () => (
    <Animated.View
      style={[StyleSheet.absoluteFill, { zIndex: 10 }, animationContainerStyle]}
      pointerEvents="none"
    >
      <View style={tw`absolute inset-0 flex-row`}>
        {barAnimations.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              {
                width: screenWidth / 5,
                height: screenHeight,
                backgroundColor: "#00A982",
              },
              barStyles[index],
            ]}
          >
            <View
              style={[
                tw`absolute top-0 w-full h-40`,
                {
                  backgroundColor: "rgba(255,255,255,0.05)",
                  transform: [{ translateY: index * 30 }],
                },
              ]}
            />
          </Animated.View>
        ))}
      </View>
      <View style={tw`flex-1 items-center justify-center z-10`}>
        <Animated.View style={[tw`items-center`, logoAnimatedStyle]}>
          <Image
            source={require("../../../assets/pictures/logowhite.png")}
            style={tw`w-60 h-60`}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </Animated.View>
  );

  // --- Main render ---
  return (
    <View style={tw`flex-1`}>
      {renderMainContent()}
      {renderAnimatedOverlay()}
    </View>
  );
}
