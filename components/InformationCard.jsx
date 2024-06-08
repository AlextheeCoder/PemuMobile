import { View, Text } from 'react-native'
import React from 'react'

const InformationCard = ({title,info,textStyles}) => {
  return (
<View className=" rounded-lg shadow-2xl p-4 bg-primary w-[45%] ml-5 h-[180px]">
   <View>
      <Text className={`font-psemibold ${textStyles}`}>{title}</Text>
      <View>{info}</View>
   </View>
</View>

  )
}

export default InformationCard