import { useState } from "react";
import { View, Text, TouchableOpacity, Image ,FlatList} from "react-native";
import { router } from 'expo-router';

import { icons } from "../constants";

const AllVisitsCard = ({ visits }) => {

  return (
    <FlatList
    data= {visits}
    keyExtractor={(item) => item.$id} 
    renderItem={({item}) => (
      
    <View className="flex flex-col items-center px-4 mb-5 ">
    <View className="flex flex-row gap-3 items-start">
      <View className="flex justify-center items-center flex-row flex-1">
        <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
          <Image
           source={{
            uri: item.users.avatar,
          }}s
            className="w-full h-full rounded-lg"
            resizeMode="cover"
          />
        </View>

        <View className="flex justify-center flex-1 ml-3 gap-y-1">
          <Text
            className="font-psemibold text-sm"
            numberOfLines={1}
          >
          Farmer: {item.farmerID.name}
          </Text>
          <Text
            className="text-xs font-pregular"
            numberOfLines={1}
          >
           Visit by:  {item.users.username}
          </Text>
        </View>
      </View>

      <View className="pt-2">
        <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
      </View>
    </View>

    <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push({ pathname: `/visit/${item.farmerID.$id}`, params: item })}
        className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center" 
      >
        <Image
            source={{
              uri: item.picture1,
            }}
          className="w-full h-full rounded-xl mt-3"
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View className="border-b border-slate-300 w-full mt-5" >

      </View>
  </View>
  
       
    )}
   />

  );
};

export default AllVisitsCard;
