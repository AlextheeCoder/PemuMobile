import { View, Text } from 'react-native'
import React from 'react'

const InfoBox = ({title,subtitle,containerStyles,titleStyles,subtitleStyles}) => {
  return (
    <View className={containerStyles} >
      <Text className={`text-center font-psemibold ${titleStyles}`} >{title}</Text>
      <Text className={`text-sm text-center font-pregular ${subtitleStyles}`} >{subtitle}</Text>
    </View>
  )
}

export default InfoBox