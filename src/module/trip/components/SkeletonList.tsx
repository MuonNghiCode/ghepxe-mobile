import React from "react";
import { View } from "react-native";
import tw from "twrnc";

export default function SkeletonList({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <View key={idx} style={tw`bg-white rounded-xl p-4 mb-3`}>
          {/* Header skeleton */}
          <View style={tw`flex-row items-center justify-between mb-3`}>
            <View style={tw`flex-row items-center flex-1`}>
              <View style={tw`w-10 h-10 bg-gray-200 rounded-full mr-3`} />
              <View style={tw`flex-1`}>
                <View style={tw`h-4 bg-gray-200 rounded w-24 mb-2`} />
                <View style={tw`h-3 bg-gray-200 rounded w-16`} />
              </View>
            </View>
            <View style={tw`w-16 h-6 bg-gray-200 rounded-full`} />
          </View>
          {/* Pickup details skeleton */}
          <View style={tw`flex-row items-center mb-3`}>
            <View style={tw`w-6 h-6 bg-gray-200 rounded-lg mr-2`} />
            <View style={tw`h-3 bg-gray-200 rounded flex-1`} />
          </View>
          {/* Route skeleton */}
          <View style={tw`mb-3`}>
            <View
              style={tw`flex-row items-center mb-2 bg-gray-100 p-3 rounded-lg`}
            >
              <View style={tw`flex-1`}>
                <View style={tw`h-4 bg-gray-200 rounded w-20`} />
              </View>
              <View style={tw`items-center mx-3`}>
                <View style={tw`h-3 w-12 bg-gray-200 rounded mb-1`} />
                <View style={tw`flex-row items-center`}>
                  <View style={tw`w-2 h-2 bg-gray-200 rounded-full`} />
                  <View style={tw`w-6 h-px bg-gray-200 mx-1`} />
                  <View style={tw`w-3 h-3 bg-gray-200 rounded-full`} />
                </View>
              </View>
              <View style={tw`flex-1`}>
                <View style={tw`h-4 bg-gray-200 rounded w-20`} />
              </View>
            </View>
          </View>
          {/* Price & CO2 skeleton */}
          <View style={tw`flex-row justify-between items-center mb-3`}>
            <View style={tw`h-4 bg-gray-200 rounded w-24`} />
            <View style={tw`h-4 bg-gray-200 rounded w-16`} />
          </View>
          {/* Button skeleton */}
          <View style={tw`flex-row gap-2`}>
            <View style={tw`flex-1 h-10 bg-gray-200 rounded-lg`} />
            <View style={tw`flex-1 h-10 bg-gray-200 rounded-lg`} />
          </View>
        </View>
      ))}
    </>
  );
}
