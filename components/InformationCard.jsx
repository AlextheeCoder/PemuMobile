import { View, Text } from 'react-native'
import React from 'react'

const InformationCard = ({title,info}) => {
  return (
<View className=" rounded-lg shadow-2xl p-4 bg-green-100 w-[45%] ml-5 h-[180px]">
   <View>
      <Text className="font-psemibold">{title}</Text>
      <Text className="font-semibold">{info}</Text>
   </View>
</View>

  )
}

export default InformationCard