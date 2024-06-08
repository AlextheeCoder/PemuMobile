import { useState } from "react";
import { View, Text, TouchableOpacity, Image ,FlatList} from "react-native";
import { router } from 'expo-router';

import { icons } from "../constants";

const AllBlogsCard = ({ blogs }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
  return (


    <FlatList
    data= {blogs}
    keyExtractor={(item) =>item.id.toString()} 
    renderItem={({item}) => (
        
      
    <View className="flex flex-col items-center px-4 mb-5 ">
    <View className="flex flex-row gap-3 items-start">
      <View className="flex justify-center items-center flex-row flex-1">
        

        <View className="flex justify-center flex-1 ml-3 gap-y-1">
          <Text
            className="font-psemibold text-sm underline"
            numberOfLines={1}
          >
             {item.title}
          </Text>
          <Text
            className="text-xs font-pregular"
            numberOfLines={1}
          >
           {formatDate(item.created_at)}
          </Text>
        </View>
      </View>

      <View className="pt-2">
        <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
      </View>
    </View>

    <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
            router.push({ pathname: `/blog/${item.slug}`, params: item });
         
        }}
        
        className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center" 
      >
        <Image
         source={{ uri: `https://pemuagrifood.com/storage/${item.image}` }}
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

export default AllBlogsCard;
